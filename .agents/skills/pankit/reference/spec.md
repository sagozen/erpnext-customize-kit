# spec: write the change down before building it

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Define**. Invoked as `$pankit spec`.

## When this runs

The user wants something built, changed, or fixed, and no written scope exists for it.

## Read first

- The user request, verbatim, including any constraint they stated in passing.
- The code the request touches, and one nearby example of how similar behavior is already specified.
- Any existing spec, ticket, or issue that overlaps, so this one does not contradict it.

## Steps

1. State the problem in one paragraph: what is wrong or missing today, and for whom. Do not name a solution yet.
2. Name the users and the situation they are in when this matters. A spec with no user is a wish list.
3. Write acceptance criteria as observable behavior. Each one is a sentence a tester could pass or fail without asking a question.
4. Write the non-goals. This is the section that prevents scope creep later, so it earns real thought rather than one throwaway line.
5. List the open questions and who can answer each. STOP and use Codex's structured user-input/question tool when available; if unavailable, ask directly in chat to clarify what you cannot infer. Resolve the ones that change the shape of the work; carry the rest into the spec as recorded unknowns.

## What this produces

A spec file with sections: Problem, Users, Acceptance criteria, Non-goals, Open questions.

## Handoff

`plan` turns an accepted spec into phases. Do not start implementing from the spec alone when the work spans more than one file.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
