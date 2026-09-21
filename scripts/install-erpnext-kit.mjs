#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'integrations/erpnext-lock.json'), 'utf8'));

function parse(args) {
  const options = { provider: 'both', dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (key === '--dry-run') options.dryRun = true;
    else if (key === '--help') options.help = true;
    else if (['--project', '--provider', '--frappe-source'].includes(key)) {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value for ${key}`);
      options[key.slice(2)] = args[++i];
    } else throw new Error(`Unknown argument: ${key}`);
  }
  if (!options.help && !options.project) throw new Error('--project is required');
  if (!['both', 'claude', 'codex'].includes(options.provider)) throw new Error('Use --provider both, claude or codex');
  return options;
}

// Symlinks could redirect a project-local install into global settings or another project.
function rejectSymlinkAncestors(file, boundary) {
  for (let p = file; p !== boundary; p = path.dirname(p)) {
    if (fs.existsSync(p) || (() => { try { fs.lstatSync(p); return true; } catch { return false; } })()) {
      if (fs.lstatSync(p).isSymbolicLink()) throw new Error(`Refusing symlink: ${p}`);
      if (!fs.statSync(p).isDirectory()) throw new Error(`Install path is not a directory: ${p}`);
    }
    if (path.dirname(p) === p) throw new Error('Install path escaped project');
  }
}

function filesAt(dir, prefix = '') {
  const files = new Map();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Refusing symlink: ${abs}`);
    if (entry.isDirectory()) {
      for (const [key, value] of filesAt(abs, rel)) files.set(key, value);
    } else if (entry.isFile()) files.set(rel, fs.readFileSync(abs));
    else throw new Error(`Unsupported file: ${abs}`);
  }
  return files;
}

function digest(files) {
  const hash = createHash('sha256');
  for (const [name, bytes] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(name.split(path.sep).join('/')).update('\0').update(String(bytes.length)).update('\0').update(bytes);
  }
  return hash.digest('hex');
}

// Read the pinned Git tree, never ignored local files that may contain credentials.
export function readCommittedFiles(checkout, revision, directory) {
  const prefix = `${directory.replace(/\/$/, '')}/`;
  const tree = execFileSync('git', ['-C', checkout, 'ls-tree', '-r', '-z', revision, '--', directory], { encoding: 'utf8' });
  const files = new Map();
  for (const record of tree.split('\0').filter(Boolean)) {
    const [header, name] = record.split('\t');
    const [mode, type] = header.split(' ');
    if (type !== 'blob' || !['100644', '100755'].includes(mode)) throw new Error(`Unsupported upstream entry: ${name}`);
    if (!name.startsWith(prefix)) throw new Error(`Unexpected upstream path: ${name}`);
    const bytes = execFileSync('git', ['-C', checkout, 'show', `${revision}:${name}`], { maxBuffer: 16 * 1024 * 1024 });
    files.set(name.slice(prefix.length), bytes);
  }
  return files;
}

export function installKit(args) {
  const options = parse(args);
  if (options.help) {
    console.log('node scripts/install-erpnext-kit.mjs --project /absolute/app/path [--provider both|claude|codex] [--frappe-source /checkout] [--dry-run]');
    return [];
  }
  const project = fs.realpathSync(path.resolve(options.project));
  if (!fs.statSync(project).isDirectory()) throw new Error('Project must be an existing directory');
  const providers = options.provider === 'both' ? ['claude', 'codex'] : [options.provider];
  const sources = [];
  for (const provider of providers) {
    const folder = provider === 'claude' ? '.claude' : '.agents';
    const source = path.join(root, folder, 'skills/pankit');
    const files = filesAt(source);
    const skill = files.get('SKILL.md')?.toString() || '';
    if (!skill.includes('sankaku_erp') || /\{\{[a-z_]+\}\}/.test(skill)) throw new Error('Build the ERPNext kit with bun run build:release first');
    sources.push({ provider, folder, name: 'pankit', files });
  }
  if (options['frappe-source']) {
    const upstream = fs.realpathSync(path.resolve(options['frappe-source']));
    const git = (...argv) => execFileSync('git', ['-C', upstream, ...argv], { encoding: 'utf8' }).trim();
    if (git('rev-parse', 'HEAD') !== lock.frappeSkills.commit) throw new Error('Frappe skill checkout does not match integrations/erpnext-lock.json');
    if (git('status', '--porcelain')) throw new Error('Frappe skill checkout must be clean');
    const license = execFileSync('git', ['-C', upstream, 'show', `${lock.frappeSkills.commit}:LICENSE.md`]);
    for (const rel of lock.frappeSkills.skills) {
      const files = readCommittedFiles(upstream, lock.frappeSkills.commit, `skills/source/${rel}`);
      if (!files.has('SKILL.md')) throw new Error(`Missing upstream SKILL.md: ${rel}`);
      files.set('UPSTREAM-LICENSE.txt', license);
      for (const provider of providers) sources.push({ provider, folder: provider === 'claude' ? '.claude' : '.agents', name: path.basename(rel), files });
    }
  }
  // Check every collision before writing anything. A changed skill must be backed up explicitly.
  const actions = sources.map(source => {
    const destination = path.join(project, source.folder, 'skills', source.name);
    rejectSymlinkAncestors(destination, project);
    const hash = digest(source.files);
    const exists = fs.existsSync(destination);
    if (exists && (!fs.statSync(destination).isDirectory() || digest(filesAt(destination)) !== hash)) {
      throw new Error(`Existing skill differs; back it up outside the skills directory before installing: ${destination}`);
    }
    return { ...source, destination, hash, status: exists ? 'unchanged' : 'install' };
  });
  for (const action of actions) {
    if (options.dryRun || action.status === 'unchanged') continue;
    const parent = path.dirname(action.destination);
    fs.mkdirSync(parent, { recursive: true });
    const stage = fs.mkdtempSync(path.join(parent, '.sankaku-install-'));
    try {
      for (const [rel, bytes] of action.files) {
        const file = path.join(stage, rel);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, bytes);
      }
      fs.renameSync(stage, action.destination);
    } finally {
      fs.rmSync(stage, { recursive: true, force: true });
    }
  }
  const report = actions.map(({ provider, name, destination, hash, status }) => ({ provider, name, destination, sha256: hash, status: options.dryRun && status === 'install' ? 'would-install' : status }));
  console.log(JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { installKit(process.argv.slice(2)); }
  catch (error) { console.error(`ERPNext kit installation failed: ${error.message}`); process.exitCode = 1; }
}
