# design: choose the technical shape and record why

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Define**. Invoked as `$pankit design`.

## When this runs

A change has more than one viable architecture, or a decision will be expensive to reverse later.

## Read first

- The spec or plan that motivated the decision.
- The existing module boundaries, interfaces, and data model the change has to live inside.
- Any prior decision record on the same subsystem, so this one supersedes it explicitly instead of contradicting it silently.

## Steps

1. State the decision to be made as a question with a scope. A vague question produces a vague record.
2. List the options that are genuinely on the table, including the one where nothing changes.
3. For each option, give the mechanism, the cost, and the failure mode. An option with no downside listed has not been examined.
4. Choose one and say why the trade-off is acceptable for this project, not in general.
5. Record the consequences: what becomes easier, what becomes harder, and what would make you revisit this.

## What this produces

A decision record: Context, Options, Decision, Consequences, Revisit when.

## Handoff

`plan` sequences the chosen shape into phases; `code` implements it. The record stays with the repository, not in the conversation.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
