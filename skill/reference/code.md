# code: implement an accepted plan against existing conventions

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Build**. Invoked as `{{command_prefix}}pankit code`.

## When this runs

Scope is settled and the remaining work is writing and wiring the change.

## Read first

- The plan phase or the scoped task, including the files it is allowed to modify.
- At least one existing file that does something similar, read before writing. Match its structure, naming, and comment density.
- The project instruction files and any local convention documents that apply to the directory being changed.

## Steps

1. Confirm the scope boundary before the first edit. Work outside the phase file list is reported, not performed.
2. Change existing files where that matches the design. Create new files only at real boundaries.
3. Implement real behavior. Placeholder data, stubs, and shortcuts that exist only to make a check pass are failures, not progress.
4. Prefer local helpers and existing test utilities over new abstractions. A second caller justifies an abstraction; a first one rarely does.
5. Keep the change reviewable: one concern per commit, conventional commit format, no secrets.

## What this produces

The implemented change, plus a short report of what was built, what was skipped, and why.

## Handoff

`test` proves it. `review` checks it. Neither is optional because the code looks right.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
