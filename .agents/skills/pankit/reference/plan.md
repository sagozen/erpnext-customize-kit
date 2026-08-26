# plan: sequence an accepted spec into executable phases

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Define**. Invoked as `$pankit plan`.

## When this runs

A spec is accepted and the work is large enough that order, ownership, or risk needs deciding before code.

## Read first

- The accepted spec, including its non-goals. The plan inherits them; it does not relitigate them.
- The files the change will touch, and which of them other work is likely to touch at the same time.
- The verification the repository already has: test commands, lint, typecheck, build.

## Steps

1. Break the work into phases that each end in a verifiable state. A phase that cannot be checked is not a phase.
2. For each phase record: goal, files it may modify, steps, how it is validated, and how it is rolled back.
3. Name the dependencies between phases explicitly, so phases with none can run in parallel and the rest cannot start early.
4. Call out the risky phase. There is almost always one, and naming it is what makes the rest of the plan honest.
5. Restate the acceptance criteria from the spec at the end of the plan, so completion is measured against the original ask.

## What this produces

A plan index with status, phases, dependencies, and acceptance criteria, plus one file per phase holding the execution detail.

## Handoff

`code` executes a phase. `design` runs first when a phase still has more than one viable architecture.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
