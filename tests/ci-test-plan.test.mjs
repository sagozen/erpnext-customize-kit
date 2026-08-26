import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const SCRIPT = 'scripts/ci-test-plan.mjs';

describe('ci-test-plan', () => {
  it('keeps docs-only pull requests on the core suite alone', () => {
    const outputs = runPlan({
      GITHUB_EVENT_NAME: 'pull_request',
      CI_CHANGED_FILES: 'docs/STYLE.md',
    });

    assert.equal(outputs.core, 'true');
    assert.equal(outputs.plugin_e2e, 'false');
    assert.equal(outputs.cli_remote_e2e, 'false');
  });

  it('routes plugin manifest changes to the plugin loader lane', () => {
    const outputs = runPlan({
      GITHUB_EVENT_NAME: 'pull_request',
      CI_CHANGED_FILES: 'scripts/lib/validate-plugin-manifest.js',
    });

    assert.equal(outputs.core, 'true');
    assert.equal(outputs.plugin_e2e, 'true');
  });

  it('routes agent definition changes to the plugin loader lane', () => {
    const outputs = runPlan({
      GITHUB_EVENT_NAME: 'pull_request',
      CI_CHANGED_FILES: 'skill/agents/pankit-manual-edit-applier.md',
    });

    assert.equal(outputs.plugin_e2e, 'true');
  });

  it('runs core for a skill router change even when no other lane matches', () => {
    const outputs = runPlan({
      GITHUB_EVENT_NAME: 'pull_request',
      CI_CHANGED_FILES: 'skill/SKILL.src.md',
    });

    assert.equal(outputs.core, 'true');
  });

  it('forces deterministic suites on push without forcing the remote smoke suite', () => {
    const outputs = runPlan({
      GITHUB_EVENT_NAME: 'push',
      CI_CHANGED_FILES: 'docs/STYLE.md',
    });

    assert.equal(outputs.core, 'true');
    assert.equal(outputs.plugin_e2e, 'true');
    assert.equal(outputs.cli_remote_e2e, 'false');
  });

  it('enables the remote smoke suite on manual dispatch', () => {
    const outputs = runPlan({
      GITHUB_EVENT_NAME: 'workflow_dispatch',
      CI_CHANGED_FILES: 'docs/STYLE.md',
    });

    assert.equal(outputs.cli_remote_e2e, 'true');
  });

  it('runs the deterministic suites on schedule without the remote smoke suite', () => {
    const outputs = runPlan({ GITHUB_EVENT_NAME: 'schedule' });

    assert.equal(outputs.core, 'true');
    assert.equal(outputs.plugin_e2e, 'true');
    assert.equal(outputs.cli_remote_e2e, 'false');
  });

  it('exposes every planned output to the workflow jobs that gate on it', () => {
    const workflow = readFileSync('.github/workflows/ci.yml', 'utf-8');

    assert.match(workflow, /plugin_e2e:\s*\$\{\{\s*steps\.plan\.outputs\.plugin_e2e\s*\}\}/);
    assert.match(workflow, /cli_remote_e2e:\s*\$\{\{\s*steps\.plan\.outputs\.cli_remote_e2e\s*\}\}/);
    assert.match(workflow, /cli-remote-e2e:/);
  });
});

function runPlan(env) {
  const tmp = mkdtempSync(join(tmpdir(), 'pankit-ci-plan-'));
  const outputPath = join(tmp, 'github-output');
  try {
    const result = spawnSync(process.execPath, [SCRIPT], {
      cwd: process.cwd(),
      encoding: 'utf-8',
      env: {
        ...process.env,
        GITHUB_OUTPUT: outputPath,
        ...env,
      },
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return Object.fromEntries(
      readFileSync(outputPath, 'utf-8')
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => line.split('=')),
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
