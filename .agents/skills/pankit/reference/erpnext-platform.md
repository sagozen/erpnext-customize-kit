# ERPNext platform and setup

Explain the layers: ERPNext is the business application; Frappe is its framework; a site holds one installation's database/files; Bench manages apps/sites; `sankaku_erp` is the custom Frappe app. This repository installs agent guidance, not ERPNext.

## Establish evidence

Record exact Frappe, ERPNext, Python/Node and app versions, hosting and allowed access before prescribing installation commands. For an existing Bench use `bench version`, `bench --site SITE list-apps` and command help. Do not infer the installed version from upstream skill coverage. Check hosting permits custom apps and the chosen integration.

For a solo operator compare a managed host that supports custom apps (less infrastructure work, hosting constraints/cost) with a maintained self-hosted deployment (control, but backups, updates, monitoring and security are your responsibility). A disposable demo image is not automatically a production topology. Use the current [Frappe Docker repository](https://github.com/frappe/frappe_docker) or [Framework installation docs](https://docs.frappe.io/framework/user/en/installation) for the chosen version.

Create dev, test/staging and production boundaries appropriate to scope. Do not copy production credentials into a demo. Confirm company, currency, fiscal year, warehouses, UOM, roles and accounting decisions with responsible users before importing transactions.

## Customization ownership

Compare standard configuration, Customize Form/Workflow/Print Format exported to the app, custom DocTypes/controllers, and external integration. A Desk experiment is acceptable in a disposable development site; durable changes must be reproducible from source.

Use `bench new-app sankaku_erp` only in a real compatible Bench, then install the app on the identified dev site. Use installed help for exact commands/options. Keep app dependencies explicit. Standard DocType edits belong in filtered fixtures or exported customization, with one source owner per record. New app DocTypes belong in source JSON/controllers. Review exports to prevent shipping unrelated roles, users or client records.

Prefer permission-aware document operations. Validate all external inputs server-side. Review raw SQL, ignore_permissions, arbitrary whitelisted method calls and transaction boundaries against the actual caller and threat model. Do not ban privileged installation code blindly; keep it out of normal user flows.

## Load Frappe skills selectively

Use the live installed catalog, not a guessed slash command. Typical capabilities are custom app/DocTypes/controllers/hooks, permissions/API, unit tests, app lifecycle/backup/upgrades. The pinned upstream package's corresponding names include `frappe-syntax-customapp`, `frappe-syntax-doctypes`, `frappe-syntax-controllers`, `frappe-syntax-hooks`, `frappe-core-permissions`, `frappe-core-api`, `frappe-testing-unit`, `frappe-ops-app-lifecycle`, `frappe-ops-backup` and `frappe-ops-upgrades`. Load only what this change needs; verify APIs against source/docs.

## Authoritative lookup

- [Framework documentation](https://docs.frappe.io/framework): DocTypes, controllers, hooks, fixtures, tests, Bench.
- [ERPNext documentation](https://docs.frappe.io/erpnext): sales, purchasing, stock, manufacturing, projects and accounts.
- [Frappe source](https://github.com/frappe/frappe) and [ERPNext source](https://github.com/frappe/erpnext): select the installed tag/commit, not develop by default.
- [Frappe skill package](https://github.com/Impertio-Studio/Frappe_Claude_Skill_Package): community implementation guidance, not official API authority.

When sources disagree, show version and evidence. Do not claim latest compatibility without tests. Record source URL, relevant version and date in consequential decisions.
