# test: Prove calculations, permissions, migrations and customer scenarios

Stage: **Verify**. Invoked as `{{command_prefix}}pankit test`.

## When this runs

Prove calculations, permissions, migrations and customer scenarios when requested or needed to complete authorized ERPNext work.

## Read first

Read accepted criteria, customer-approved worked examples, role matrix and test setup. Load [curtain-domain.md](curtain-domain.md), [migration.md](migration.md) or [demo-operations.md](demo-operations.md) for relevant checks.

## Steps

1. Use an isolated test site and the installed Frappe runner. Verify help/configuration. Run a focused module, then app tests and fresh-install/upgrade checks for shared contracts.
2. Cover unit conversion, invalid dimensions, usable fabric width/orientation, fullness, pattern repeat, split panels, rounding boundaries, minimum charges and price revisions. Derive expected results independently of the function under test.
3. Exercise save/submit/cancel/amend and UI/API access as each real role. Check unauthorized reads/exports, company isolation and server rejection of client-tampered totals.
4. Test partial delivery/payment, remeasurement after approval, shortages, subcontracting where used, rework and returns. Verify stock/financial effects against the agreed process.
5. Test duplicate imports, missing links, rejected rows, interrupted execution and reconciliation. Test old-site upgrades, a second migrate and restore rehearsal.
6. Record baseline/rule/AC ID → scenario → command/manual steps → expected → actual → evidence. Separate automated tests, manual UAT and not-run checks. Never substitute mocked Bench/MCP output for live integration evidence. A changed rule invalidates affected earlier results; keep the earlier record and rerun relevant checks against the new revision.

## What this produces

Tests and acceptance report with pass/fail/not-run, evidence, defects and customer sign-off status.

## Handoff

Failures return to code. A passing kit build never clears a customer site for production.
