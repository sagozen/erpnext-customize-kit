# Project Instructions for Claude

## What this repository is

PanKit is the Sankaku ERPNext implementation kit for made-to-measure curtain businesses. Read `docs/getting-started-vi.md` and `docs/erpnext-kit-architecture.md`. The nine command references are real delivery instructions. Keep customer rules separate from framework guidance, explain business terms in Vietnamese and verify APIs against the installed version. This repository contains the agent kit; customer application code belongs in a separate `sankaku_erp` app.

## Architecture

There is **one** user-invocable skill, `pankit`, with **9 commands** underneath it. Users type `/pankit spec`, `/pankit review`, and so on. The skill is defined in `skill/`:

- `SKILL.src.md` — frontmatter (auto-trigger description, `allowed-tools`), the shared rules that hold across every stage, and the **Commands** router table. Provider `SKILL.md` files are generated from this source. It is named `SKILL.src.md`, not `SKILL.md`, so the `skills` CLI does not discover and install the uncompiled source with its placeholders unresolved.
- `reference/` — one `<command>.md` per command, plus the shared files the router loads outside the command table (`routing.md`) and the utility-command references (`doctor.md`, `hooks.md`, `live.md`, `live-setup.md`). When a sub-command is matched, the router loads its reference file and nothing else.
- `scripts/command-metadata.json` — single source of truth for each command's description and argument hint. Both the build and `pin.mjs` read from it.
- `scripts/pin.mjs` — creates and removes lightweight redirect shims so a user can have `/review` as a standalone shortcut that delegates to `/pankit review`.

**Do not add standalone top-level skills** unless there is a strong reason. The consolidation is the point: the `/` menu fills up fast once a user installs a few plugins.

### Stages (Define / Build / Verify / Ship)

The `## Stages` section in `SKILL.src.md` names what a pass is accountable for producing:

- **Define** — the change is described well enough that two people would build the same thing. Produces a spec, plan, or decision record. No code.
- **Build** — the change exists and matches the accepted scope.
- **Verify** — the change is shown to work and shown to be safe to merge.
- **Ship** — the change reaches users, is documented, and leaves a record.

Stage is chosen from what the request is *missing*, not from what sounds most appealing. A request to "add caching" with no written scope is Define work.

The same four names are the Category column of the router table and the keys of `CATEGORY_ORDER` in `scripts/lib/skill-categories.js`. Changing one means changing all three.

## The four registration sites

Adding or renaming a command touches four files, and `tests/skill-reference.test.mjs` fails if they disagree:

1. `skill/reference/<command>.md` — the instructions.
2. The router table row in `skill/SKILL.src.md` — routing plus the count the build validates.
3. `skill/scripts/command-metadata.json` — description and argument hint.
4. `SKILL_CATEGORIES` in `scripts/lib/skill-categories.js` — grouping for the generated `{{command_hint}}`.

Two optional sites: `VALID_COMMANDS` in `skill/scripts/pin.mjs` (pinnable as a standalone shortcut) and `PANKIT_SUB_COMMANDS` in `scripts/lib/utils.js` (appears in generated next-step suggestions).

The command count is validated at build time against the router table in `README.md`, `AGENTS.md`, `.claude-plugin/plugin.json`, and `.claude-plugin/marketplace.json`. `generateCounts` in `scripts/build.js` fails the build when any of them disagrees.

## Build System

The build compiles `skill/` into provider-specific output in `dist/`. The default build is source-first and does not sync the tracked root harness folders; the release build performs that sync.

```bash
bun run build            # dist/ output, no root harness sync
bun run build:release    # dist/ output plus root harness dirs and plugin/
bun run rebuild          # clean and rebuild without root harness sync
bun run rebuild:release  # clean and rebuild with root harness sync
```

Source files use placeholders replaced per provider:

- `{{model}}` — model name (Claude, GPT, the model)
- `{{config_file}}` — config file name (CLAUDE.md, .cursorrules, AGENTS.md)
- `{{ask_instruction}}` — how to ask the user a question. **Every value is a complete capitalized sentence**, so every call site must be sentence-initial. `validateAskInstructionSites` in `scripts/build.js` enforces it.
- `{{command_prefix}}` — `/` or `$`
- `{{available_commands}}` — from `PANKIT_SUB_COMMANDS` in `scripts/lib/utils.js`
- `{{command_hint}}` — commands grouped by category, generated from `command-metadata.json` plus `SKILL_CATEGORIES`
- `{{scripts_path}}` — provider-aware path to the skill's scripts directory

### Providers

Four targets, defined in `scripts/lib/transformers/providers.js`: `claude-code` (`.claude/`), `cursor` (`.cursor/`), `codex` (`.codex/`), and `agents` (`.agents/`). Every entry in `PROVIDERS` needs a matching named export in `scripts/lib/transformers/index.js`; those exports exist as stable spy targets for `tests/build.test.js` and are not dead code.

Adding a provider back is a matter of adding its config object and its export. The factory handles the rest.

### Generated provider output policy

`.claude/`, `.cursor/`, `.codex/`, and `.agents/` are **intentionally committed**. They are what an installer reads. They are generated distribution artifacts, not authoring surfaces: edit `skill/`, `scripts/`, `cli/`, and `tests/`, then rebuild. Regenerate provider outputs when kit instructions change so direct project installs receive the same verified guidance.

Local state files inside harness directories (for example `.claude/settings.local.json`) are gitignored.

## Prose

The editorial brief is `docs/STYLE.md`. Read it before editing the READMEs or any user-facing copy.

Two gates run at build time:

- `validateProse` scans `README.md` and `README.npm.md` against the full denylist: em dashes, the `--` substitute, and a list of phrases that read as AI tells.
- `validateSkillProse` scans `skill/**/*.md` against a tighter subset, because the full ruleset does not fit instruction text. An em dash in `skill/reference/*.md` fails the build; an em dash in a `skill/scripts/*.mjs` code comment does not.

**Do not work around the regex silently.** If a banned word has earned a real meaning here, raise it as a `docs/STYLE.md` amendment.

## Testing

```bash
bun run test              # default suite: unit tests plus the plugin loader check
bun run test:core         # unit tests only
bun run test:plugin-e2e   # plugin loader check only
```

Unit tests run under `bun test`; the routing and context tests run under `node --test`. `scripts/run-tests.mjs` handles the split, and `scripts/test-suites.mjs` owns the suite definitions.

`tests/skill-reference.test.mjs` is the structural guard worth knowing: it pins the router table against the reference files on disk and against `command-metadata.json`, in both directions, and checks that relative links between reference files resolve. It is what catches a command added in three places instead of four.

**Plugin loader E2E** (`tests/plugin-e2e.test.mjs`) installs the committed `./plugin` subtree into a real Claude Code sandboxed via `CLAUDE_CONFIG_DIR` in a temp dir, then asserts the component inventory from `claude plugin details`. It skips cleanly when the `claude` CLI is not on PATH. The manifest contract itself is pinned deterministically by `scripts/lib/validate-plugin-manifest.js` and enforced as a build gate. Never add a key to the generated plugin manifest without verifying it against a real install and extending `KNOWN_LOADER_KEYS`.

**Important:** `tests/build.test.js` uses `spyOn(transformers, 'transformCursor')` with the named exports from `scripts/lib/transformers/index.js`. Do not delete those exports as dead code.

## Carried-over machinery

This repository was cloned from a design-focused skill package, and some machinery came with it rather than being written for the delivery lifecycle. It works, it is renamed, and it is here to be repurposed or removed:

- `cli/engine/` — an anti-pattern detector for HTML and CSS, plus the `pankit detect` command and the browser bundle. The rules are still design rules.
- `extension/` — a Chrome extension wrapping that detector.
- `skill/scripts/live-*` and `skill/scripts/live/` — live browser variant mode, documented in `reference/live.md`, which is not in the router table.
- `skill/scripts/context.mjs`, `doctor.mjs`, `hook*.mjs`, and `lib/staleness*.mjs` — project context loading, artifact drift detection, and the post-edit hook. These read `PRODUCT.md` and `DESIGN.md`.
- `skill/agents/pankit-manual-edit-applier.md` — the one surviving subagent, used by live mode.

If you repurpose a piece, rewrite its reference file in the same pass. If you delete a piece, delete its tests and its entry in `scripts/test-suites.mjs` too.

## Versioning

**Changes do not bump versions and do not add changelog entries.** Bumping is a release step. Land the code first.

Three independently versioned components:

- **CLI** (`package.json` → `version`), for changes under `cli/`.
- **Skills** (`.claude-plugin/plugin.json` → `version`, source of truth, mirrored in `.claude-plugin/marketplace.json`), for changes under `skill/`. After bumping, run `bun run build:release` so the committed `./plugin` subtree is regenerated. `validatePluginVersions` fails the build when they disagree.
- **Chrome extension** (`extension/manifest.json` → `version`), for changes under `extension/`.
