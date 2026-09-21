# Curtain implementation contract

Use as discovery guidance, not the customer's approved operating policy. Explain in Vietnamese. Confirm formulas, prices and approval roles from actual customer documents before implementation.

## Walk one order

| Business step | Explain to the founder | ERPNext candidate to verify |
|---|---|---|
| Lead and survey | Khách hỏi giá; người đo ghi từng phòng, từng ô cửa | Lead/Opportunity; linked custom survey if needed |
| Measurement revision | Kích thước lọt lòng khác kích thước phủ bì; đo lại phải giữ lịch sử | Proposed measurement document/child rows with revision |
| Estimate and quote | Dự toán vật tư nội bộ khác số lượng/đơn giá báo khách | Quotation; custom calculation snapshot where needed |
| Confirm order/deposit | Chốt phạm vi và lịch; tiền ứng trước không đồng nghĩa doanh thu | Sales Order, Payment Terms, Payment Entry according to accounting policy |
| Supply and sewing | Tự may, thuê xưởng may hoặc mua thành phẩm | Material Request, purchasing, BOM/Work Order or Subcontracting as appropriate |
| Install and accept | Giao từng đợt; khách xác nhận số lượng/chất lượng | Delivery Note, Project/Task; custom acceptance only for uncovered needs |
| Invoice and collect | Theo dõi số phải thu và tiền đã thu | Sales Invoice, Payment Entry; accountant validates allocation |
| Warranty and rework | Sửa lỗi, đổi phụ kiện, làm lại; xác định ai chịu phí | Issue, returns and a linked service process appropriate to the site |

These are mapping candidates, not claims that ERPNext has an out-of-box curtain workflow. An invoice is not automatically the local statutory e-invoice integration. Have the customer's accountant validate accounting/tax treatment and use current official guidance for jurisdiction-specific claims.

## Data to discover

- Customer/site, room, stable opening ID, photos/access constraints and survey owner/date.
- Product family: fabric drape, sheer, roller, Roman, vertical, motorized; each may have a different consumption/pricing model.
- Width/height and original unit, inside/outside mount, overlap, clearance, number of panels/layers, opening direction and revision status.
- Fabric code/color/batch when relevant, roll width versus usable width, orientation, fullness (độ nhún), seam/hem allowance, pattern repeat (bước lặp hoa văn), shrinkage and waste policy.
- Track/rod lengths, rounding/cut rules, brackets/hooks/motor, power/control requirements and installation labor/travel.
- Sale unit (bộ, mét ngang, m², chiếc), stock unit (mét vải, cuộn, chiếc), purchase conversions, minimum charge and price-list revision.
- Quote validity, discounts/approval, deposit schedule, change orders, lead time, split delivery, acceptance and warranty scope.

Missing measurements are unknown, never zero. Keep source units and normalize deliberately. A fixed UOM conversion works only for a fixed ratio: do not convert a finished curtain set to meters of fabric using a universal factor when dimensions determine consumption.

## Worked calculation, illustrative only

Assumptions: one fabric layer, vertical drops, no pattern repeat, no shrinkage, no side-seam loss beyond the stated usable width, panel distribution does not require rounding each panel separately. Track width W = 3.00 m; fullness F = 2; usable fabric width U = 1.40 m; finished height H = 2.50 m; top+bottom allowance A = 0.30 m.

`required flat width = W × F = 6.00 m`

`drops = ceil(6.00 / 1.40) = 5`

`cut length per drop = H + A = 2.80 m`

`fabric before extra waste = 5 × 2.80 = 14.00 linear m`

Agree how the five drops are distributed, or round per panel if symmetry requires six. Panel layout is a separate input, not a silent assumption.

For an independently confirmed symmetric two-panel layout, each panel needs `ceil((6.00 / 2) / 1.40) = 3` drops, so total is 6 and fabric is 16.80 m. These are different valid design constraints; ask the workshop which applies.

With a confirmed vertical pattern repeat R = 0.32 m and a rule to round every cut up to a full repeat, `ceil(2.80 / 0.32) × 0.32 = 2.88 m`. Additional pattern matching offsets may still be required. Railroaded fabric, roller area pricing, seam loss and shrinkage need separate rules. Do not generalize this example to all curtains.

For a price illustration only, 14.00 m at 200,000 VND/m is 2,800,000 VND material estimate before accessories, labor, overhead, margin and tax. It is not the sale price. A customer may sell by finished width or by set; keep price calculation separate from stock consumption.

## Modeling choices

Prefer reusable fabric/accessory Items and a proposed per-order configuration linked to the exact sales line when sizes are continuous. Use variants for bounded catalog choices when they genuinely help stock/pricing. A unique finished Item/BOM per order is possible, but costs catalog cleanup and reporting discipline. Compare it with a configured finished-item approach and verify Manufacturing constraints on the actual ERPNext version before deciding.

Do not make a custom document duplicate the stock or accounting ledger. Snapshot approved measurements, formula version, inputs, outputs and override reason on the agreed owner; later edits create a new revision or amendment. Link manufacturing/procurement to the approved revision. Define how an approved change affects an order already cut or partially installed.

## Acceptance cases

Require customer-approved expected values for ordinary and boundary orders. Cover millimeters versus meters, zero/negative/missing dimensions, unusable roll width, two layers, narrow/wide openings, split panels, pattern repeat, remnant reuse policy, shortages, discount limits, price changes after quote acceptance, partial delivery/payment, rework and cancellation after material issue. Restrict installer access to needed job information; do not expose cost/margin merely because it is present on linked documents.
