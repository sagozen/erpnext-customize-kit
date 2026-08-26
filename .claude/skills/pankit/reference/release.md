# release: ship it deliberately

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Ship**. Invoked as `/pankit release`.

## When this runs

A set of merged, reviewed, tested changes is ready to reach users.

## Read first

- The component being released and its version manifest. Components version independently unless the project says otherwise.
- The merged changes since the last release of that component.
- The release checks the repository enforces: clean tree, build reproducibility, changelog presence, tag availability.

## Steps

1. Confirm the working tree is clean and the branch is current. A release from a dirty tree is not reproducible.
2. Bump only the component that changed.
3. Write the changelog entry for users: what they will notice or act on. Leave internal refactors and dependency bumps out.
4. Run the full verification the project requires and read the output rather than assuming it passed.
5. Tag, publish, and report exactly what went out and where.

## What this produces

A version bump, a changelog entry, a tag, and a published artifact.

## Handoff

`retro` captures what the cycle taught once the release has settled.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
