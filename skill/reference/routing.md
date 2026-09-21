# Choose the next ERPNext action

For `{{command_prefix}}pankit` without arguments inspect instructions, requirements, decisions, app code and verification. Recommend up to three actions with reasons; do not execute unrequested changes.

- New founder/no site: explain [erpnext-platform.md](erpnext-platform.md); offer setup or spec. Requirements do not need a running site.
- Raw curtain request: spec with [curtain-domain.md](curtain-domain.md).
- Another industry: spec with [domain-adaptation.md](domain-adaptation.md).
- Standard versus custom: design against installed-version evidence.
- Accepted scope: plan, or code for a bounded change.
- Spec, task, diff or change proposal to assess: review first; report gaps without changing the target when review only was requested.
- Existing code to implement/fix: code with test evidence, then review against the accepted baseline.
- Legacy/Excel import or upgrades: plan with [migration.md](migration.md). Clarify industry adaptation versus data/schema migration versus DNS/hostname migration when ambiguous.
- Demonstration: docs with [demo-operations.md](demo-operations.md), then release demo only if deployment is requested.
- Production cutover: release after UAT and restore evidence.

Show exact invocations such as `{{command_prefix}}pankit spec <client request>`. For explicit end-to-end delivery continue authorized stages; the menu is not an approval barrier.
