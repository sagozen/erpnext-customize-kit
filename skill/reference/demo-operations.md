# Demo, acceptance and operations

Use a disposable demo company/site with explicitly illustrative data. Agree the audience, duration and outcomes. Avoid real customer records in screenshots or a public demo.

## One order, several roles

1. Sales receives a request for two rooms; explain Customer, Item and Quotation before opening forms.
2. Surveyor captures each opening, unit, layer and revision. Show how an invalid dimension is rejected if that validation is implemented.
3. Sales sees approved material estimate and customer price separately. Compare the same agreed example with the customer's spreadsheet. Show override/discount permission.
4. Owner approves; Sales Order freezes the approved configuration. Demonstrate the selected deposit process without claiming cash received equals earned revenue.
5. Workshop/procurement follows the approved revision using the selected manufacturing/subcontracting/purchase workflow. Demonstrate a shortage or remeasurement exception if in scope.
6. Installer gets only required job information, records partial completion and acceptance. Finance handles the agreed invoice/payment path and outstanding balance.
7. Show traceability, remaining work and a warranty/rework request. Mark each step standard, custom and tested, manual, or not yet built.

Do not claim an unimplemented flow works. A mockup can explain a future screen only when labeled. Collect feedback as requirement changes with effort/impact, not silent scope expansion.

## UAT worksheet

For each criterion record role, preconditions, input, numbered action, expected outcome, actual result, pass/fail/not-run, evidence and customer decision. Include ordinary order, revised measurement, partial delivery/payment, cancellation/return, forbidden access, migrated order and restore smoke test where applicable. The customer approves business correctness; the developer supplies technical evidence. A solo founder should keep both records distinct.

## Handover

Provide role-based quick tasks, correction paths, master-data ownership, support contact and access handover. Keep app versions/configuration and repeatable install instructions with the code; keep credentials/backups separately with controlled access.

Agree backup frequency/retention, recovery point (how much data loss is acceptable) and recovery time (how long operations can stop) with the customer. Choose hosting/restore procedures that can meet them and record measured rehearsal time.

Maintenance covers failed jobs, backup success, disk capacity, integration errors, access changes and planned updates. Test upgrades on a restored staging site before production; do not promise automatic compatibility. Define who pays for support, who approves changes and who operates when the solo developer is unavailable.
