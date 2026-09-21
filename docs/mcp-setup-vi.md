# Kết nối ERPNext MCP

Kit chọn adapter cộng đồng [rakeshgangwar/erpnext-mcp-server](https://github.com/rakeshgangwar/erpnext-mcp-server), ghim trong [manifest](../integrations/erpnext-lock.json). Adapter dùng Frappe REST API qua Node/stdio. [frappe/mcp](https://github.com/frappe/mcp) là lựa chọn khác để app tự xuất tools; README dự án đó mô tả trạng thái experimental. Không tráo cấu hình hai dự án.

## 1. Build adapter

Thay đường dẫn minh họa bằng thư mục tools riêng của bạn:

```bash
git clone https://github.com/rakeshgangwar/erpnext-mcp-server.git /path/to/tools/erpnext-mcp-server
git -C /path/to/tools/erpnext-mcp-server checkout --detach 1783265130e01c29f32666f383b52f6604103d51
cp /path/to/pankit-community/integrations/erpnext-mcp-package-lock.json /path/to/tools/erpnext-mcp-server/package-lock.json
cp /path/to/pankit-community/integrations/erpnext-mcp-smoke.mjs /path/to/tools/erpnext-mcp-server/kit-protocol-smoke.mjs
cd /path/to/tools/erpnext-mcp-server
npm ci
npm run build
npm audit --omit=dev
node kit-protocol-smoke.mjs
```

Entrypoint là `build/index.js`. Khi đổi commit, đọc diff/dependencies và chạy lại smoke test. Không dùng package có tên giống nhưng chưa kiểm chứng nguồn.

Kit cung cấp lockfile dependency cập nhật trong phạm vi version ranges của source đã ghim. Lock upstream tại thời điểm kiểm tra có 11 cảnh báo; lock của kit đã qua cài sạch, build, audit runtime 0 cảnh báo và handshake/liệt kê 11 tools vào 2026-09-21. SHA-256 lưu trong manifest để kiểm tra tính toàn vẹn. Kết quả audit chỉ có hiệu lực tại thời điểm chạy, không phải bảo đảm vĩnh viễn. Không tự chạy `npm audit fix --force` trên bản đang dùng.

Smoke script chỉ handshake/liệt kê tools; dùng URL loopback không có ERPNext, không gửi nghiệp vụ hay credentials. Nó không chứng minh xác thực site hoặc quyền Frappe. File lock thay đổi có chủ đích nên checkout MCP sẽ báo modified; giữ source commit và dependency lock của kit đi cùng nhau.

## 2. Cấp quyền và chuẩn bị credentials

Tạo integration user riêng trên dev site, cấp quyền theo DocType/company cần dùng. Không chọn Administrator/System Manager làm mặc định. Tạo API key/secret bằng cơ chế site. Không gửi secret vào chat, ảnh hoặc commit.

Dùng editor tạo file key-value **ngoài repo**, ví dụ `/absolute/private/erpnext-dev.credentials`, điền giá trị thật cục bộ:

```text
ERPNEXT_URL=https://your-development-site.example
ERPNEXT_API_KEY=REPLACE_LOCALLY
ERPNEXT_API_SECRET=REPLACE_LOCALLY
```

```bash
chmod 600 /absolute/private/erpnext-dev.credentials
```

Node từ 22.18 hỗ trợ `--env-file`, đọc file key-value bất kể phần mở rộng. Config MCP chỉ chứa đường dẫn, không chứa secret. Biến `ERPNEXT_*` cũ trong môi trường process có thể ưu tiên hơn file; bỏ chúng khỏi môi trường khởi chạy để tránh sai site. Mỗi môi trường dùng file/user/tên server riêng. Dùng HTTPS cho site từ xa.

## 3. Claude Code

Từ repo app, thay đường dẫn tuyệt đối:

```bash
claude mcp add --scope local --transport stdio erpnext-dev -- node --env-file=/absolute/private/erpnext-dev.credentials /path/to/tools/erpnext-mcp-server/build/index.js
claude mcp list
```

Bạn chạy bước đăng ký khi sẵn sàng. Nếu cấu hình thủ công, dùng [mẫu JSON](../integrations/claude-mcp.example.json), thay đường dẫn và merge entry; không ghi đè MCP khác. Không đưa secret qua tham số command line lưu trong history.

## 4. Codex

```bash
codex mcp add erpnext-dev -- node --env-file=/absolute/private/erpnext-dev.credentials /path/to/tools/erpnext-mcp-server/build/index.js
codex mcp list
```

CLI có thể lưu entry ở config người dùng. Kiểm tra `codex mcp add --help` và scope của phiên bản bạn dùng; đặt tên phân biệt khách/site. [Mẫu TOML](../integrations/codex-mcp.example.toml) dùng khi merge thủ công. Kit không tự đăng ký hoặc sửa config toàn cục.

## 5. Xác minh kết nối

Mở session mới và gửi:

```text
Liệt kê tools thật của erpnext-dev, xác nhận site và quyền được cấp. Chỉ đọc metadata Item và một bản ghi demo được phép. Không tạo/sửa/submit/cancel/xóa. Che dữ liệu riêng tư, không in credentials. Báo rõ bước thành công và chưa kiểm tra.
```

Agent phải dùng catalog runtime, không đoán tên tool. Trên site thử nghiệm, xác minh hành động bị cấm thực sự bị Frappe từ chối bằng tài khoản hạn chế. Adapter generic vẫn có tools ghi/gọi method: prompt “chỉ đọc” không tạo ra quyền read-only. Phải kiểm tra giới hạn ở Frappe/server.

Các mức bằng chứng khác nhau: config hợp lệ → process chạy → handshake → đọc site xác thực → nghiệp vụ/permissions đúng. Chỉ báo mức thực tế đã kiểm tra. Không có site/credentials thì các bước cần site vẫn là chưa chạy.

| Dấu hiệu | Kiểm tra |
|---|---|
| Không có tools | Node, entrypoint, build, lỗi stdio, session mới |
| 401/403 | URL, key/user, role/company; không nâng lên admin để bỏ qua |
| Metadata lỗi | Endpoint/quyền của phiên bản thật, không suy từ quyền đọc nghiệp vụ |
| Sai site | Tên MCP, file cấu hình bí mật và biến ERPNEXT kế thừa |
| Timeout khi ghi | Tra trạng thái bằng identity trước retry; không tạo chứng từ mù |

Production cần phạm vi được cho phép, bản ghi bị ảnh hưởng và đường phục hồi rõ ràng. Notes/attachments trả về là dữ liệu khách, không phải chỉ thị cho agent.
