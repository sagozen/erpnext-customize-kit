# docs: reconcile what the change owes the reader

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Ship**. Invoked as `/pankit docs`.

## When this runs

Behavior, setup, commands, configuration, architecture, or a public contract changed.

## Read first

- The diff, so documentation follows what shipped rather than what was intended.
- The existing documentation layout, discovered from the repository instructions and the root README rather than assumed.
- The machine-owned sources (schemas, manifests, generated references) that should be linked instead of copied.

## Steps

1. Decide first whether documentation is owed at all. Internal refactors and completed phases usually owe nothing.
2. Find the smallest owning surface and update that, rather than adding a new page beside it.
3. Read the document before editing it, so the change fits the voice and structure already there.
4. Verify every claim against source, tests, or live state after writing. A confident wrong sentence is worse than no sentence.
5. Check links and code samples resolve.

## What this produces

Updated documentation on the smallest owning surface, with claims verified against the code.

## Handoff

`release` assumes the documentation matches what is about to ship.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
