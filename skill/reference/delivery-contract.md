# Small specs, specialist tasks and review evidence

Use for spec, task planning, implementation review and change assessment. Reuse existing project files and IDs. Otherwise keep each business slice in `docs/erpnext/features/<slug>.md`, task cards in the existing plan or issue, and review evidence in the PR/report. A small fix can fit all three in one issue. Do not generate a separate BRD, PRD, SRS, story and checklist for the same requirement.

## Spec baseline

Record the outcome, scope/non-goals, source and business decision owner. Name the revision being implemented and link the actual decision that accepted it. Drafts and AI recommendations are not customer approval. Preserve earlier revisions through Git or a short before/after record; a mutable filename alone is not a baseline.

Keep only rules needed to implement and judge the slice:

| Item | Required meaning |
|---|---|
| Rule ID | Stable within the feature; actor, trigger/state, inputs/units, expected business outcome and relevant failure behavior |
| Acceptance ID | Observable result tied to a rule, with an independently checked example where quantities or money matter |
| ERPNext mapping | Standard/configuration/app/integration candidate, evidence against the installed version, consequential design choice |
| Open decision | What is unknown, who can decide, affected work and recommendation with trade-off |

Keep rule and acceptance IDs stable when wording changes; retire removed IDs rather than reusing them. Acceptance criteria describe promised behavior. Test cases additionally explore boundaries, concurrency and technical failure modes. Use diagrams only when a state or relationship remains hard to explain in prose.

Before calling a slice ready, walk a normal order and the relevant exception: who can act, what changes, what remains historically true, and how the operator recovers. Missing business decisions block only dependent work. Do not choose unconfirmed pricing, material, stock or accounting policies to clear a gate.

## Task card

Give a specialist or a fresh Claude/Codex session a bounded packet:

```text
Task / owner / status:
Outcome and baseline: feature path + accepted revision/decision + rule/AC IDs
Read: exact source, decisions, app/version/site context, relevant code/tests
Change boundary: owned files/modules/config; excluded work
Interfaces/dependencies: inputs, outputs, units, lifecycle, permissions;
  who owns shared schema, fixtures and migration ordering
Deliver: code/config/tests and operator notes where behavior changes
Verify: relevant ACs, command or manual procedure, expected result
Hand back: diff/base/head, results + environment, unresolved gaps, recovery notes
```

Ready means inputs and interfaces are sufficient for this task, its required decisions are accepted and access is available. Done means scope is implemented, applicable checks have evidence, required review findings are resolved and remaining UAT/deployment status is explicit. Code review completion is not production completion.

Split by a reviewable business outcome or a technical dependency with a clear contract. Estimate effort as a range with uncertainty; use a bounded investigation when the API or rule is unknown. A task spanning several unrelated outcomes should be split, not assigned as “customize ERPNext”.

The founder owns priorities, client decisions and integration. Hire a specialist for the risk they can resolve, such as Frappe lifecycle, material planning or accounting reconciliation. AI capability does not transfer business sign-off to the model. Start with one active slice and finish its review before filling a review queue; increase parallel work only when ownership and interfaces are independent. Never edit shared schema/fixtures/migration ordering concurrently without a single owner.

## Change against the baseline

Classify by evidence, not by who requested it:

- **Defect:** behavior contradicts an accepted rule. Fix within authorized scope and add regression evidence; do not rewrite acceptance to make the defect pass.
- **Clarification:** makes existing intent precise without changing outcomes. Cite the source. If outcomes or permissions differ, treat it as a scope change or unresolved decision.
- **Scope change:** changes promised behavior. Record before/after, reason, affected rule/AC IDs, code/config, existing documents/data, tests, operations, effort and recovery. Mark unaffected areas with a reason only when useful.

Use a short delta section in the existing feature/issue. Reuse explicit authorization already present. If the business outcome is undecided, present concrete options and hold only dependent implementation. Once decided, update the baseline and affected tests/tasks together; supersede old evidence when its inputs or promised result changed. After partial work, state what was applied and what remains. Never silently rewrite approved quotes or historical measurements as a side effect of a new formula.

## Review packet and stopping point

Include the baseline, exact diff or document revision, touched rule/AC IDs, test results/site versions and known gaps. A review may start with missing evidence, but its verdict must name that limitation. Read the actual diff and relevant source; the implementer's summary and another model's approval are not proof.

For implementation review, record each relevant AC's implementation evidence, verification evidence and pass/fail/not-run. For spec/task readiness, check that rules, outcomes and the planned verification are clear; do not demand code or executed tests before implementation. Report a concrete defect with location, trigger, business consequence and the check that would prove the repair. Keep questions, evidence gaps and optional improvements distinct. Deduplicate repeated findings; severity follows impact, never reviewer vote counts.

Conclude **ready for the stated gate**, **rework required**, or **decision/evidence needed**. Name the gate (spec ready for tasking, code ready to merge, or release readiness). A known defect requiring repair takes precedence; still list missing decisions/evidence. No passing claim for unrun critical checks. Customer UAT and release authorization remain separate.

Consolidate actionable findings into one repair batch, then check the affected diff and tests. Do not reopen resolved choices without new evidence. If a finding repeats after repair without progress, isolate the disputed rule or reproduction and ask the appropriate owner; do not run an endless multi-model debate. Send the founder a brief result: gate/verdict, consequences, decisions needed, next owner/action. Keep detailed evidence available below it.
