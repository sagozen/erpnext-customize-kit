# Migration and cutover

First identify the operation: adapting the kit to another industry, importing legacy data, changing app schema, upgrading ERPNext, or changing hostname/hosting. For industry changes use [domain-adaptation.md](domain-adaptation.md). DNS changes need a separate plan for TLS, site routing, callbacks and integrations; they are not implied by data migration.

## Legacy data

Inventory source files, owner, encoding, dates/timezone, company, currency, UOM and external identifiers. Work on redacted samples first. Preserve the original securely. Write a mapping with source field, destination DocType/field, conversion, required/default policy, identity, validation and rejected-row handling.

Obtain templates from the actual site's Data Import feature; never assume CSV columns from another version. Sequence configuration and linked masters before transactions. Agree which history to import versus retain read-only, cutoff date, outstanding orders, receivables/payables, deposits and opening stock. An accountant must approve opening balances and reconciliation; avoid importing both complete historical ledger effects and duplicate opening balances.

Give each source record a durable identity or mapping. A second run must update/skip by agreed policy, not create duplicates. Reject ambiguous units, broken links, invalid dates and missing required data into a review report. Never silently coerce failed rows or force document submission.

Rehearse in staging; reconcile counts, rejected/accepted totals, quantities by item/warehouse, stock valuation, receivables/payables by party, advances and relevant ledger totals. Save signed expected totals, actual totals and variance explanations. Define rollback for partial imports before execution.

## Schema and app changes

Separate versioned schema/configuration from transactional import. Use normal Frappe app migrations and ordered patches following installed-version conventions. Check fresh installation and upgrade from the prior release with representative data. Rerunning migrate must not duplicate business records; test partial failure recovery. Never edit an already-applied patch to create a new migration.

Review rename/delete/required-field changes, child-table links, submitted records, company scoping and long-running jobs. A field label change is not a fieldname migration. Plan how old approved quotes retain their original calculation and revision.

## Cutover record

Record owner, site, app/framework revisions, freeze window, backup IDs, restore result, steps, stop conditions and acceptance. Include database, public/private files, encrypted configuration needed for recovery and matching application versions. Secure the backup and verify integrity without writing secrets to reports.

Restore a backup to an isolated site before relying on it. Stop traffic/scheduler/jobs as appropriate to the deployment, take a final consistent backup, deploy/migrate, reconcile, run role-based smoke tests and then reopen. Use hosting-specific commands verified from help/docs. A Git checkout alone cannot roll back schema/data. Preserve and reconcile writes made after a backup before deciding to restore it.

References: [Data Import](https://docs.frappe.io/erpnext/data-import), [Framework docs](https://docs.frappe.io/framework), installed Bench help and source at the deployed revision.
