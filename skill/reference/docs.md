# docs: Write operator, demo and maintainer instructions

Stage: **Ship**. Invoked as `{{command_prefix}}pankit docs`.

## When this runs

Write operator, demo and maintainer instructions when requested or needed to complete authorized ERPNext work.

## Read first

Read existing navigation and actual implementation. Use [demo-operations.md](demo-operations.md) for role instructions and [migration.md](migration.md) for import/runbook changes.

## Steps

1. Update the smallest owning surface. Explain business terms and retain exact ERPNext labels users need to find.
2. For each role document task, prerequisites, inputs, steps, expected result and correction path. Explain who can edit, approve, submit, cancel and amend.
3. Document clean installation, pinned versions, configuration ownership, migration/reconciliation, credential provisioning without values, backups and tested restore.
4. Create demo/UAT scripts mapped to requirements. Label illustrative data and unfinished functionality; do not imply absent automation exists.
5. Record support ownership, maintenance, upgrade rehearsal and known limitations. Link schemas/tests instead of copying them.
6. Verify links, commands and claims. Mark procedures not run on the customer's environment unverified.

## What this produces

Operator guide, demo/UAT instructions and maintainer runbook proportional to the change.

## Handoff

Use release for an identified environment; documents alone do not prove cutover.
