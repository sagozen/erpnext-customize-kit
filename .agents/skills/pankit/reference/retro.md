# retro: turn what happened into convention

> **PLACEHOLDER.** This file shows the shape a PanKit command reference takes. Replace the content with your own instructions; keep the section headings so the router, the build, and `skill-reference.test.mjs` keep working.

Stage: **Ship**. Invoked as `$pankit retro`.

## When this runs

After a release, a difficult debugging session, or a milestone worth learning from.

## Read first

- The work itself: the commits, the plan, the findings, the failures.
- The decisions that were made under uncertainty, and how they turned out.
- The existing convention documents, so a lesson can be written into one instead of floating loose.

## Steps

1. Write what actually happened in order, including the parts that went badly. A retro that only records successes teaches nothing.
2. Separate what was bad luck from what was a bad decision. They call for different fixes.
3. Name the specific moment a different choice would have changed the outcome.
4. Promote the durable lessons into the convention documents that future work reads; leave the rest in the record.
5. Keep the record dated and chronological. It is history, not current authority.

## What this produces

A dated journal entry, plus any convention document updated as a result.

## Handoff

Nothing downstream. A retro closes the cycle and feeds the next `spec`.

## Notes for the author of this file

- Write instructions to the model, not documentation about the model. Second person, imperative.
- Say what to do and what not to do. A rule with no counter-case gets read as a suggestion.
- Keep it loadable. This file is read in full every time the command runs, so length costs the user money on every invocation.
- Reference other files by relative path so the build can rewrite them per provider.
