import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readCommittedFiles } from '../scripts/install-erpnext-kit.mjs';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('..', import.meta.url));
const installer = path.join(root, 'scripts/install-erpnext-kit.mjs');
function sandbox(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'erpnext-kit-'));
  try { return run(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
function install(dir, ...args) {
  return JSON.parse(execFileSync(process.execPath, [installer, '--project', dir, ...args], { encoding: 'utf8' }));
}
function attempt(dir, ...args) {
  return spawnSync(process.execPath, [installer, '--project', dir, ...args], { encoding: 'utf8' });
}

describe('ERPNext project-local kit installation', () => {
  it('pins the exact MCP dependency lock used in integration verification', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'integrations/erpnext-lock.json'), 'utf8'));
    const bytes = fs.readFileSync(path.join(root, 'integrations', manifest.mcp.dependencyLock));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.mcp.dependencyLockSha256);
    const dependencies = JSON.parse(bytes).packages[''].dependencies;
    assert.ok(dependencies['@modelcontextprotocol/sdk']);
    assert.ok(dependencies.axios);
  });
  it('previews without writing, installs both providers and repeats without changes', () => sandbox(dir => {
    assert.equal(install(dir, '--dry-run').length, 2);
    assert.deepEqual(fs.readdirSync(dir), []);
    const installed = install(dir);
    assert.ok(installed.every(row => row.status === 'install'));
    for (const folder of ['.claude', '.agents']) {
      const base = path.join(dir, folder, 'skills/pankit');
      assert.ok(fs.existsSync(path.join(base, 'reference/curtain-domain.md')));
      assert.ok(fs.existsSync(path.join(base, 'reference/migration.md')));
      const body = fs.readFileSync(path.join(base, 'SKILL.md'), 'utf8');
      assert.doesNotMatch(body, /\{\{[a-z_]+\}\}/);
      assert.match(body, folder === '.claude' ? /\/pankit/ : /\$pankit/);
      if (folder === '.agents') {
        const ui = fs.readFileSync(path.join(base, 'agents/openai.yaml'), 'utf8');
        assert.match(ui, /\$pankit.*ERPNext/);
        assert.doesNotMatch(ui, /polish this frontend/);
      }
    }
    assert.ok(install(dir).every(row => row.status === 'unchanged'));
  }));

  it('checks all collisions before writing and preserves local changes', () => sandbox(dir => {
    install(dir, '--provider', 'codex');
    const file = path.join(dir, '.agents/skills/pankit/SKILL.md');
    fs.appendFileSync(file, '\nCustomer-specific instruction\n');
    const result = attempt(dir);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Existing skill differs/);
    assert.equal(fs.existsSync(path.join(dir, '.claude')), false);
    assert.match(fs.readFileSync(file, 'utf8'), /Customer-specific instruction/);
  }));

  it('refuses a symlinked provider directory without changing its destination', () => sandbox(dir => {
    const elsewhere = path.join(dir, 'elsewhere');
    fs.mkdirSync(elsewhere);
    fs.symlinkSync(elsewhere, path.join(dir, '.agents'), 'dir');
    const result = attempt(dir, '--provider', 'codex');
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Refusing symlink/);
    assert.deepEqual(fs.readdirSync(elsewhere), []);
  }));

  it('rejects bad arguments and an unpinned upstream checkout before writing', () => sandbox(dir => {
    assert.equal(attempt(dir, '--provider', 'unknown').status, 1);
    const result = attempt(dir, '--frappe-source', root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /does not match/);
    assert.deepEqual(fs.readdirSync(dir), []);
  }));

  it('rejects file ancestors in dry-run and real install before writing either provider', () => sandbox(dir => {
    fs.mkdirSync(path.join(dir, '.agents'));
    fs.writeFileSync(path.join(dir, '.agents/skills'), 'keep');
    for (const args of [['--dry-run'], []]) {
      const result = attempt(dir, ...args);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /not a directory/);
      assert.equal(fs.existsSync(path.join(dir, '.claude')), false);
    }
    assert.equal(fs.readFileSync(path.join(dir, '.agents/skills'), 'utf8'), 'keep');
  }));

  it('copies only committed upstream files, excluding ignored and untracked local artifacts', () => sandbox(dir => {
    const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' }).trim();
    git('init', '-q');
    fs.mkdirSync(path.join(dir, 'skill'));
    fs.writeFileSync(path.join(dir, '.gitignore'), '*.local\n');
    fs.writeFileSync(path.join(dir, 'skill/SKILL.md'), 'committed instructions');
    git('add', '.');
    git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'test: record source');
    fs.writeFileSync(path.join(dir, 'skill/private.local'), 'local only');
    fs.writeFileSync(path.join(dir, 'skill/scratch.txt'), 'untracked');
    const files = readCommittedFiles(dir, 'HEAD', 'skill');
    assert.deepEqual([...files.keys()], ['SKILL.md']);
    assert.equal(files.get('SKILL.md').toString(), 'committed instructions');
  }));
});
