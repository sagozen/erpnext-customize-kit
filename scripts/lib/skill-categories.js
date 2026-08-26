/**
 * Category map for the pankit sub-commands, consumed by the provider
 * transformers to build the generated `{{command_hint}}` in each provider's
 * argument-hint. A command with no entry here still routes; it just stays out
 * of the hint.
 *
 * Keep this in sync with the Category column of the router table in
 * skill/SKILL.src.md. tests/skill-reference.test.mjs pins the router against
 * command-metadata.json; this file is the third registration site.
 */

export const SKILL_CATEGORIES = {
  // DEFINE - decide what to build before building it
  spec: 'define',
  plan: 'define',
  design: 'define',
  // BUILD - make the change exist
  code: 'build',
  // VERIFY - prove it works and is safe to merge
  test: 'verify',
  review: 'verify',
  // SHIP - get it to users and leave a record
  docs: 'ship',
  release: 'ship',
  retro: 'ship',
};

export const CATEGORY_ORDER = ['define', 'build', 'verify', 'ship'];
