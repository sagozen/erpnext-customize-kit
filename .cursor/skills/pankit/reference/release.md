# release: Rehearse or execute a scoped deployment with recovery evidence

Stage: **Ship**. Invoked as `/pankit release`.

## When this runs

Rehearse or execute a scoped deployment with recovery evidence when requested or needed to complete authorized ERPNext work.

## Read first

Read environment, authorization, pinned versions and passing tests/UAT. Load [demo-operations.md](demo-operations.md) and [migration.md](migration.md) for cutover/schema changes.

## Steps

1. Identify demo, rehearsal or production. Record site, company, app revision, versions, downtime and permitted actions. Reuse authorization; do not infer permission to publish or mutate another environment.
2. Prepare exact runbook, rollback conditions, backup locations and restore evidence. Block production cutover if required tests, acceptance or recovery checks are absent; continue independent preparation.
3. Rehearse on a sanitized staging copy. Check stock/accounting reconciliation and roles. Preserve pre-cutover snapshot and matching old application artifacts together.
4. Control/freeze production writes, take verified backups including files and required encryption configuration, deploy selected revision, migrate, build assets/restart as hosting requires and smoke-test.
5. Follow rehearsed recovery if checks fail. A Git revert does not undo a database migration. Account for post-backup writes before restoring.
6. Resume traffic/jobs after checks. Record commands, versions, results, incidents, support and acceptance. Bump/tag/publish only the component explicitly being released, never the kit merely because a demo was requested.

## What this produces

Deployment/rehearsal record with evidence and recovery status. When blocked, a prepared runbook and exact unmet conditions.

## Handoff

Follow the agreed support period and capture lessons with retro. Do not start indefinite monitoring unless requested.
