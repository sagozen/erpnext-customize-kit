# review: rank what would actually go wrong

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Verify**. Invoked as `{{command_prefix}}pankit review`.

## When this runs

Before merging a diff, branch, or pull request.

## Read first

- The diff itself, and enough surrounding code to judge whether the change fits.
- The spec or plan it claims to satisfy, so the review can catch scope that drifted.
- The test results, so review effort goes where tests do not already reach.

## Steps

1. Read the whole diff before writing any finding. Findings written during a first pass tend to be about style.
2. For each finding, give a concrete failure scenario: the input or state, and the wrong output or crash it produces.
3. Rank by severity, most severe first. Correctness and regressions outrank taste.
4. Verify a finding before reporting it. An abstract concern with no reproduction is a question, not a finding.
5. Do not silently reverse a decision the author or the user made. Present the trade-off and let them choose.

## What this produces

A findings list ordered by severity, each with file, line, summary, and failure scenario.

## Handoff

Confirmed findings return to `code`. A clean review clears the change for `docs` and `release`.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
