# Repository Guidelines

PanKit is the Sankaku ERPNext implementation kit for made-to-measure curtain projects. One user-invocable skill, `pankit`, carries 9 commands. Read `docs/getting-started-vi.md` for onboarding and `docs/erpnext-kit-architecture.md` for ownership boundaries. Keep business guidance Vietnamese-first, customer rules explicit, and Frappe APIs version-verified.

## Project Structure & Module Organization

`skill/` is the source of truth for the skill: `SKILL.src.md` (frontmatter, shared rules, command router table), `reference/` (one file per command), `scripts/` (executable helpers), and `agents/` (subagent definitions). Build logic lives in `scripts/`, with provider configs in `scripts/lib/transformers/`. The CLI lives in `cli/`, the browser extension in `extension/`, and coverage in `tests/`. `dist/` and `build/` are generated and gitignored. The root harness folders (`.claude/`, `.cursor/`, `.codex/`, `.agents/`) and `plugin/` are generated distribution artifacts, tracked for direct repo installs, not hand-authored source.

## Build, Test, and Development Commands

- `bun run build` - source-first build: regenerate `dist/` and run the validators without syncing tracked harness folders.
- `bun run build:release` - release build: full build plus sync of tracked root harness folders and `plugin/`.
- `bun run rebuild` / `bun run rebuild:release` - clean, then the corresponding build.
- `bun run test` - the default suite: unit tests plus the plugin loader check.
- `bun run test:core` - unit tests only.
- `bun run test:plugin-e2e` - the plugin loader check only, for fast iteration on `plugin/`, `skill/agents/`, or the build.
- `bun test tests/build.test.js` - run one focused Bun test.
- `bun run build:browser` / `bun run build:extension` - rebuild the carried-over browser bundles.

Run `bun run build` after changing anything in `skill/`, transformer code, or user-facing counts. Use `bun run build:release` only when intentionally refreshing generated provider output.

## Generated Provider Output Policy

The root harness folders and `plugin/` stay tracked so the default branch remains installable for direct GitHub, `npx skills`, and submodule users. They are still generated artifacts. Edit `skill/`, `scripts/`, `cli/`, and `tests/`; do not hand-edit generated output.

## Adding a Command

Four registration sites, pinned by `tests/skill-reference.test.mjs`:

1. `skill/reference/<command>.md`
2. the router table row in `skill/SKILL.src.md`
3. `skill/scripts/command-metadata.json`
4. `SKILL_CATEGORIES` in `scripts/lib/skill-categories.js`

Optionally `VALID_COMMANDS` in `skill/scripts/pin.mjs` and `PANKIT_SUB_COMMANDS` in `scripts/lib/utils.js`. The command count in `README.md`, this file, and both plugin manifests is validated against the router table at build time.

## Coding Style & Naming Conventions

Two-space indentation, ES modules, and kebab-case file names for JavaScript. Match the structure and comment density of the file you are editing. Reference files are written to the model in second person and imperative mood, and stay short, because they are loaded in full on every invocation.

## Prose

`docs/STYLE.md` is the editorial brief, enforced by two build gates: `validateProse` over the READMEs and `validateSkillProse` over `skill/**/*.md`. No em dashes in either. Do not work around the regex silently; propose a `docs/STYLE.md` amendment instead.

## Commit & Version Guidelines

Conventional commit format, one concern per commit, no secrets. Changes do not bump versions and do not add changelog entries; bumping is a release step. The CLI (`package.json`), the skills (`.claude-plugin/plugin.json`, mirrored in `marketplace.json`), and the extension (`extension/manifest.json`) version independently.

## AI Assistance Disclosure

AI agents must disclose AI assistance in commits, pull request descriptions, comments, and issue text.
