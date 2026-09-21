# review: Review business correctness and Frappe upgrade risks

Stage: **Verify**. Invoked as `{{command_prefix}}pankit review`.

## When this runs

Review business correctness and Frappe upgrade risks when requested or needed to complete authorized ERPNext work.

## Read first

Read the complete diff, accepted requirements/decisions, installed Frappe contracts and test results. Include exports, patches and deployment steps; check generated files against source.

## Steps

1. Trace measurement through quote, order, material demand, delivery and payment for touched behavior. Preserve quantity meanings and approved revisions.
2. Look for core edits, untracked Desk changes, overbroad fixtures, incompatible hooks, client-only validation and unnecessary Item/BOM proliferation.
3. Verify permissions, company isolation, secrets handling, lifecycle, idempotency, partial failures and migration/restore evidence.
4. Report concrete failures with path/line, trigger, consequence, severity and verification. Separate defects from questions and missing runtime evidence.
5. Preserve customer decisions. Present new evidence and trade-offs before reversing an explicit choice.
6. Check requirements coverage and operator instructions. No critical findings does not mean customer UAT has occurred.

## What this produces

Findings ordered by severity, validation gaps and readiness evidence.

## Handoff

Fix confirmed defects with code, then docs and scoped release when checks pass.
