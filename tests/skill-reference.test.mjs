import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKILL_SRC = join(ROOT, 'skill/SKILL.src.md');
const REFERENCE_DIR = join(ROOT, 'skill/reference');

function readSkillSource() {
  return readFileSync(SKILL_SRC, 'utf-8').replace(/\r\n?/g, '\n');
}

// Command rows in the router table look like: | `spec [feature]` | Define | ... |
function routerCommands(source) {
  return [...source.matchAll(/^\| `([^`\s]+)[^`]*` \|/gm)].map((m) => m[1]);
}

function referenceLinks(source) {
  return [...source.matchAll(/\(reference\/([a-z0-9.-]+\.md)\)/g)].map((m) => m[1]);
}

describe('skill routing contracts', () => {
  it('resolves every reference link in the router to a file on disk', () => {
    const missing = referenceLinks(readSkillSource())
      .filter((file) => !existsSync(join(REFERENCE_DIR, file)));
    assert.deepEqual(missing, [], `router links a reference file that does not exist: ${missing.join(', ')}`);
  });

  it('gives every router command a reference file named after it', () => {
    const source = readSkillSource();
    const missing = routerCommands(source)
      .filter((command) => !existsSync(join(REFERENCE_DIR, `${command}.md`)));
    assert.deepEqual(missing, [], `router command without a reference file: ${missing.join(', ')}`);
  });

  it('registers every router command in command-metadata.json', () => {
    const metadata = JSON.parse(readFileSync(join(ROOT, 'skill/scripts/command-metadata.json'), 'utf-8'));
    const missing = routerCommands(readSkillSource()).filter((command) => !metadata[command]);
    assert.deepEqual(missing, [], `router command missing from command-metadata.json: ${missing.join(', ')}`);
  });

  it('keeps command-metadata.json free of commands the router dropped', () => {
    const metadata = JSON.parse(readFileSync(join(ROOT, 'skill/scripts/command-metadata.json'), 'utf-8'));
    const commands = new Set(routerCommands(readSkillSource()));
    const orphans = Object.keys(metadata).filter((command) => !commands.has(command));
    assert.deepEqual(orphans, [], `command-metadata.json entry with no router row: ${orphans.join(', ')}`);
  });

  it('resolves relative links between reference files', () => {
    const broken = [];
    for (const file of readdirSync(REFERENCE_DIR).filter((f) => f.endsWith('.md'))) {
      const body = readFileSync(join(REFERENCE_DIR, file), 'utf-8');
      for (const match of body.matchAll(/\]\((\.\/)?([a-z0-9.-]+\.md)\)/g)) {
        if (!existsSync(join(REFERENCE_DIR, match[2]))) broken.push(`${file} -> ${match[2]}`);
      }
    }
    assert.deepEqual(broken, [], `broken reference link: ${broken.join(', ')}`);
  });
});
