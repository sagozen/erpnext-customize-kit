# plan: Split delivery into bounded tasks with owners and acceptance

Stage: **Define**. Invoked as `/pankit plan`.

## When this runs

Sequence setup, customization, migration, demo and handover when requested or needed to complete authorized ERPNext work.

## Read first

Read accepted requirements, decisions, app structure, hosting constraints and [delivery-contract.md](delivery-contract.md). Use [migration.md](migration.md) for data/schema changes and [demo-operations.md](demo-operations.md) for delivery.

## Steps

1. Reuse agreed outcomes; distinguish kit installation, ERPNext provisioning and customer configuration.
2. Sequence dev site/versions, standard workflow baseline, one complete order through custom app, permissions/tests, migration rehearsal, demo/UAT, cutover and support. Adjust to actual scope.
3. Write task cards following delivery-contract in the existing plan or issue. Each specialist gets an accepted baseline, owned files/config, interfaces/dependencies and independently reviewable output. Name the implementer, reviewer and integration owner, agreed checkpoint and blocker handoff. Leave unassigned roles explicit; do not invent staff. A card prepares work, it does not automatically launch agents or send messages.
4. Map each requirement to tasks and acceptance evidence. Separate implementation, review and unresolved client decisions. Give effort ranges with assumptions; distinguish implementation, hosting and support costs. Prefer one active business slice and a small review queue over maximizing agent concurrency.
5. Identify stock, accounting and customer-facing mutations. Separate disposable demo data from production imports and require restore evidence before cutover.
6. Keep a short plan index; add phase files only when detail warrants them. Check ready/done conditions in delivery-contract. Give the founder one next action and a batch of decisions to resolve; task completion requires evidence, not a percentage estimate. Before expanding delegation, include the first delegation trial from delivery-contract and record its results in the task.

## What this produces

A plan under the repository convention with status, dependencies, acceptance, risks and rollback.

## Handoff

Execute authorized phases with code; use design for unresolved architecture.
