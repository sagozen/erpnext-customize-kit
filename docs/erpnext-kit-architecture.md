# ERPNext kit ownership and maintenance

PanKit remains one skill with nine commands. The source of truth is `skill/SKILL.src.md`, `skill/reference/` and `skill/scripts/command-metadata.json`. Build contracts, command names and the existing CLI package identity remain compatible.

## Layers

| Layer | Owner | Update rule |
|---|---|---|
| Delivery workflow | Router and nine command references | Explain business meaning, preserve authorized scope |
| Curtain domain | curtain-domain.md | Customer examples validate rules; no universal formula |
| Customer decisions | Customer app docs/erpnext | Facts, assumptions, choices and UAT remain separate |
| Framework guidance | Pinned external Frappe skills + official docs/source | Verify against deployed version; load selectively |
| Site access | Selected MCP adapter and Frappe roles | Separate identity/environment; live permission tests |
| Deployed implementation | Customer's sankaku_erp app | Code, exported config, patches, tests and runbooks |

The kit intentionally does not ship a fake app scaffold or guessed DocTypes as working ERPNext functionality. Generate the real app in a compatible Bench and implement the approved customer contract.

## Build and install

`bun run build` compiles without syncing tracked harnesses. `bun run build:release` also updates `.claude`, `.cursor`, `.codex`, `.agents` and `plugin` from source. Do not hand-edit those outputs. The explicit ERPNext installer copies just the compiled skill into `.claude/skills` and/or `.agents/skills` in an existing project; no hooks or global config are installed.

`integrations/erpnext-lock.json` owns external repository commits, selected Frappe skill directories and the MCP runtime contract. The installer checks upstream revision/cleanliness and preserves upstream license text. It has no network or arbitrary install commands. Dry-run performs the same collision checks as a real install; matching content is idempotent and differing content is refused before any writes. Files are staged per skill before rename. Do not run concurrent installs into the same destination.

Upstream skill content comes from committed Git blobs, excluding ignored/untracked local files. MCP uses the pinned source plus `integrations/erpnext-mcp-package-lock.json`, a separately hashed dependency lock updated within upstream ranges after the original lock reported vulnerabilities. Its clean install/build, runtime audit and protocol smoke test were checked; authenticated site operations remain unverified. Copy the provided smoke script into the MCP checkout so its SDK imports resolve against the adapter dependencies.

## Legacy boundaries

Existing visual/browser helpers remain for compatibility, but the ERPNext router does not boot visual context, recommend visual hooks or route to live-design commands. Plugin packaging may still carry legacy hooks; the documented project-local install avoids activating them. `doctor` is legacy PanKit artifact maintenance, not a Bench/MCP health check.

The public npm install/update route can refer to another distribution. Use this checkout's installer for Sankaku. Package publication, brand renaming and removal of carried-over browser code are outside this refactor.

## Maintenance procedure

1. Edit authored sources, not provider output. Keep command metadata/router/category registrations aligned.
2. For external updates inspect repository/license/API changes, change the pinned revision and selected skills together, then test a clean install with that actual checkout.
3. Run `bun run build:release`, focused installer/routing tests and `bun run test`. The optional remote CLI suite checks public distribution and is not a Sankaku acceptance gate.
4. Inspect generated Claude/Codex references for unresolved tokens, broken links and stale instructions. Smoke-test representative prompts without a live site first, then verify site integration separately.
5. Preserve customer modifications during upgrades: diff installed skill, back it up outside discovery directories and reinstall. Never overwrite silently.

## Sources and verification boundaries

Source/API review date: 2026-09-21. Links are entry points; the deployed version's source wins over unversioned claims.

- [Frappe skills](https://github.com/Impertio-Studio/Frappe_Claude_Skill_Package), [REST MCP adapter](https://github.com/rakeshgangwar/erpnext-mcp-server): exact commits in the manifest.
- [Frappe MCP](https://github.com/frappe/mcp): separate experimental app-side option, not the default adapter.
- [Framework](https://docs.frappe.io/framework), [ERPNext](https://docs.frappe.io/erpnext), [BOM](https://docs.frappe.io/erpnext/bill-of-materials), [Data Import](https://docs.frappe.io/erpnext/data-import).
- Installed `claude mcp add --help` and `codex mcp add --help` verified registration syntax during this refactor.

Kit tests validate packaging/install contracts. They do not certify customer calculations, a production ERPNext deployment or live MCP permissions. Those need the actual app/site, credentials supplied privately and customer UAT.
