# code: Implement and verify maintainable sankaku_erp changes

Stage: **Build**. Invoked as `$pankit code`.

## When this runs

Implement and verify maintainable sankaku_erp changes when requested or needed to complete authorized ERPNext work.

## Read first

Read the scoped plan, actual controllers, hooks and tests. Use [erpnext-platform.md](erpnext-platform.md) and installed Frappe skills covering the touched API. Read [migration.md](migration.md) for patches and [mcp-integration.md](mcp-integration.md) before site access.

## Steps

1. Establish app path, versions and a dev/test site. If no app exists use the installed Bench generator after checking help. This kit itself is not a Frappe app.
2. Implement the accepted slice in sankaku_erp using standard document APIs. Enforce permissions and price/material invariants server-side. Client scripts improve usability; they cannot enforce integrity.
3. Trace measurement/calculation revisions to quote/order lines. Use agreed precision/rounding and snapshot inputs so new prices/formulas do not rewrite accepted quotes.
4. Export only app-owned configuration, fields and roles. Inspect exports for unrelated/customer data. Desk-only changes cannot be the sole source of production customization.
5. Use save/submit/cancel/amend lifecycle APIs. Never write ledgers directly or force docstatus. Do not bypass validation/permissions to make imports pass. Justify privileged setup/patch code separately.
6. Make creation retry-safe with durable source identities and permission checks. A timeout means unknown outcome; inspect state before retrying a write.
7. Run focused tests and fix regressions. Verify fresh installation and upgrade from the previous app revision when schema/configuration changes. Record commands/results.

## What this produces

Application code, exported configuration, migrations and tests, with verified/unverified behavior distinguished.

## Handoff

Continue test and review within scope. Report unavailable environment checks explicitly; documentation alone is not deployment.
