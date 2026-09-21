# spec: Explain requirements and map the business workflow to ERPNext

Stage: **Define**. Invoked as `/pankit spec`.

## When this runs

Explain requirements and map the business workflow to ERPNext when requested or needed to complete authorized ERPNext work.

## Read first

Read the client request, existing decisions and [delivery-contract.md](delivery-contract.md). Load [curtain-domain.md](curtain-domain.md), or [domain-adaptation.md](domain-adaptation.md) for another industry.

## Steps

1. Restate the outcome in plain Vietnamese. Identify sales, surveyor, workshop, installer, owner and accountant responsibilities; one person may hold several roles.
2. Walk through one actual order from contact to warranty. Use available redacted quotes, measuring sheets and spreadsheet formulas before requesting more. Batch only consequential missing decisions; explain their impact and continue independent work. For inherited code without a spec, use delivery-contract's observed-versus-intended distinction, not a self-certified baseline.
3. Record each requirement's source, actor, trigger, inputs/units, rule, exceptions, output, permission, standard ERPNext candidate and acceptance example. Use an inline decision/transition table only when conditions or states need it. Include relevant operating criteria from delivery-contract; use customer-agreed thresholds and measurement conditions. Mark standard fit unverified until checked against the installed version.
4. Separate measurement, sale quantity, material consumption and stock quantity. Clarify in-house production, subcontracting and purchase/resale; support the customer's actual mix.
5. Produce a fit-gap table: standard configuration / exported customization / app code / integration, rationale and evidence needed. Explain operating costs; do not claim everything is standard or invent fixed estimates.
6. Keep a compact feature spec with stable rule/AC IDs, scope, assumptions and decision owners. Link the accepted revision and its decision evidence; do not mark a draft accepted. Review normal and exceptional outcomes before calling the affected slice ready for tasking.
7. For changed requirements, compare with the existing baseline and record the delta/impact using delivery-contract. Preserve old decisions and historical evidence; distinguish defect, clarification and scope change. Ask only unresolved consequential questions, not permission to rewrite every document.

## What this produces

Customer scope, fit-gap and testable scenarios in the existing requirements document, or one feature file under docs/erpnext/features. Keep project-wide context shared; do not duplicate it in every feature.

## Handoff

Use design for consequential options and plan for execution. Continue authorized delivery; pause only work dependent on missing decisions.
