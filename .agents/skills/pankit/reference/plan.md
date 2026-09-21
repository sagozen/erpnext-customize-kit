# plan: Sequence setup, customization, migration, demo and handover

Stage: **Define**. Invoked as `$pankit plan`.

## When this runs

Sequence setup, customization, migration, demo and handover when requested or needed to complete authorized ERPNext work.

## Read first

Read accepted requirements, decisions, app structure and hosting constraints. Use [migration.md](migration.md) for data/schema changes and [demo-operations.md](demo-operations.md) for delivery.

## Steps

1. Reuse agreed outcomes; distinguish kit installation, ERPNext provisioning and customer configuration.
2. Sequence dev site/versions, standard workflow baseline, one complete order through custom app, permissions/tests, migration rehearsal, demo/UAT, cutover and support. Adjust to actual scope.
3. Specify each phase's inputs, app modules/files, configuration owner, steps, tests, exit evidence and rollback. Do not assign an imaginary team to a solo founder.
4. Map every requirement to a phase and acceptance check. Give effort ranges with assumptions/dependencies; distinguish implementation, hosting and support costs.
5. Identify stock, accounting and customer-facing mutations. Separate disposable demo data from production imports and require restore evidence before cutover.
6. Keep a short plan index and linked phase details. Completion requires exit evidence.

## What this produces

A plan under the repository convention with status, dependencies, acceptance, risks and rollback.

## Handoff

Execute authorized phases with code; use design for unresolved architecture.
