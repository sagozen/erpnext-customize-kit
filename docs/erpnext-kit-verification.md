# Verification record, 2026-09-21

## Passed

- `bun run build:release`: compiled provider skills, plugin bundles and repository validators.
- `bun run test:core`: 285 Bun tests and 741 Node tests passed, 1,026 total; zero failures. Local server tests required execution outside the filesystem/network sandbox.
- Focused installer/routing/plugin packaging checks: 13 passed.
- Real pinned Frappe checkout: installed the custom skill plus ten upstream skills for each of Claude/Codex, 22 destination folders. Repeat installation reported all unchanged.
- Installer regressions cover changed destination preservation, symlinks, invalid ancestors, incorrect upstream revision and exclusion of ignored/untracked upstream content.
- MCP source at the pinned commit with the supplied dependency lock: clean npm install, TypeScript build, runtime audit with zero reported vulnerabilities, protocol handshake and listing 11 tools.
- Local links in new guides/domain references and Git whitespace checks passed.
- Independent code review: three findings fixed and re-reviewed (Codex default prompt, upstream ignored-file copying, invalid install ancestors).

## Not passed or not run

- Default `bun run test` is **not fully green**. Its existing plugin E2E setup calls `claude plugin details`, which returns unknown command inside the test's isolated Claude configuration. The normal user-session CLI (2.1.221) lists the command, so this is an isolated-configuration compatibility gap rather than proof that the binary lacks it. Four inventory assertions were cancelled by the failing setup. The test was not skipped, weakened or rewritten; core/packaging tests do not replace this loader inventory check. Resolve inventory availability in the isolated configuration or update the E2E contract with equivalent real loader evidence in a separate tooling change.
- The system skill-creator quick validator rejects the repository-generated top-level `version` frontmatter field. That field already comes from the existing provider builder. Repository frontmatter/build validators pass; the stricter external validator mismatch was not hidden by changing the artifact under test.
- No authenticated ERPNext site read/write, customer app integration, production deployment or customer UAT was run. No customer credentials were available or installed. MCP protocol listing does not establish Frappe authorization or workflow correctness.
- Curtain calculations are discovery examples, not customer-approved pricing or production rules.

The original MCP dependency lock reported 11 vulnerabilities. The supplied replacement lock updates dependencies within existing upstream ranges and was audited again after clean installation. The manifest records hashes and the check date; re-audit at deployment because advisories change.
