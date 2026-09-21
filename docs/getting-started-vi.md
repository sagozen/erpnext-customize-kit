# Bắt đầu với PanKit ERPNext cho Sankaku

Kit giúp Claude Code/Codex tư vấn và triển khai ERPNext ngành rèm trong **repo app của khách**. Kit không tự cài ERPNext và chưa chứa ứng dụng `sankaku_erp` hoàn chỉnh.

## 1. Hiểu các thành phần

| Thành phần | Nhiệm vụ |
|---|---|
| PanKit/Sankaku guidance | Giải thích nghiệp vụ, chọn giải pháp, kiểm thử, demo, bàn giao |
| Frappe Claude Skill Package | Hướng dẫn kỹ thuật DocType, controller, permissions, tests |
| ERPNext MCP | Đọc/thao tác site trong quyền được cấp; không thay thế code/migration |
| `sankaku_erp` | App chứa customization thực tế của khách |

Agent đọc skills → đối chiếu docs/source và site → sửa app → kiểm thử → triển khai ERPNext. MCP là tùy chọn; thiếu nó vẫn làm discovery, thiết kế và code cục bộ được.

## 2. Build và cài kit

Cần Git, Node theo `package.json` (từ 22.18) và Bun khi sửa/build kit. Các ví dụ terminal dùng macOS/Linux; Windows thay đường dẫn hoặc dùng WSL. Bộ cài Node chạy độc lập với Bash.

Tại repo `pankit-community` đã nhận bản custom:

```bash
node --version
bun install --frozen-lockfile
bun run build:release
node scripts/install-erpnext-kit.mjs --help
```

Nếu dùng provider artifacts đã build trong repo, bỏ hai lệnh Bun. Không dùng `npx pankit skills install` hay `pankit update` để lấy bản custom: nguồn công khai không được bảo đảm là bản Sankaku.

Thay `/path/to/sankaku_erp` bằng thư mục project thật **đã tồn tại**:

```bash
node scripts/install-erpnext-kit.mjs --project /path/to/sankaku_erp --dry-run
node scripts/install-erpnext-kit.mjs --project /path/to/sankaku_erp
```

Chưa có app: tạo thư mục project discovery riêng, sau này cài lại kit vào repo app. Bộ cài chép `.claude/skills/pankit` và `.agents/skills/pankit`. Dùng `--provider claude` hoặc `--provider codex` nếu chỉ cần một bên. Không sửa config toàn cục, không bật hooks, không gọi mạng và không ghi ERPNext.

Lần hai báo `unchanged` là đúng. Nếu skill đích đã thay đổi, bộ cài dừng trước khi ghi. Đọc diff, sao lưu skill cũ ra **ngoài thư mục skills**, rồi cài lại. Không chạy đồng thời hai installer trên cùng project.

## 3. Thêm Frappe skills

[Manifest tích hợp](../integrations/erpnext-lock.json) ghi URL, commit và 10 skill khởi đầu. Clone upstream vào thư mục tools riêng:

```bash
git clone https://github.com/Impertio-Studio/Frappe_Claude_Skill_Package.git /path/to/tools/frappe-skills
git -C /path/to/tools/frappe-skills checkout --detach 36cfa807518f48e4210fac2a5afc6adafad4c53e
node scripts/install-erpnext-kit.mjs --project /path/to/sankaku_erp --frappe-source /path/to/tools/frappe-skills --dry-run
node scripts/install-erpnext-kit.mjs --project /path/to/sankaku_erp --frappe-source /path/to/tools/frappe-skills
```

Thay toàn bộ đường dẫn minh họa. Bộ cài kiểm tra commit và checkout sạch, giữ tài liệu đi kèm/license, đặt từng skill trực tiếp dưới thư mục skills. Không chép thư mục phân loại `syntax/`, `core/` làm top-level skill. Agent chỉ đọc skill liên quan khi làm việc.

Muốn thêm capability: xác minh catalog upstream, thêm đường dẫn vào manifest và kiểm thử. Không tự nâng mọi dev lên `main`. Pin commit giúp lặp lại cài đặt, không bảo đảm tương thích mọi ERPNext.

## 4. Kiểm tra agent nhận skill

Mở session mới từ **project vừa cài**. Claude Code:

```text
/pankit
/pankit spec Khách làm rèm may đo, hiện đo và báo giá bằng Excel. Tôi mới ERPNext. Giải thích thuật ngữ, hỏi thông tin còn thiếu và so sánh phần có sẵn với phần cần custom.
```

Codex:

```text
$pankit
$pankit spec Khách làm rèm may đo, hiện đo và báo giá bằng Excel. Tôi mới ERPNext. Giải thích thuật ngữ, hỏi thông tin còn thiếu và so sánh phần có sẵn với phần cần custom.
```

Mong đợi: tiếng Việt dễ hiểu, giả định được đánh dấu, hỏi cách đo/tính/bán/may và có bảng fit-gap. Agent không được nói đã tạo site hoặc kết nối MCP khi chưa thực hiện.

Không thấy skill: kiểm tra cwd, đường dẫn `SKILL.md`, session mới và bản `pankit` cũ ở scope khác. Tránh cài cùng skill vào cả `.codex/skills` và `.agents/skills` bằng nhiều phương thức gây trùng.

## 5. Chuẩn bị ERPNext và app

Chọn host quản lý có hỗ trợ custom app hoặc tự vận hành theo [Frappe Docker](https://github.com/frappe/frappe_docker)/[Framework docs](https://docs.frappe.io/framework). So sánh tiền hosting với thời gian bạn phải dành cho backup, cập nhật, giám sát và phục hồi.

Trong một **Bench tương thích đã hoạt động**, không phải repo kit:

```bash
bench version
bench --site YOUR_DEV_SITE list-apps
bench new-app --help
bench --site YOUR_DEV_SITE install-app --help
```

Khi app chưa tồn tại và đã xác minh site:

```bash
bench new-app sankaku_erp
bench --site YOUR_DEV_SITE install-app sankaku_erp
```

Đây là bước tạo app trong Bench, không phải cài Linux/DB/Redis/ERPNext từ máy trống. Docker/managed host dùng quy trình custom app của nơi triển khai. Không coi container demo là môi trường production bền vững.

Ghi versions thật, hosting, app path, site dev/test/production và phạm vi thao tác trong `docs/erpnext/project-context.md` của project khách. Không ghi credentials. Chốt Company, tiền tệ, kho, đơn vị tính và người phụ trách kế toán trước nhập giao dịch.

## 6. Từ cài đặt đến đơn hàng đầu tiên

Làm [hướng dẫn MCP](mcp-setup-vi.md) nếu cần đọc site từ agent. Đọc [playbook triển khai](curtain-delivery-playbook-vi.md), dùng [prompt và mẫu hồ sơ](customer-workbook-vi.md). Bắt đầu từ một đơn hàng đã ẩn thông tin riêng tư thay vì yêu cầu agent tạo ngay toàn bộ ERP.
