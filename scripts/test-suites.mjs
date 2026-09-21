import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_SUITES = ['core', 'plugin-e2e'];
export const OPT_IN_SUITES = ['cli-remote-e2e'];

const COMMON_INFRA_PATTERNS = [
  /^package\.json$/,
  /^bun\.lock$/,
  /^scripts\/run-tests\.mjs$/,
  /^scripts\/test-suites\.mjs$/,
  /^scripts\/ci-test-plan\.mjs$/,
  /^\.github\/workflows\/ci\.yml$/,
];

export const SUITES = {
  core: {
    description: 'Build orchestration, provider transforms, CLI helpers, skill routing, context, and storage unit tests.',
    triggers: [
      ...COMMON_INFRA_PATTERNS,
      /^scripts\//,
      /^skill\//,
      /^integrations\//,
      /^cli\//,
      /^README(\.npm)?\.md$/,
      /^\.claude-plugin\//,
    ],
    commands: [
      {
        runner: 'bun',
        files: [
          'tests/build.test.js',
          'tests/cli-ignores.test.js',
          'tests/windows-path-fix.test.js',
          'tests/lib/provider-blocks.test.js',
          'tests/lib/transformers/provider-blocks.test.js',
          'tests/lib/utils.test.js',
          'tests/lib/pankit-config.test.js',
          'tests/lib/detector-bundle.test.js',
          'tests/lib/transformers/factory.test.js',
          'tests/lib/transformers/providers.test.js',
          'tests/skills-cli.test.js',
          'tests/validate-plugin-versions.test.js',
          'tests/validate-plugin-manifest.test.js',
        ],
      },
      {
        runner: 'node',
        files: [
          'tests/ci-test-plan.test.mjs',
          'tests/cli-args.test.mjs',
          'tests/concept-seed.test.mjs',
          'tests/serve-question.test.mjs',
          'tests/context.test.mjs',
          'tests/context-signals.test.mjs',
          'tests/critique-storage.test.mjs',
          'tests/design-parser.test.mjs',
          'tests/github-sheriff.test.mjs',
          'tests/hook-build.test.mjs',
          'tests/hook.test.mjs',
          'tests/pankit-paths.test.mjs',
          'tests/openai-plugin.test.mjs',
          'tests/pin.test.mjs',
          'tests/release.test.mjs',
          'tests/doctor.test.mjs',
          'tests/staleness.test.mjs',
          'tests/skill-reference.test.mjs',
          'tests/erpnext-kit.test.mjs',
          'tests/target-args.test.mjs',
          'tests/surface-brief.test.mjs',
          'tests/template-extensions.test.mjs',
          'tests/test-suites.test.mjs',
          'tests/zip.test.mjs',
        ],
      },
    ],
  },
  'cli-e2e': {
    description: 'Deterministic CLI install/update tests against a local universal bundle.',
    commands: [
      {
        runner: 'bun',
        files: ['tests/skills-cli.test.js'],
      },
    ],
  },
  'cli-remote-e2e': {
    description: 'Remote CLI install/update smoke tests against the published bundle.',
    optIn: true,
    triggers: [
      ...COMMON_INFRA_PATTERNS,
      /^cli\/bin\/commands\/skills\.mjs$/,
      /^tests\/skills-cli\.test\.js$/,
    ],
    commands: [
      {
        runner: 'bun',
        env: { PANKIT_CLI_REMOTE_E2E: '1' },
        files: ['tests/skills-cli.test.js'],
      },
    ],
  },
  'plugin-e2e': {
    description: 'Install the committed ./plugin subtree into a real (sandboxed) Claude Code and assert skills, agents, and hooks all load. Skips when the claude CLI is not on PATH.',
    triggers: [
      ...COMMON_INFRA_PATTERNS,
      /^plugin\//,
      /^skill\/agents\//,
      /^scripts\/lib\/validate-plugin-manifest\.js$/,
      /^tests\/plugin-e2e\.test\.mjs$/,
    ],
    commands: [
      {
        runner: 'node',
        timeoutMs: 300000,
        forceExit: true,
        files: ['tests/plugin-e2e.test.mjs'],
      },
    ],
  },
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Every suite must select itself when one of its own test files changes.
// Generated from the files lists so the hand-written trigger patterns above
// only carry source paths and fixture directories; before this, four test
// files were registered in a suite that change-based CI could never select
// by editing them (serve-question, ci-test-plan, both validate-plugin-*),
// and tests/lib/detector-bundle.test.js triggered core while running in
// detector. The meta-test in tests/test-suites.test.mjs pins this invariant.
for (const suite of Object.values(SUITES)) {
  const ownFiles = suite.commands.flatMap((command) => command.files);
  suite.triggers = [
    ...(suite.triggers ?? []),
    ...ownFiles.map((file) => new RegExp(`^${escapeRegExp(file)}$`)),
  ];
}

export function expandSuites(requested) {
  const names = requested.length === 0 ? ['default'] : requested;
  const expanded = [];
  for (const name of names) {
    if (name === 'default' || name === 'all-local') {
      expanded.push(...DEFAULT_SUITES);
    } else if (name === 'all') {
      expanded.push(...DEFAULT_SUITES, ...OPT_IN_SUITES);
    } else if (SUITES[name]) {
      expanded.push(name);
    } else {
      throw new Error(`Unknown test suite "${name}". Run: node scripts/run-tests.mjs --list`);
    }
  }
  return [...new Set(expanded)];
}

export function suiteFiles(suiteNames) {
  const files = [];
  for (const name of suiteNames) {
    const suite = SUITES[name];
    if (!suite) throw new Error(`Unknown test suite "${name}"`);
    for (const command of suite.commands) {
      files.push(...command.files);
    }
  }
  return files;
}

export function findTestFiles(root = process.cwd()) {
  const out = [];
  const stack = [path.join(root, 'tests')];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
      } else if (/\.test\.(js|mjs)$/.test(entry.name)) {
        out.push(path.relative(root, abs).split(path.sep).join('/'));
      }
    }
  }
  return out.sort();
}

export function matchesSuiteTriggers(suiteName, changedFiles) {
  const suite = SUITES[suiteName];
  if (!suite) throw new Error(`Unknown test suite "${suiteName}"`);
  return changedFiles.some((file) => suite.triggers?.some((pattern) => pattern.test(file)));
}
