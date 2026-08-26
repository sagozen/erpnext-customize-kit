---
name: pankit
description: "Use when the user wants to specify, plan, design, implement, test, review, document, release, or reflect on a software change. Covers writing a spec or acceptance criteria, sequencing an implementation plan, choosing a technical shape, writing code against existing conventions, adding or running tests, reviewing a diff or pull request, reconciling documentation, cutting a release, and capturing what a piece of work taught. This is a placeholder skeleton: each command's reference file is a template to be replaced with real instructions."
version: 0.1.0
---

This skill routes software delivery work through one command per stage of the lifecycle. Each stage has a reference file that owns the how; this file owns the routing and the rules that hold across every stage.

**This repository ships placeholders.** Every file under `reference/` is a skeleton with the section shape filled in and the substance left to the author. Replace them with real instructions before relying on any command.

Core principles:

- One stage at a time. A command does the work its stage owns and hands off; it does not quietly run the next stage.
- Written before built. Scope, acceptance criteria, and decisions live in files, not in the conversation.
- Evidence over assertion. A claim about the codebase is backed by a path, a test result, or a command's output.
- Finish the requested scope. Report what was skipped and why rather than narrowing the work silently.

## Setup

1. Run `node <skill-base-dir>/scripts/context.mjs` once per session, where `<skill-base-dir>` is the loaded base directory the runtime reports for this skill; keep cwd at the user's project. That base directory resolves every `node .agents/skills/pankit/scripts/...` command in this skill and its references, and `.agents/skills/pankit/scripts` is the fallback only when the runtime reports no base directory. Pass a named source file as `--target <path>`. Follow its directives and do not rerun it.
2. Before acting, load the one reference that owns the request: the Commands table's file for an explicit or clearly implied sub-command. Then read the code the request touches, plus at least one nearby example of the convention you are about to follow.
3. Confirm the stage before doing the work of a later one. A request to implement something with no accepted scope routes through `spec` first.

## Stages

The stage names what this pass is accountable for producing.

- **Define:** the change is described well enough that two people would build the same thing. Produces a spec, a plan, or a recorded technical decision. No code.
- **Build:** the change exists in the codebase and matches the accepted scope.
- **Verify:** the change is shown to work and shown to be safe to merge. Produces test results and review findings, not fixes applied by stealth.
- **Ship:** the change reaches users, is documented, and leaves a durable record.

Choose the stage from what the request is missing, not from what is most fun to do next. A request to "add caching" with no written scope is Define work even though it sounds like Build work.

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `spec [feature]` | Define | Write the problem, users, acceptance criteria, and non-goals | [reference/spec.md](reference/spec.md) |
| `plan [spec]` | Define | Sequence an accepted spec into phases with owners and risks | [reference/plan.md](reference/plan.md) |
| `design [subsystem]` | Define | Choose and record the technical shape and its trade-offs | [reference/design.md](reference/design.md) |
| `code [plan]` | Build | Implement an accepted plan against existing conventions | [reference/code.md](reference/code.md) |
| `test [target]` | Verify | Write and run the tests that prove the change | [reference/test.md](reference/test.md) |
| `review [diff]` | Verify | Review a diff, branch, or PR and rank findings by severity | [reference/review.md](reference/review.md) |
| `docs [target]` | Ship | Reconcile the documentation the change owes | [reference/docs.md](reference/docs.md) |
| `release [component]` | Ship | Bump, changelog, verify, tag, publish | [reference/release.md](reference/release.md) |
| `retro [milestone]` | Ship | Capture what the work taught and what becomes convention | [reference/retro.md](reference/retro.md) |

Routing:

- **No argument:** read [routing.md](reference/routing.md) and present its context-aware menu; never auto-run a command.
- **Explicit or clearly implied command:** load its reference and follow it. Ask once if two commands fit.
- **Otherwise:** treat the request as ordinary delivery work and enter at the earliest stage that is missing its artifact. Implementation with no written scope enters at `spec`; a narrow fix to existing code proceeds directly, offering `spec` afterward rather than blocking on it.

**Pin / Unpin:** `node .agents/skills/pankit/scripts/pin.mjs <pin|unpin> <command>` creates or removes a standalone `$<command>` shortcut. Report the script's result concisely; relay stderr verbatim on error.

**Hooks:** `$pankit hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>` manages the post-edit hook for this project. Load [reference/hooks.md](reference/hooks.md) when the user invokes it with any argument.

**Doctor:** `$pankit doctor` reports and repairs drift between this project's PanKit artifacts and what this version reads. Load [reference/doctor.md](reference/doctor.md) when the user invokes it, or when they ask what is out of date. A `CONTEXT_STALE` directive in Setup's output is the cheap subset of the same report; act on it there per its own instructions rather than running doctor unasked.

**Never repair drift as a side effect of a delivery task.** A `CONTEXT_STALE` finding is reported, not acted on, unless the user asks. The one exception is a finding marked `auto`, which the next write to that file performs anyway.