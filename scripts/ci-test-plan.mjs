#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DEFAULT_SUITES, matchesSuiteTriggers } from './test-suites.mjs';

const eventName = process.env.GITHUB_EVENT_NAME || '';
const localNoChanges = !eventName && !process.env.CI_CHANGED_FILES;
// A schedule event has no diff base, so change detection degenerates to
// "everything changed". Guard it explicitly so the nightly run cannot flip on
// suites that hit the network or bill an API key.
const isSchedule = eventName === 'schedule';
const changedFiles = localNoChanges || isSchedule ? [] : getChangedFiles();
const forceDeterministic = localNoChanges || isSchedule || eventName === 'push' || eventName === 'workflow_dispatch';
const forceOptIn = eventName === 'workflow_dispatch';

const plan = {
  // core always runs: it is fast, and it is the suite that catches a command
  // registered in three of its four required places.
  core: true,
  plugin_e2e: forceDeterministic || matchesSuiteTriggers('plugin-e2e', changedFiles),
  cli_remote_e2e: forceOptIn,
};

writeGithubOutputs(plan);
printSummary(plan, changedFiles);

function getChangedFiles() {
  if (process.env.CI_CHANGED_FILES) {
    return process.env.CI_CHANGED_FILES
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter(Boolean);
  }

  const event = process.env.GITHUB_EVENT_NAME || '';
  const sha = process.env.GITHUB_SHA || 'HEAD';

  if (event === 'pull_request' && process.env.GITHUB_BASE_REF) {
    const base = `origin/${process.env.GITHUB_BASE_REF}`;
    return gitDiffNames(`${base}...${sha}`) || gitDiffNames(`${base}...HEAD`) || allChanged();
  }

  const before = process.env.GITHUB_EVENT_BEFORE;
  if (before && !/^0+$/.test(before)) {
    return gitDiffNames(`${before}..${sha}`) || allChanged();
  }

  return allChanged();
}

function allChanged() {
  return git(['ls-files']).split(/\r?\n/).filter(Boolean);
}

function gitDiffNames(range) {
  try {
    return git(['diff', '--name-only', range]).split(/\r?\n/).filter(Boolean);
  } catch {
    return null;
  }
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf-8' });
}

function writeGithubOutputs(outputs) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const lines = [];
  for (const [key, value] of Object.entries(outputs)) {
    lines.push(`${key}=${value ? 'true' : 'false'}`);
  }
  fs.appendFileSync(outputPath, lines.join('\n') + '\n');
}

function printSummary(outputs, files) {
  const deterministic = DEFAULT_SUITES
    .map((name) => `${name}=${outputs[name.replace(/-/g, '_')]}`)
    .join(' ');
  console.log(`Event: ${eventName || 'local'}`);
  console.log(`Changed files: ${files.length}`);
  console.log(`Deterministic suites: ${deterministic}`);
  console.log(`cli_remote_e2e=${outputs.cli_remote_e2e}`);
}
