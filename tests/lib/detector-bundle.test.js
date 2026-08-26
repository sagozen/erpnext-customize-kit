import { describe, expect, test } from 'bun:test';
import fs from 'fs';
import path from 'path';
import { readSourceFiles } from '../../scripts/lib/utils.js';

const ROOT = process.cwd();

describe('skill detector bundle', () => {
  test('adds the detector wrapper and engine files to skill scripts', () => {
    const { skills } = readSourceFiles(ROOT);
    const skill = skills.find(s => s.name === 'pankit');
    const scriptNames = new Set(skill.scripts.map(s => s.name));

    expect(scriptNames.has('detect.mjs')).toBe(true);
    expect(scriptNames.has('detector/detect-antipatterns.mjs')).toBe(true);
    expect(scriptNames.has('detector/detect-antipatterns-browser.js')).toBe(true);
    expect(scriptNames.has('detector/cli/main.mjs')).toBe(true);
    expect(scriptNames.has('detector/engines/static-html/detect-html.mjs')).toBe(true);
  });

  test('the bundled detector wrapper is reachable from the skill scripts dir', () => {
    const wrapper = fs.readFileSync(path.join(ROOT, 'skill/scripts/detect.mjs'), 'utf-8');

    // The wrapper must reach the vendored engine, not shell out to a published
    // package: an installed skill has no npm dependency to resolve.
    expect(wrapper).toContain("'detector', 'detect-antipatterns.mjs'");
    expect(wrapper).not.toContain('npx pankit detect');
  });
});
