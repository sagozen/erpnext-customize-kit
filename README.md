# PanKit ERPNext cho Sankaku

Kit triển khai ERPNext ngành rèm cho dev kiêm người điều phối mới làm ERP. One skill, nine commands: giữ tên `pankit`, bổ sung tư vấn nghiệp vụ, phát triển `sankaku_erp`, migration, demo và bàn giao bằng tiếng Việt dễ hiểu.

**Bắt đầu tại [hướng dẫn cài từng bước](docs/getting-started-vi.md).** Kit chứa skills và bộ cài; ERPNext site và app khách hàng được xây dựng trong project riêng.

## Cài vào project

Trong checkout này, với Git, Node từ 22.18 và Bun:

```bash
bun install --frozen-lockfile
bun run build:release
node scripts/install-erpnext-kit.mjs --project /absolute/path/to/sankaku_erp --dry-run
node scripts/install-erpnext-kit.mjs --project /absolute/path/to/sankaku_erp
```

Thay đường dẫn bằng project đã tồn tại. Bộ cài hỗ trợ Claude Code/Codex, từ chối ghi đè skill đã sửa và không đổi config toàn cục. Bỏ bước Bun khi dùng provider artifacts đã build. Không dùng bản npm công khai để cập nhật kit custom này.

Mở session trong project vừa cài:

```text
/pankit spec <yêu cầu khách>    # Claude Code
$pankit spec <yêu cầu khách>   # Codex
```

## Nine commands

| Lệnh | Kết quả |
|---|---|
| `spec` | Giải thích nghiệp vụ, yêu cầu, fit-gap và nghiệm thu |
| `plan` | Kế hoạch setup, custom, migration, demo và bàn giao |
| `design` | Phương án, đánh đổi và quyết định chuẩn/custom |
| `code` | Code sankaku_erp, cấu hình có source và tests |
| `test` | Kiểm tra công thức, quyền, chứng từ, import, UAT |
| `review` | Rủi ro nghiệp vụ/nâng cấp và bằng chứng còn thiếu |
| `docs` | Hướng dẫn người dùng, demo và vận hành |
| `release` | Diễn tập/triển khai đúng môi trường với phục hồi |
| `retro` | Bài học và cải tiến triển khai/bảo trì |

Chỉ `/pankit` hoặc `$pankit` để chọn việc tiếp theo. Agent tiếp tục các bước đã được cho phép; chỉ hỏi quyết định nghiệp vụ hoặc quyền truy cập còn thiếu.

Với mô hình một người điều phối và thuê chuyên gia: dùng **spec ngắn → task rõ → code kèm tests → review theo baseline**. Xem [hướng dẫn giao việc và review](docs/spec-review-workflow-vi.md), có mẫu spec, task, prompt review và cách đánh giá yêu cầu thay đổi. Không cần cài thêm bộ skill BA.

## Hướng dẫn

- [Cài kit, Frappe skills và tạo app ban đầu](docs/getting-started-vi.md)
- [Kết nối ERPNext MCP](docs/mcp-setup-vi.md)
- [Triển khai dự án rèm đến vận hành](docs/curtain-delivery-playbook-vi.md)
- [Prompt và mẫu hồ sơ khách](docs/customer-workbook-vi.md)
- [Spec, giao chuyên gia và review thay đổi](docs/spec-review-workflow-vi.md)
- [Kiến trúc và bảo trì kit](docs/erpnext-kit-architecture.md)
- [Nghiệp vụ và công thức minh họa](skill/reference/curtain-domain.md)
- [Chuyển sang ngành khác](skill/reference/domain-adaptation.md)

Công thức minh họa phải được khách xác nhận. Prompt không thay thế phân quyền thực tế trên Frappe. Build kit thành công chưa chứng minh ứng dụng khách đã nghiệm thu.

## Phát triển kit

`skill/` là source; `.claude/`, `.cursor/`, `.codex/`, `.agents/`, `plugin/` là generated output. `integrations/erpnext-lock.json` ghim upstream. Không sửa generated files trực tiếp.

```bash
bun run build
bun run build:release
bun run test
```

Xem [Developer Guide](docs/DEVELOP.md) và [Harnesses](docs/HARNESSES.md). Visual/browser helpers cũ giữ để tương thích nhưng không chạy mặc định trong workflow ERPNext.

## License

Apache 2.0; xem `NOTICE.md`. External Frappe skills và MCP giữ license upstream riêng.
