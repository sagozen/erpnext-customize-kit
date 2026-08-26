# PanKit

Agent skills for the software delivery lifecycle. One skill, nine commands, one reference file per stage.

**This repository is a skeleton.** Every command reference under `skill/reference/` is a placeholder that shows the shape without the substance. Replace them with your own instructions. The routing, the build, and the tests around them are real and working.

## What it is

Most skill collections spread one capability per top-level skill, and the `/` menu fills up fast. PanKit uses the opposite shape: a single user-invocable skill named `pankit`, with sub-commands underneath it.

```
/pankit spec      write the problem, users, acceptance criteria, non-goals
/pankit plan      sequence an accepted spec into phases
/pankit design    choose and record the technical shape
/pankit code      implement against existing conventions
/pankit test      write and run the tests that prove the change
/pankit review    rank findings on a diff by severity
/pankit docs      reconcile the documentation the change owes
/pankit release   bump, changelog, verify, tag, publish
/pankit retro     capture what the work taught
```

Typing `/pankit` with no argument gets a context-aware menu instead of a wall of options.

## Install

```bash
npx pankit skills install
```

Or use it as a Claude Code plugin from `.claude-plugin/marketplace.json`.

## Repository layout

| Path | What lives there |
|---|---|
| `skill/SKILL.src.md` | Frontmatter, shared rules, and the command router table. The single source the providers compile from. |
| `skill/reference/` | One markdown file per command, loaded only when that command runs. |
| `skill/scripts/` | Executable helpers the skill may call, including `context.mjs` and `pin.mjs`. |
| `skill/agents/` | Subagent definitions shipped alongside the skill. |
| `scripts/build.js` | Compiles `skill/` into per-provider output under `dist/`. |
| `scripts/lib/transformers/` | The provider matrix and the transform factory. |
| `cli/` | The `pankit` npm CLI. |
| `tests/` | Build orchestration, provider transforms, and routing contracts. |

Generated provider output lands in `.claude/`, `.cursor/`, `.codex/`, and `.agents/`. Those directories are artifacts, not authoring surfaces. Edit `skill/` and rebuild.

## Build

```bash
bun run build            # compile dist/ without syncing the root harness dirs
bun run build:release    # compile and sync root harness dirs plus plugin/
bun run test             # unit tests plus the plugin loader check
```

Source files use placeholders that get replaced per provider: `{{model}}`, `{{config_file}}`, `{{ask_instruction}}`, `{{command_prefix}}`, `{{available_commands}}`, `{{scripts_path}}`, and `{{command_hint}}`.

## Adding a command

A command is registered in four places. The test suite fails if they disagree.

1. Create `skill/reference/<command>.md`.
2. Add a row to the router table in `skill/SKILL.src.md`.
3. Add its description and argument hint to `skill/scripts/command-metadata.json`.
4. Add its category to `SKILL_CATEGORIES` in `scripts/lib/skill-categories.js`.

Then add it to `VALID_COMMANDS` in `skill/scripts/pin.mjs` if it should be pinnable as a standalone shortcut, and to `PANKIT_SUB_COMMANDS` in `scripts/lib/utils.js` if it should appear in generated next-step suggestions.

The command count in this README, `AGENTS.md`, and both plugin manifests is validated against the router table at build time. Update them together.

## Writing a command reference

The placeholders share one shape, and it is worth keeping:

- **When this runs.** The condition that selects this command over its neighbors.
- **Read first.** What to load before acting, so the model does not guess.
- **Steps.** Numbered and imperative.
- **What this produces.** The artifact, named.
- **Handoff.** Which command picks up next, and what this one must not do.

Two rules earn their keep. Write to the model in second person, not about the model. And keep the file short, because it is loaded in full on every invocation.

## License

Apache 2.0. See `NOTICE.md` for attribution.
