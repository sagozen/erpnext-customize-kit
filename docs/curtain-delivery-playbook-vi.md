# Từ yêu cầu khách ngành rèm đến ERPNext vận hành được

Một đơn rèm có ít nhất bốn con số khác nhau: kích thước ô cửa, kích thước rèm hoàn thiện, mét vải phải cắt và số lượng tính tiền. Nếu gom chúng vào một trường “số lượng”, báo giá có thể đúng nhưng kho và giá vốn sai.

## Giai đoạn 1: hiểu nghiệp vụ

Dùng `spec`. Xin khách một phiếu đo, một báo giá, công thức Excel và một đơn từng có phát sinh. Ẩn tên/số điện thoại/địa chỉ thật trước khi dùng làm mẫu chia sẻ.

Hỏi theo luồng làm việc: ai đo, ai duyệt số đo, bán theo đơn vị nào, tính vải ra sao, tự may hay thuê ngoài, thu cọc lúc nào, giao/lắp từng phần được không, đo sai thì ai chịu chi phí. Mỗi câu hỏi cần giải thích tác động: ví dụ may nội bộ có nhu cầu theo dõi vật tư/công đoạn khác mua thành phẩm.

Đầu ra: quy trình hiện tại, quy trình mong muốn, thuật ngữ, yêu cầu kiểm chứng được và các điều chưa chốt. “Quản lý rèm” quá rộng; “sửa số đo sau khi khách duyệt phải tạo revision và không sửa báo giá cũ” có thể kiểm thử.

## Giai đoạn 2: chọn mức custom

Dùng `design`, đối chiếu site thật. Bảng dưới là phương án để đánh giá, không phải kết luận cho mọi khách:

| Cách làm | Phù hợp khi | Đánh đổi |
|---|---|---|
| Chức năng chuẩn + quy trình thao tác | Ít mẫu, người làm kiểm tra thủ công được | Nhanh thử, ít code; phụ thuộc kỷ luật nhập liệu |
| Custom fields/workflow/print format được export | Cần thêm số đo, trạng thái, biểu mẫu nhưng logic còn đơn giản | Dễ tiếp cận; phải quản lý source và đồng bộ cấu hình |
| App `sankaku_erp` | Tính vải/giá có quy tắc, nhiều revision, phân quyền hoặc liên kết nghiệp vụ | Có tests và ownership rõ; tốn thiết kế, nâng cấp, bảo trì |

Khuyến nghị khởi đầu: chứng minh luồng chuẩn trên một đơn, rồi viết app cho phần thiếu có bằng chứng. Không bỏ yêu cầu khách chỉ vì triển khai khó. Không fork core ERPNext để thêm vài trường nếu extension giải quyết được.

Item là danh mục hàng/vật tư; Variant là biến thể dùng lại; BOM là định mức vật tư cho sản xuất. Không mặc định tạo một Item mới cho mọi tổ hợp rộng/cao. So sánh mô hình cấu hình theo đơn với Item/BOM theo đơn dựa vào cách chạy sản xuất và báo cáo của khách.

## Giai đoạn 3: làm một đơn xuyên suốt

Dùng `plan`, rồi `code` trong dev site. Một lát cắt hữu ích gồm: phiếu đo đã duyệt → kết quả vật tư có thể giải thích → Quotation → Sales Order → đường mua/may đã chọn → giao/lắp → thu tiền theo chính sách được xác nhận.

Quotation là báo giá; Sales Order là đơn bán đã chốt; Delivery Note ghi giao hàng; Sales Invoice ghi khoản phải thu theo chính sách kế toán. Submit không phải nút “lưu đẹp hơn”: nó có thể làm phát sinh tác động nghiệp vụ. Accountant của khách xác nhận cách hạch toán, thuế và hóa đơn điện tử; không tự hứa ERPNext đáp ứng mọi quy định Việt Nam.

Thực hiện theo từng phần nhưng giữ mục tiêu đầy đủ. Logic quan trọng kiểm tra ở server. Những gì cấu hình bằng Desk phải export/ghi source. Ghi version công thức và snapshot đầu vào để giá mới không làm đổi báo giá cũ.

Ví dụ tính vải trong [domain reference](../skill/reference/curtain-domain.md) chỉ minh họa. Workshop phải xác nhận khổ hữu dụng, hướng vải, độ nhún, chia cánh, biên may và bước hoa văn trước khi dùng cho đơn thật.

## Giai đoạn 4: chuyển dữ liệu

Chốt dữ liệu nào cần chuyển: danh mục, khách/nhà cung cấp, đơn đang mở, tồn kho, công nợ và cọc. Không nhất thiết chuyển toàn bộ lịch sử nhưng phải là quyết định được khách chấp nhận, có nơi lưu tra cứu.

Lấy template Data Import từ site đúng phiên bản. Map field/unit, xử lý trùng và lỗi liên kết, chạy thử trên staging. Lần nhập lại không được sinh thêm bản ghi. Đối soát số dòng, tồn theo kho, giá trị tồn, phải thu/phải trả và tiền ứng trước. Không nhập vừa lịch sử đầy đủ vừa số dư đầu kỳ tương ứng gây nhân đôi.

Phân biệt data import với `bench migrate`: một việc nhập dữ liệu nghiệp vụ, một việc cập nhật cấu trúc/patch của app. Xem [migration reference](../skill/reference/migration.md).

## Giai đoạn 5: demo và nghiệm thu

Dùng `docs` để tạo script, `test` để chạy UAT. UAT là khách tự xác nhận hệ thống làm đúng công việc, không chỉ dev thấy test xanh.

Demo khoảng 20 phút là gợi ý tổ chức: giải thích bài toán; đo/báo giá một cửa; chốt đơn; đường vật tư/lắp đặt; xem số còn phải thu; thử một ngoại lệ. Cho khách thấy màn hình theo vai trò, không chỉ Administrator. Phân biệt chức năng có sẵn, custom đã chạy, bước thủ công và phần chưa làm.

Tối thiểu thử một đơn bình thường, đo lại sau duyệt, giao/thu tiền từng phần, thiếu vật tư, hủy/trả, truy cập bị cấm và bản ghi nhập lại. Dùng số kỳ vọng do khách/worksheet độc lập xác nhận.

## Giai đoạn 6: bàn giao và vận hành

Dùng `release staging` để diễn tập trước production. Có backup chưa đủ: phải restore thành công trên site riêng, đo thời gian phục hồi và kiểm tra dữ liệu/file. Giữ database, files, cấu hình mã hóa cần thiết và code version phù hợp cùng nhau ở nơi an toàn.

Chốt RPO (chấp nhận mất tối đa bao nhiêu dữ liệu) và RTO (ngừng hoạt động tối đa bao lâu). Không hứa số cụ thể khi chưa đo. Khi đổi schema, quay Git về commit cũ không phục hồi database.

Bàn giao: hướng dẫn từng vai trò, sửa sai thế nào, ai giữ master data, ai cấp/thu hồi quyền, lịch backup/kiểm tra restore, quy trình nâng cấp staging trước, liên hệ hỗ trợ và chi phí bảo trì. Với công ty một người, khách cần biết ai thay bạn khi vắng mặt.

## Khi chuyển sang ngành khác

Giữ quy trình ERPNext chung. Thay glossary, quy trình, đơn vị, công thức, role và UAT trong một domain contract mới; không đổi mọi file bằng tìm/thay chữ “rèm”. Theo [domain adaptation](../skill/reference/domain-adaptation.md). Đổi hướng dẫn agent không tự migrate dữ liệu khách cũ.
