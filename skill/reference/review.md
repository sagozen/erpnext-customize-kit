# review: Review specs, implementation and change impact against evidence

Stage: **Verify**. Invoked as `{{command_prefix}}pankit review`.

## Scope

Use the supplied target: a spec, task packet, code diff or proposed business change. Inspect and report by default. Do not repair files, update the baseline, merge, deploy or write through MCP merely because a finding is clear. If fixes were also authorized, keep review findings distinct from the repair and recheck affected evidence.

## Read first

Read [delivery-contract.md](delivery-contract.md), the accepted requirements/decisions and target revision. For code, read the complete diff and relevant surrounding implementation, exports, patches, tests and deployment steps. Verify Frappe contracts against the actual version. Request missing context only where it prevents a reliable conclusion; continue independent checks.

## Review in this order

1. **Contract:** identify the baseline, exact reviewed snapshot and gate; choose relevant depth using the evidence rules below. For specs, find ambiguous units, actors, states, permissions, contradictions and missing recovery paths. For task cards, check ownership, interfaces and evidence needed to hand work back without a live briefing. Without an accepted baseline, separate observed behavior from intended requirements and limit compliance conclusions.
2. **Business flow:** trace touched measurement, quote, order, material, delivery or payment behavior. Separate sale quantity from material/stock quantity. Check who can change approved data, how revisions affect old documents, relevant partial failures and operator recovery. Use customer-confirmed examples; do not manufacture formulas or financial policy.
3. **Technical consequences:** inspect relevant core edits, untracked Desk changes, fixture scope, generated/source consistency, hooks, server validation, permissions/company isolation, secret handling, document lifecycle, repeated or concurrent writes, precision, migrations and restore evidence. Check operating burden such as unnecessary Item/BOM proliferation and changed operator instructions. Identify the actual failure path; do not dump an unrelated checklist on a small change.
4. **Verification:** apply the two-way comparison and absence-search rules below. Check touched producer/consumer contracts, not only individual files. Keep comparison status separate from pass/fail/not-run tests, and assess whether earlier evidence covers the current snapshot. Test expectations must not merely repeat the implementation. A green unit suite cannot prove site permissions, real document lifecycle, migration or customer UAT.
5. **Delta:** for a changed requirement, apply delivery-contract's defect/clarification/scope-change distinction. Show before/after and affected code, historical data, tests, tasks and operating cost. Preserve explicit decisions unless new evidence warrants reconsideration. Present options for unresolved business choices.

## Evidence rules

Choose depth from the affected behavior. For a scoped print label, inspect rendered meaning and relevant regression evidence. For calculations, units, approvals or links between documents, trace the rule through server code and its consumers. For stock/accounting effects, permission boundaries, schema changes or bulk writes, require the relevant site, lifecycle, replay/reconciliation and recovery evidence for the gate being assessed. Do not turn missing production checks into blockers for a draft-spec review.

Compare in both directions: every touched rule against the implementation, and changed behavior against its requirement or justified technical purpose. Use these distinctions in the existing coverage table:

| Comparison | Basis |
|---|---|
| Aligned | Both sources support the same behavior within the inspected scope; does not imply a runtime test passed |
| Different | Cite the expected rule and the conflicting implementation/configuration with a concrete case |
| Absent in inspected scope | State search locations, terms and relevant execution path; incomplete coverage means unknown, not proven missing |
| Additional behavior | Identify the changed observable behavior and why it matters; ordinary implementation details are not automatically extra scope |
| Unknown | Name the inaccessible source/configuration/runtime fact and the check needed to resolve it |

For ERPNext, search the standard controller, installed hooks, exported customizations and authorized site configuration before claiming missing behavior solely from `sankaku_erp`. If those sources are unavailable, narrow the claim. A field label or screenshot cannot prove server enforcement. For a defect, cite both the requirement or verified framework invariant and the conflicting implementation, with locations/revisions. A missing customer spec does not prevent reporting an independently demonstrated access or integrity defect. For absence, cite the search boundary instead of inventing a missing line.

At touched document boundaries, compare the producer's output with the consumer's input: units, rounding, revision identity, company/role, allowed state, duplicate handling and side effects as relevant. A correct measuring form and a correct quote calculator may still disagree about millimeters versus meters or which measurement revision to use.

Prioritize findings by consequence: data/financial corruption or unauthorized access, then broken agreed workflows, then lower-impact defects. State the trigger and affected scope rather than assigning urgency from category alone. Keep optional improvements separate. Each finding needs one concrete owner/action and a retest condition; avoid turning advice into an unbounded redesign task.

## Result

Lead with the gate and verdict defined in delivery-contract, then business consequences and the next owner/action. Give findings by severity with path/line or document section, rule/AC, trigger, impact and verification. Include a compact coverage table and outstanding decisions/evidence. Optional improvements do not block delivery without a demonstrated failure or agreed requirement.

For an urgent financial/stock integrity or access defect, show its consequence first. Do not inflate severity because multiple agents repeated the same concern. “No defects found” must state reviewed scope and remaining limits.

## Handoff

For review-only work, finish with the report. Within authorized implementation, consolidate repairs and recheck affected findings/tests; follow delivery-contract's stopping point for repeated disagreement. Release readiness and customer acceptance are separate decisions.
