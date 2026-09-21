# review: Review specs, implementation and change impact against evidence

Stage: **Verify**. Invoked as `{{command_prefix}}pankit review`.

## Scope

Use the supplied target: a spec, task packet, code diff or proposed business change. Inspect and report by default. Do not repair files, update the baseline, merge, deploy or write through MCP merely because a finding is clear. If fixes were also authorized, keep review findings distinct from the repair and recheck affected evidence.

## Read first

Read [delivery-contract.md](delivery-contract.md), the accepted requirements/decisions and target revision. For code, read the complete diff and relevant surrounding implementation, exports, patches, tests and deployment steps. Verify Frappe contracts against the actual version. Request missing context only where it prevents a reliable conclusion; continue independent checks.

## Review in this order

1. **Contract:** identify the baseline and review gate. For specs, find ambiguous units, actors, states, permissions, contradictions and missing recovery paths. For task cards, check ownership, interfaces and evidence needed to hand work back without a live briefing. For code, map promised behavior to the actual change, including missing and unrequested behavior.
2. **Business flow:** trace touched measurement, quote, order, material, delivery or payment behavior. Separate sale quantity from material/stock quantity. Check who can change approved data, how revisions affect old documents, relevant partial failures and operator recovery. Use customer-confirmed examples; do not manufacture formulas or financial policy.
3. **Technical consequences:** inspect relevant core edits, untracked Desk changes, fixture scope, generated/source consistency, hooks, server validation, permissions/company isolation, secret handling, document lifecycle, repeated or concurrent writes, precision, migrations and restore evidence. Check operating burden such as unnecessary Item/BOM proliferation and changed operator instructions. Identify the actual failure path; do not dump an unrelated checklist on a small change.
4. **Verification:** map rule/AC IDs to implementation and pass/fail/not-run evidence. Test expectations must not merely repeat the implementation. A green unit suite cannot prove site permissions, real document lifecycle, migration or customer UAT. Distinguish a demonstrated defect from an unverified risk.
5. **Delta:** for a changed requirement, apply delivery-contract's defect/clarification/scope-change distinction. Show before/after and affected code, historical data, tests, tasks and operating cost. Preserve explicit decisions unless new evidence warrants reconsideration. Present options for unresolved business choices.

## Result

Lead with the gate and verdict defined in delivery-contract, then business consequences and the next owner/action. Give findings by severity with path/line or document section, rule/AC, trigger, impact and verification. Include a compact coverage table and outstanding decisions/evidence. Optional improvements do not block delivery without a demonstrated failure or agreed requirement.

For an urgent financial/stock integrity or access defect, show its consequence first. Do not inflate severity because multiple agents repeated the same concern. “No defects found” must state reviewed scope and remaining limits.

## Handoff

For review-only work, finish with the report. Within authorized implementation, consolidate repairs and recheck affected findings/tests; follow delivery-contract's stopping point for repeated disagreement. Release readiness and customer acceptance are separate decisions.
