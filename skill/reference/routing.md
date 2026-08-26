# No-argument routing: the context-aware menu

Read this when the user invokes `{{command_prefix}}pankit` with no argument. They are asking "what should I do next?" Answer with the stage their work is actually missing, not with a static list.

> **PLACEHOLDER.** The signal reasoning below is a worked example of the shape this file takes. Replace the signals and the rules with the ones that match your own commands.

Setup has already run `context.mjs`. Run `node {{scripts_path}}/context-signals.mjs` once and read its JSON, then lead with the **2-3 highest-value next commands**, each with a one-line reason drawn from the signals, followed by the full menu (the Commands table in SKILL.md, grouped by category). **Never auto-run a command; the recommendation is a suggestion the user confirms.**

Reason over the signals; there is no score to obey:

- No spec or plan for work already in progress in the dirty tree, and the change spans several files, points at `spec`.
- An accepted spec with no plan beside it, for work larger than a single file, points at `plan`.
- Changed source files with no matching test changes point at `test`, naming the files.
- A branch ahead of its base with tests passing points at `review`, then `docs`.
- A public contract, command, or configuration key that changed with no documentation edit beside it points at `docs`.
- A clean tree with merged, reviewed work and no version bump points at `release`.
- A just-finished release, or a debugging session that took several attempts, points at `retro`.
- Otherwise group by stage (define what to build / build it / verify it / ship it) and tailor to what the working tree shows.

Keep it to 2-3 pointed picks with the exact command to type. The menu stays the fallback; the recommendation is the lede.

## When the signals are unreadable

If `context-signals.mjs` fails or the repository is too large to read quickly, skip it and present the plain menu grouped by stage. Never block the recommendation on a signal that did not arrive, and never invent a signal you did not read.
