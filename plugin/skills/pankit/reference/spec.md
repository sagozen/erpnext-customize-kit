# spec: Explain requirements and map the business workflow to ERPNext

Stage: **Define**. Invoked as `/pankit spec`.

## When this runs

Explain requirements and map the business workflow to ERPNext when requested or needed to complete authorized ERPNext work.

## Read first

Read the client request and existing decisions. Load [curtain-domain.md](curtain-domain.md), or [domain-adaptation.md](domain-adaptation.md) for another industry.

## Steps

1. Restate the outcome in plain Vietnamese. Identify sales, surveyor, workshop, installer, owner and accountant responsibilities; one person may hold several roles.
2. Walk through one actual order from contact to warranty. Request a redacted quote, measuring sheet and spreadsheet formulas. Ask a small batch of consequential questions, explaining why each changes scope; continue independent work.
3. Record each requirement's source, actor, trigger, inputs/units, rule, exceptions, output, permission, standard ERPNext candidate and acceptance example. Mark standard fit unverified until checked against the installed version.
4. Separate measurement, sale quantity, material consumption and stock quantity. Clarify in-house production, subcontracting and purchase/resale; support the customer's actual mix.
5. Produce a fit-gap table: standard configuration / exported customization / app code / integration, rationale and evidence needed. Explain operating costs; do not claim everything is standard or invent fixed estimates.
6. Record outcome, constraints, non-goals, acceptance criteria, assumptions and unresolved decisions with owners. Preserve requested scope.

## What this produces

Customer scope, fit-gap table, testable scenarios and glossary, normally in docs/erpnext/requirements.md.

## Handoff

Use design for consequential options and plan for execution. Continue authorized delivery; pause only work dependent on missing decisions.
