# design: Compare standard configuration and custom app designs

Stage: **Define**. Invoked as `{{command_prefix}}pankit design`.

## When this runs

Compare standard configuration and custom app designs when requested or needed to complete authorized ERPNext work.

## Read first

Read requirements, existing DocTypes and installed Frappe source/version. Use [erpnext-platform.md](erpnext-platform.md), the active domain and [migration.md](migration.md) when changing data contracts.

## Steps

1. State the business decision using a representative transaction. Evaluate standard configuration before new fields or DocTypes.
2. Compare viable options by fit, effort, user steps, reporting, upgrades, support and reversibility. Recommend in Vietnamese and record the customer's choice.
3. For curtains compare order-specific measurement/configuration linked to sales lines with catalog Items/Variants. Use variants for bounded reusable attributes; explain Item/BOM growth before making every dimension a SKU.
4. Separate quote estimate, production BOM and actual consumption. Explain BOM (bill of materials, định mức nguyên vật liệu) with the agreed order. Select Manufacturing, Subcontracting or purchase/resale from the actual supply model.
5. Define links, child ownership, revision snapshots, lifecycle, roles, units/precision, validation and retry identity. Curtain Measurement and similar names are proposed custom DocTypes, not built-ins.
6. Keep code in sankaku_erp. Choose filtered fixtures or exported customizations with one owner per record. Verify version-specific hooks. Do not assume Server Scripts are universally available or use them as the portable core pricing engine.
7. Record migration, testing and recovery implications.

## What this produces

A decision record and data contract with options, decision, consequences and revisit conditions.

## Handoff

Pass to plan or continue authorized implementation with code.
