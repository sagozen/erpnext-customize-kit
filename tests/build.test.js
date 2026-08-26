import { describe, test, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import fs from 'fs';
import path from 'path';
import * as utils from '../scripts/lib/utils.js';
import * as transformers from '../scripts/lib/transformers/index.js';

const TEST_DIR = path.join(process.cwd(), 'test-tmp-build');

describe('build orchestration', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  test('should call readSourceFiles with root directory', () => {
    const readSourceFilesSpy = spyOn(utils, 'readSourceFiles').mockReturnValue({
      skills: []
    });

    const transformCursorSpy = spyOn(transformers, 'transformCursor').mockImplementation(() => {});
    const transformClaudeCodeSpy = spyOn(transformers, 'transformClaudeCode').mockImplementation(() => {});
    const transformAgentsSpy = spyOn(transformers, 'transformAgents').mockImplementation(() => {});
    const transformCodexSpy = spyOn(transformers, 'transformCodex').mockImplementation(() => {});

    // Simulate the build process
    const ROOT_DIR = TEST_DIR;
    const DIST_DIR = path.join(ROOT_DIR, 'dist');

    const { skills } = utils.readSourceFiles(ROOT_DIR);
    const patterns = utils.readPatterns(ROOT_DIR);
    transformers.transformCursor(skills, DIST_DIR, patterns);
    transformers.transformClaudeCode(skills, DIST_DIR, patterns);
    transformers.transformAgents(skills, DIST_DIR, patterns);
    transformers.transformCodex(skills, DIST_DIR, patterns);

    expect(readSourceFilesSpy).toHaveBeenCalledWith(ROOT_DIR);

    readSourceFilesSpy.mockRestore();
    transformCursorSpy.mockRestore();
    transformClaudeCodeSpy.mockRestore();
    transformAgentsSpy.mockRestore();
    transformCodexSpy.mockRestore();
  });

  test('should call all transformers with correct arguments', () => {
    const skills = [
      { name: 'skill1', description: 'Skill 1', license: 'MIT', body: 'Skill body 1' }
    ];
    const patterns = { patterns: [], antipatterns: [] };

    const readSourceFilesSpy = spyOn(utils, 'readSourceFiles').mockReturnValue({
      skills
    });
    const readPatternsSpy = spyOn(utils, 'readPatterns').mockReturnValue(patterns);

    const transformCursorSpy = spyOn(transformers, 'transformCursor').mockImplementation(() => {});
    const transformClaudeCodeSpy = spyOn(transformers, 'transformClaudeCode').mockImplementation(() => {});
    const transformAgentsSpy = spyOn(transformers, 'transformAgents').mockImplementation(() => {});
    const transformCodexSpy = spyOn(transformers, 'transformCodex').mockImplementation(() => {});

    const ROOT_DIR = TEST_DIR;
    const DIST_DIR = path.join(ROOT_DIR, 'dist');

    const sourceFiles = utils.readSourceFiles(ROOT_DIR);
    const patternData = utils.readPatterns(ROOT_DIR);
    transformers.transformCursor(sourceFiles.skills, DIST_DIR, patternData);
    transformers.transformClaudeCode(sourceFiles.skills, DIST_DIR, patternData);
    transformers.transformAgents(sourceFiles.skills, DIST_DIR, patternData);
    transformers.transformCodex(sourceFiles.skills, DIST_DIR, patternData);

    expect(transformCursorSpy).toHaveBeenCalledWith(skills, DIST_DIR, patterns);
    expect(transformClaudeCodeSpy).toHaveBeenCalledWith(skills, DIST_DIR, patterns);
    expect(transformAgentsSpy).toHaveBeenCalledWith(skills, DIST_DIR, patterns);
    expect(transformCodexSpy).toHaveBeenCalledWith(skills, DIST_DIR, patterns);

    readSourceFilesSpy.mockRestore();
    readPatternsSpy.mockRestore();
    transformCursorSpy.mockRestore();
    transformClaudeCodeSpy.mockRestore();
    transformAgentsSpy.mockRestore();
    transformCodexSpy.mockRestore();
  });

  test('should handle empty source files', () => {
    const patterns = { patterns: [], antipatterns: [] };

    const readSourceFilesSpy = spyOn(utils, 'readSourceFiles').mockReturnValue({
      skills: []
    });
    const readPatternsSpy = spyOn(utils, 'readPatterns').mockReturnValue(patterns);

    const transformCursorSpy = spyOn(transformers, 'transformCursor').mockImplementation(() => {});
    const transformClaudeCodeSpy = spyOn(transformers, 'transformClaudeCode').mockImplementation(() => {});
    const transformAgentsSpy = spyOn(transformers, 'transformAgents').mockImplementation(() => {});
    const transformCodexSpy = spyOn(transformers, 'transformCodex').mockImplementation(() => {});

    const ROOT_DIR = TEST_DIR;
    const DIST_DIR = path.join(ROOT_DIR, 'dist');

    const { skills } = utils.readSourceFiles(ROOT_DIR);
    const patternData = utils.readPatterns(ROOT_DIR);
    transformers.transformCursor(skills, DIST_DIR, patternData);
    transformers.transformClaudeCode(skills, DIST_DIR, patternData);
    transformers.transformAgents(skills, DIST_DIR, patternData);
    transformers.transformCodex(skills, DIST_DIR, patternData);

    expect(transformCursorSpy).toHaveBeenCalledWith([], DIST_DIR, patterns);
    expect(transformClaudeCodeSpy).toHaveBeenCalledWith([], DIST_DIR, patterns);
    expect(transformAgentsSpy).toHaveBeenCalledWith([], DIST_DIR, patterns);
    expect(transformCodexSpy).toHaveBeenCalledWith([], DIST_DIR, patterns);

    readSourceFilesSpy.mockRestore();
    readPatternsSpy.mockRestore();
    transformCursorSpy.mockRestore();
    transformClaudeCodeSpy.mockRestore();
    transformAgentsSpy.mockRestore();
    transformCodexSpy.mockRestore();
  });

  test('integration: full build creates all expected outputs', () => {
    // Create test source files
    const skillContent = `---
name: test-skill
description: A test skill
license: MIT
---

This is a test skill body.`;

    const skillDir = path.join(TEST_DIR, 'skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.src.md'), skillContent);

    // Run the build process
    const DIST_DIR = path.join(TEST_DIR, 'dist');
    const { skills } = utils.readSourceFiles(TEST_DIR);
    const patterns = utils.readPatterns(TEST_DIR);

    transformers.transformCursor(skills, DIST_DIR, patterns);
    transformers.transformClaudeCode(skills, DIST_DIR, patterns);
    transformers.transformAgents(skills, DIST_DIR, patterns);
    transformers.transformCodex(skills, DIST_DIR, patterns);

    // Verify Cursor outputs
    expect(fs.existsSync(path.join(DIST_DIR, 'cursor/.cursor/skills/test-skill/SKILL.md'))).toBe(true);

    // Verify Claude Code outputs
    expect(fs.existsSync(path.join(DIST_DIR, 'claude-code/.claude/skills/test-skill/SKILL.md'))).toBe(true);

    // Verify Codex Repo Skills outputs
    expect(fs.existsSync(path.join(DIST_DIR, 'agents/.agents/skills/test-skill/SKILL.md'))).toBe(true);

    // Verify Codex outputs
    expect(fs.existsSync(path.join(DIST_DIR, 'codex/.codex/skills/test-skill/SKILL.md'))).toBe(true);
  });

  test('integration: emits native subagent files for Codex, Claude Code, and Cursor', () => {
    const skillContent = `---
name: test-skill
description: A test skill
---

This is a test skill body.`;

    const agentContent = `---
name: asset-producer
codex-name: asset_producer
description: Produces assets from approved crops
tools: Read, Write
model: inherit
effort: medium
max-turns: 8
nickname-candidates:
  - Asset Plate
---

Do not redesign the approved crop.`;

    const skillDir = path.join(TEST_DIR, 'skill');
    fs.mkdirSync(path.join(skillDir, 'agents'), { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.src.md'), skillContent);
    fs.writeFileSync(path.join(skillDir, 'agents/asset-producer.md'), agentContent);

    const DIST_DIR = path.join(TEST_DIR, 'dist');
    const { skills } = utils.readSourceFiles(TEST_DIR);
    const patterns = utils.readPatterns(TEST_DIR);

    transformers.transformClaudeCode(skills, DIST_DIR, patterns);
    transformers.transformCodex(skills, DIST_DIR, patterns);
    transformers.transformCursor(skills, DIST_DIR, patterns);

    const claudeAgentPath = path.join(DIST_DIR, 'claude-code/.claude/agents/asset-producer.md');
    // Codex auto-discovers agents nested inside an installed skill, so the .toml
    // ships in the skill's own agents/ folder rather than a top-level .codex/agents/.
    const codexAgentPath = path.join(DIST_DIR, 'codex/.codex/skills/test-skill/agents/asset_producer.toml');
    // Cursor discovers repo-level subagents at .cursor/agents/<name>.md.
    const cursorAgentPath = path.join(DIST_DIR, 'cursor/.cursor/agents/asset-producer.md');

    expect(fs.existsSync(claudeAgentPath)).toBe(true);
    expect(fs.existsSync(codexAgentPath)).toBe(true);
    expect(fs.existsSync(cursorAgentPath)).toBe(true);

    const claudeAgent = fs.readFileSync(claudeAgentPath, 'utf-8');
    expect(claudeAgent).toContain('name: asset-producer');
    expect(claudeAgent).toContain('tools: Read, Write');
    expect(claudeAgent).toContain('maxTurns: 8');

    const codexAgent = fs.readFileSync(codexAgentPath, 'utf-8');
    expect(codexAgent).toContain('name = "asset_producer"');
    expect(codexAgent).toContain('model_reasoning_effort = "medium"');
    expect(codexAgent).toContain('nickname_candidates = ["Asset Plate"]');
    expect(codexAgent).toContain('developer_instructions =');


    // Cursor keeps model (inherit maps directly) and derives readonly from the
    // tool list; this agent carries Write, so no readonly field is emitted.
    const cursorAgent = fs.readFileSync(cursorAgentPath, 'utf-8');
    expect(cursorAgent).toContain('name: asset-producer');
    expect(cursorAgent).toContain('description: Produces assets from approved crops');
    expect(cursorAgent).toContain('model: inherit');
    expect(cursorAgent).toContain('is_background: false');
    expect(cursorAgent).toContain('Do not redesign the approved crop.');
    expect(cursorAgent).not.toContain('readonly:');
    expect(cursorAgent).not.toContain('tools:');
    expect(cursorAgent).not.toContain('effort:');
    expect(cursorAgent).not.toContain('maxTurns:');
  });

  test('integration: verify transformations are correct', () => {
    const skillContent = `---
name: audit
description: Run technical quality checks
user-invocable: true
argument-hint: "[TARGET=<value>]"
---

Please audit {{target}} for technical quality. Ask {{model}} for help.`;

    const skillDir = path.join(TEST_DIR, 'skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.src.md'), skillContent);

    const DIST_DIR = path.join(TEST_DIR, 'dist');
    const { skills } = utils.readSourceFiles(TEST_DIR);
    const patterns = utils.readPatterns(TEST_DIR);

    transformers.transformCursor(skills, DIST_DIR, patterns);
    transformers.transformClaudeCode(skills, DIST_DIR, patterns);
    transformers.transformAgents(skills, DIST_DIR, patterns);
    transformers.transformCodex(skills, DIST_DIR, patterns);

    // Verify Cursor: full frontmatter with user-invocable
    const cursorContent = fs.readFileSync(path.join(DIST_DIR, 'cursor/.cursor/skills/audit/SKILL.md'), 'utf-8');
    expect(cursorContent).toContain('---');
    expect(cursorContent).toContain('name: audit');
    expect(cursorContent).toContain('{{target}}');
    expect(cursorContent).toContain('the model');

    // Verify Claude Code: full frontmatter with user-invocable and argument-hint
    const claudeContent = fs.readFileSync(path.join(DIST_DIR, 'claude-code/.claude/skills/audit/SKILL.md'), 'utf-8');
    expect(claudeContent).toContain('---');
    expect(claudeContent).toContain('name: audit');
    expect(claudeContent).toContain('user-invocable: true');
    expect(claudeContent).toContain('{{target}}');
    expect(claudeContent).toContain('Claude');

    // Verify Codex Repo Skills: skill in skills directory
    expect(fs.existsSync(path.join(DIST_DIR, 'agents/.agents/skills/audit/SKILL.md'))).toBe(true);
    const agentsContent = fs.readFileSync(path.join(DIST_DIR, 'agents/.agents/skills/audit/SKILL.md'), 'utf-8');
    expect(agentsContent).toContain('{{target}}'); // No body transform, placeholder preserved
    expect(agentsContent).toContain('GPT');

    // Verify Codex: skill in skills directory
    expect(fs.existsSync(path.join(DIST_DIR, 'codex/.codex/skills/audit/SKILL.md'))).toBe(true);
    const codexContent = fs.readFileSync(path.join(DIST_DIR, 'codex/.codex/skills/audit/SKILL.md'), 'utf-8');
    expect(codexContent).toContain('{{target}}'); // No body transform, placeholder preserved
    expect(codexContent).toContain('GPT');
  });

  test('should call transformers in correct order', () => {
    const callOrder = [];

    const readSourceFilesSpy = spyOn(utils, 'readSourceFiles').mockReturnValue({
      skills: []
    });
    const readPatternsSpy = spyOn(utils, 'readPatterns').mockReturnValue({ patterns: [], antipatterns: [] });

    const transformCursorSpy = spyOn(transformers, 'transformCursor').mockImplementation(() => {
      callOrder.push('cursor');
    });
    const transformClaudeCodeSpy = spyOn(transformers, 'transformClaudeCode').mockImplementation(() => {
      callOrder.push('claude-code');
    });
    const transformAgentsSpy = spyOn(transformers, 'transformAgents').mockImplementation(() => {
      callOrder.push('agents');
    });
    const transformCodexSpy = spyOn(transformers, 'transformCodex').mockImplementation(() => {
      callOrder.push('codex');
    });

    const ROOT_DIR = TEST_DIR;
    const DIST_DIR = path.join(ROOT_DIR, 'dist');

    const { skills } = utils.readSourceFiles(ROOT_DIR);
    const patterns = utils.readPatterns(ROOT_DIR);
    transformers.transformCursor(skills, DIST_DIR, patterns);
    transformers.transformClaudeCode(skills, DIST_DIR, patterns);
    transformers.transformAgents(skills, DIST_DIR, patterns);
    transformers.transformCodex(skills, DIST_DIR, patterns);

    expect(callOrder).toEqual(['cursor', 'claude-code', 'agents', 'codex']);

    readSourceFilesSpy.mockRestore();
    readPatternsSpy.mockRestore();
    transformCursorSpy.mockRestore();
    transformClaudeCodeSpy.mockRestore();
    transformAgentsSpy.mockRestore();
    transformCodexSpy.mockRestore();
  });

  test('should include the agents transformer', () => {
    const { skills } = utils.readSourceFiles(TEST_DIR);
    const patterns = utils.readPatterns(TEST_DIR);
    const DIST_DIR = path.join(TEST_DIR, 'dist');

    // These should not throw
    transformers.transformAgents(skills, DIST_DIR, patterns);

    // Verify outputs
    expect(fs.existsSync(path.join(DIST_DIR, 'agents/.agents/skills'))).toBe(true);
  });

});

// Resolve a relative import specifier against the importer's bundle-relative
// path, mirroring Node ESM resolution against the set of bundled script names.
// Returns the matching bundled name, or null if nothing resolves.
function resolveBundledImport(importerName, specifier, names) {
  const dirParts = importerName.split('/').slice(0, -1);
  const parts = dirParts.concat(specifier.split('/'));
  const resolved = [];
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') { resolved.pop(); continue; }
    resolved.push(part);
  }
  const base = resolved.join('/');
  // ESM needs an explicit extension, but be tolerant of extensionless and
  // index specifiers so the check tracks real module-resolution behavior.
  const candidates = [base, `${base}.mjs`, `${base}.js`, `${base}/index.mjs`, `${base}/index.js`];
  return candidates.find((c) => names.has(c)) || null;
}

// Regression guard for issue #254: the bundled detector imported
// `../../lib/pankit-config.mjs`, a file that lives outside `cli/engine` and
// was never copied into the bundle, so `/pankit critique` crashed with
// "Cannot find module .../lib/pankit-config.mjs". This walks every bundled
// script and asserts each relative import resolves to another bundled file, so
// any future out-of-bundle dependency fails the build instead of the user.
describe('bundled skill scripts are self-contained', () => {
  const ROOT_DIR = process.cwd();
  const { skills } = utils.readSourceFiles(ROOT_DIR);
  const scripts = skills[0]?.scripts ?? [];
  const jsScripts = scripts.filter((s) => /\.(mjs|js)$/.test(s.name));
  const names = new Set(scripts.map((s) => s.name));

  // Static `import ... from '...'` and re-export `export ... from '...'` only;
  // dynamic `import()` of computed paths (e.g. detect.mjs) is out of scope.
  const importRe = /(?:^|[\s;])(?:import|export)\b[^'"`]*?\bfrom\s*['"]([^'"]+)['"]/g;

  // Drop comments first so an example like `// import ... from '...'` in a
  // doc comment (detector/node/file-system.mjs has one) isn't read as a real import.
  const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  test('the detector bundle includes its config dependency', () => {
    expect(names.has('lib/pankit-config.mjs')).toBe(true);
  });

  test('every relative import resolves to a bundled file', () => {
    const broken = [];
    for (const script of jsScripts) {
      const source = stripComments(script.content);
      importRe.lastIndex = 0;
      let match;
      while ((match = importRe.exec(source)) !== null) {
        const specifier = match[1];
        if (!specifier.startsWith('.')) continue; // bare/node specifiers
        if (!resolveBundledImport(script.name, specifier, names)) {
          broken.push(`${script.name} -> ${specifier}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });
});

describe('degraded-mode fallback reference generation', () => {
  const ROOT = process.cwd();
  const DEGRADED_TEST_DIR = path.join(ROOT, 'test-tmp-degraded');
  const DIST = path.join(DEGRADED_TEST_DIR, 'dist');

  const readDegraded = (provider, configDir, role) =>
    fs.readFileSync(
      path.join(DIST, provider, configDir, 'skills', 'pankit', 'reference', 'degraded', `${role}.md`),
      'utf-8'
    );

  beforeEach(() => {
    if (fs.existsSync(DEGRADED_TEST_DIR)) fs.rmSync(DEGRADED_TEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(DEGRADED_TEST_DIR, { recursive: true });
    const { skills } = utils.readSourceFiles(ROOT);
    transformers.transformClaudeCode(skills, DIST);
    transformers.transformCodex(skills, DIST);
  });

  afterEach(() => {
    if (fs.existsSync(DEGRADED_TEST_DIR)) fs.rmSync(DEGRADED_TEST_DIR, { recursive: true, force: true });
  });

  test('a build emits reference/degraded/<role>.md for every agent, prefix-stripped', () => {
    const dir = path.join(DIST, 'codex', '.codex', 'skills', 'pankit', 'reference', 'degraded');
    const files = fs.readdirSync(dir).sort();
    expect(files).toEqual(['manual-edit-applier.md']);
  });

  test('a fallback opens with the preamble and carries a distinctive body phrase', () => {
    const content = readDegraded('codex', '.codex', 'manual-edit-applier');
    expect(content.startsWith('<!-- Generated from skill/agents/ at build time. Do not edit; edit the agent definition. -->'))
      .toBe(true);
    expect(content).toContain('This harness has no subagent capability, so you are running this role inline.');
    // Distinctive phrase from the agent body proves the source body was inlined.
    expect(content).toContain('Apply');
  });

  test('generated fallbacks pass through provider-block compilation (codex keeps its block, others strip it)', () => {
    // Standalone provider blocks are the shape compileProviderBlocks compiles.
    // A synthetic agent proves the degraded path runs the same compilation as
    // ordinary reference files, with the right provider tags per target.
    const synthetic = {
      name: 'pankit',
      description: 'synthetic',
      body: 'Synthetic skill body.',
      agents: [
        {
          name: 'pankit-synthetic',
          body: 'Shared body line.\n\n<codex>\nCODEX_ONLY_MARKER for the codex target.\n</codex>\n\nMore shared body.',
        },
      ],
    };
    const synthDist = path.join(DEGRADED_TEST_DIR, 'synth');
    transformers.transformCodex([synthetic], synthDist);
    transformers.transformClaudeCode([synthetic], synthDist);
    const read = (provider, configDir) =>
      fs.readFileSync(
        path.join(synthDist, provider, configDir, 'skills', 'pankit', 'reference', 'degraded', 'synthetic.md'),
        'utf-8'
      );
    const codex = read('codex', '.codex');
    const claude = read('claude-code', '.claude');
    expect(codex).toContain('CODEX_ONLY_MARKER');
    expect(claude).not.toContain('CODEX_ONLY_MARKER');
    // Both still carry the preamble and the shared body.
    expect(codex.startsWith('<!-- Generated from skill/agents/')).toBe(true);
    expect(claude).toContain('More shared body.');
  });

  test('the source repo contains no hand-authored degraded/ reference files (generation-only)', () => {
    expect(fs.existsSync(path.join(ROOT, 'skill', 'reference', 'degraded'))).toBe(false);
  });
});

describe('Cursor subagent generation', () => {
  const ROOT = process.cwd();
  const CURSOR_TEST_DIR = path.join(ROOT, 'test-tmp-cursor-agents');
  const DIST = path.join(CURSOR_TEST_DIR, 'dist');
  const AGENTS_DIR = path.join(DIST, 'cursor', '.cursor', 'agents');

  beforeEach(() => {
    if (fs.existsSync(CURSOR_TEST_DIR)) fs.rmSync(CURSOR_TEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(CURSOR_TEST_DIR, { recursive: true });
    const { skills } = utils.readSourceFiles(ROOT);
    transformers.transformCursor(skills, DIST);
  });

  afterEach(() => {
    if (fs.existsSync(CURSOR_TEST_DIR)) fs.rmSync(CURSOR_TEST_DIR, { recursive: true, force: true });
  });

  test('emits .cursor/agents/<name>.md for every shipped agent', () => {
    const files = fs.readdirSync(AGENTS_DIR).sort();
    expect(files).toEqual(['pankit-manual-edit-applier.md']);
  });

  test('frontmatter maps name, description, model inherit, is_background false', () => {
    for (const name of fs.readdirSync(AGENTS_DIR)) {
      const content = fs.readFileSync(path.join(AGENTS_DIR, name), 'utf-8');
      const frontmatter = content.split('---')[1];
      expect(frontmatter).toContain(`name: ${name.replace(/\.md$/, '')}`);
      expect(frontmatter).toContain('description: ');
      expect(frontmatter).toContain('model: inherit');
      expect(frontmatter).toContain('is_background: false');
      // Cursor's effort option requires an explicit model id, incompatible
      // with inherit, and our tool names are not Cursor's vocabulary.
      expect(frontmatter).not.toContain('tools:');
      expect(frontmatter).not.toContain('effort:');
      expect(frontmatter).not.toContain('maxTurns:');
      // readonly is set only for a role whose tool list has no Write or Edit.
      expect(frontmatter).not.toContain('readonly:');
    }
  });

  test('bodies are compiled: placeholders resolved, rule markers stripped', () => {
    for (const name of fs.readdirSync(AGENTS_DIR)) {
      const content = fs.readFileSync(path.join(AGENTS_DIR, name), 'utf-8');
      expect(content).not.toContain('{{');
      expect(content).not.toMatch(/<!--\s*rule:/);
    }
    const applier = fs.readFileSync(path.join(AGENTS_DIR, 'pankit-manual-edit-applier.md'), 'utf-8');
    expect(applier).toContain('name: pankit-manual-edit-applier');
  });
});

// Regression guard for the gap that shipped literal `{{scripts_path}}` inside
// the Codex dists' nested agent .toml: three separate code paths emit an agent
// body, and one of them skipped placeholder substitution and rule-marker
// stripping. Assert every surface, not just the one that was broken.
describe('agent bodies resolve placeholders on every surface that ships them', () => {
  const ROOT = process.cwd();
  const AGENT_TEST_DIR = path.join(ROOT, 'test-tmp-agent-placeholders');

  // A synthetic agent carrying every token, so the assertion holds no matter
  // which real agents the repository currently ships.
  const synthetic = {
    name: 'pankit',
    description: 'synthetic',
    body: 'Synthetic skill body.',
    agents: [
      {
        name: 'pankit-synthetic',
        codexName: 'pankit_synthetic',
        description: 'synthetic agent',
        body: 'Run `node {{scripts_path}}/embed-prompt.mjs` and ask {{model}}. <!-- rule:synthetic-marker -->',
      },
    ],
  };

  // [emitted file, the scripts path that provider installs to]
  const SURFACES = [
    // Nested Codex .toml: the skill install is the whole delivery for these.
    ['codex/.codex/skills/pankit/agents/pankit_synthetic.toml', '.codex/skills/pankit/scripts'],
    ['agents/.agents/skills/pankit/agents/pankit_synthetic.toml', '.agents/skills/pankit/scripts'],
    // Native agent files.
    ['claude-code/.claude/agents/pankit-synthetic.md', '.claude/skills/pankit/scripts'],
    ['cursor/.cursor/agents/pankit-synthetic.md', '.cursor/skills/pankit/scripts'],
    // Degraded fallback reference generated from the same agent definition.
    ['codex/.codex/skills/pankit/reference/degraded/synthetic.md', '.codex/skills/pankit/scripts'],
  ];

  const DIST = path.join(AGENT_TEST_DIR, 'dist');

  beforeEach(() => {
    if (fs.existsSync(AGENT_TEST_DIR)) fs.rmSync(AGENT_TEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(AGENT_TEST_DIR, { recursive: true });
    transformers.transformCodex([synthetic], DIST);
    transformers.transformAgents([synthetic], DIST);
    transformers.transformClaudeCode([synthetic], DIST);
    transformers.transformCursor([synthetic], DIST);
  });

  afterEach(() => {
    if (fs.existsSync(AGENT_TEST_DIR)) fs.rmSync(AGENT_TEST_DIR, { recursive: true, force: true });
  });

  test('every surface ships a runnable scripts path, never the raw token', () => {
    for (const [relPath, scriptsPath] of SURFACES) {
      const content = fs.readFileSync(path.join(DIST, relPath), 'utf-8');
      expect(content).toContain(`node ${scriptsPath}/embed-prompt.mjs`);
      expect(content).not.toContain('{{scripts_path}}');
    }
  });

  test('no emitted agent body carries an unresolved placeholder or a rule marker', () => {
    for (const [relPath] of SURFACES) {
      const content = fs.readFileSync(path.join(DIST, relPath), 'utf-8');
      expect(content).not.toContain('{{');
      expect(content).not.toMatch(/<!--\s*rule:/);
    }
    const codexToml = fs.readFileSync(
      path.join(DIST, 'codex/.codex/skills/pankit/agents/pankit_synthetic.toml'),
      'utf-8'
    );
    // The model name belongs to PROVIDER_PLACEHOLDERS and may change; what
    // this pins is that {{model}} resolved to something.
    expect(codexToml).toMatch(/and ask \S+\./);
  });

  test('the shipped agents emit on the same surfaces as the synthetic one', () => {
    const shippedDist = path.join(AGENT_TEST_DIR, 'shipped');
    const { skills } = utils.readSourceFiles(ROOT);
    transformers.transformClaudeCode(skills, shippedDist);
    const agentsDir = path.join(shippedDist, 'claude-code', '.claude', 'agents');
    const emitted = fs.readdirSync(agentsDir);
    expect(emitted.length).toBeGreaterThan(0);
    for (const name of emitted) {
      const content = fs.readFileSync(path.join(agentsDir, name), 'utf-8');
      expect(content).not.toContain('{{');
      expect(content).not.toMatch(/<!--\s*rule:/);
    }
  });
});
