# test: prove the change behaves as specified

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Verify**. Invoked as `/pankit test`.

## When this runs

After implementation, or first when working test-driven.

## Read first

- The acceptance criteria from the spec. They are the test list; treat anything not covered as a gap to report.
- The existing test suites and how they are run, including which suites are opt-in and what each one costs.
- The behavior that changed, so the narrowest useful suite can run first.

## Steps

1. Run the narrowest suite that covers the changed behavior before broadening to lint, typecheck, and build.
2. Write a failing test before the fix when reproducing a bug, so the test is known to detect the defect.
3. Cover the boundary and the error path, not only the case the feature was written for.
4. Report failures with their output. Never weaken, skip, or delete a test to make a run green.
5. State what remains uncovered. An honest gap is more useful than a coverage number.

## What this produces

Test files, a record of the commands run, and a pass/fail report naming any remaining gap.

## Handoff

`review` reads these results as evidence. A red suite blocks `release`.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
