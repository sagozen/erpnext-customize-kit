# Prompt và hồ sơ dự án khách

Copy mẫu cần dùng vào project khách, điền bằng bằng chứng thật. Các ô “chưa rõ” phải được giải quyết bởi người có thẩm quyền; không cho agent tự điền thành policy.

## Prompt mở đầu

Claude Code dùng `/pankit`; Codex dùng `$pankit`. Ví dụ bên dưới dùng Claude:

```text
/pankit spec
Tôi là dev kiêm người triển khai, mới ERPNext và chưa rành nghiệp vụ.
Ngành: rèm may đo. App: sankaku_erp.
Yêu cầu nguyên văn của khách: [dán nội dung đã ẩn thông tin riêng tư].
Tài liệu có sẵn: [phiếu đo, báo giá, Excel, quy trình].
Môi trường/phiên bản biết được: [điền hoặc ghi chưa có].
Hãy giải thích thuật ngữ bằng ví dụ, phân biệt dữ kiện/giả định,
hỏi những điều ảnh hưởng giải pháp và lập fit-gap với ERPNext.
Với quyết định lớn, so sánh cách chuẩn/custom và công sức bảo trì,
khuyến nghị phù hợp người triển khai một mình. Chưa tự chọn công thức,
thuế hay hạch toán khi khách chưa xác nhận.
```

## Hồ sơ bối cảnh: docs/erpnext/project-context.md

| Trường | Giá trị cần điền |
|---|---|
| Khách/người chốt nghiệp vụ | Tên dự án nội bộ, vai trò và người quyết định |
| Domain/app | curtains / sankaku_erp, hoặc lựa chọn đã chốt |
| Outcome | Công việc nào phải làm được, đo bằng gì |
| Constraints/non-goals | Ngân sách, thời gian, hosting, phạm vi không thực hiện |
| Versions | Frappe, ERPNext, app commit; lấy từ môi trường thật |
| Environments | Dev, staging, production; không ghi credentials |
| Access scope | Được đọc/ghi môi trường nào, việc gì |
| Evidence | Link yêu cầu, quyết định, mẫu tính, tests/UAT |

## Bảng yêu cầu và fit-gap

| ID | Nguồn | Người làm | Nhu cầu/ngoại lệ | Đơn vị/quy tắc | ERPNext candidate | Standard/config/app | Chưa rõ | Nghiệm thu |
|---|---|---|---|---|---|---|---|---|
| REQ-01 | Phiếu đo khách | Người đo | Đo lại cửa đã duyệt | Rộng/cao, đơn vị và revision | Custom linked measurement, cần đánh giá | Chưa quyết định | Ai duyệt lại? | Báo giá cũ giữ số cũ; lần mới có lịch sử |

Dòng trên là ví dụ cách viết, không phải yêu cầu mặc định của khách.

## Prompt chọn giải pháp

```text
/pankit design docs/erpnext/requirements.md
So sánh mô hình số đo theo dòng đơn hàng với Item/Variant/BOM theo đơn.
Giải thích ảnh hưởng đến kho, sản xuất, báo cáo và nâng cấp.
Đọc phiên bản/schema thật trước khi kết luận. Khuyến nghị và ghi rõ
điều kiện khiến phương án còn lại tốt hơn; chưa quyết thay nghiệp vụ khách.
```

Quyết định cần ghi: bài toán → bằng chứng → phương án → lợi/hại/chi phí → lựa chọn/người chốt → hậu quả → khi nào xem lại.

## Prompt thực hiện

```text
/pankit plan docs/erpnext/requirements.md
Lập kế hoạch đủ từ dev site đến demo, migration, UAT và bàn giao.
Ghi dependency, đầu ra, tests, rollback, effort range và giả định.
```

```text
/pankit code plans/<plan-da-chot>/plan.md
Thực hiện phạm vi đã chốt trên dev, tiếp tục kiểm thử và sửa lỗi.
Chỉ dừng phần phụ thuộc vào quyết định nghiệp vụ chưa có hoặc truy cập thiếu.
Không chỉnh core ERPNext. Ghi rõ tests nào chạy thật, chưa chạy vì sao.
```

## Mẫu nghiệm thu

| Requirement | Role/site | Input/precondition | Thao tác | Expected | Actual | Kết quả | Evidence/người duyệt |
|---|---|---|---|---|---|---|---|
| ID đã chốt | User có role thật | Số đo/đơn vị/revision | Bước tái hiện | Số độc lập xác nhận | Kết quả thực tế | Pass/fail/not-run | Screenshot/log đã che dữ liệu |

## Prompt migration/demo/release

```text
/pankit plan Chuyển dữ liệu Excel sang staging.
Lập mapping, external identity, thứ tự nhập, lỗi bị loại, chống trùng,
đối soát và rollback. Chưa ghi production. Ghi rõ dữ liệu nào chưa được cung cấp.
```

```text
/pankit docs Chuẩn bị demo ngành rèm theo requirements đã chốt.
Giải thích cho chủ xưởng không rành ERP. Dùng một đơn xuyên suốt,
phân biệt đã chạy được/thủ công/chưa có. Kèm UAT cho khách tự thử.
```

```text
/pankit release staging
Diễn tập bản release đã review theo runbook, chạy migration và kiểm tra
quyền/nghiệp vụ. Ghi bằng chứng backup/restore. Chưa cutover production.
```

## Checklist kết thúc dự án

- Mỗi yêu cầu có kết quả nghiệm thu, hoặc phần còn thiếu được ghi rõ.
- App/source/config đủ tái cài trên site sạch và upgrade từ bản trước.
- Công thức, quyền, chứng từ và import được kiểm tra với ví dụ thật đã duyệt.
- Có backup/restore rehearsal, runbook và người vận hành chịu trách nhiệm.
- Khách hiểu thao tác chính, đường sửa sai, giới hạn và hỗ trợ sau bàn giao.
