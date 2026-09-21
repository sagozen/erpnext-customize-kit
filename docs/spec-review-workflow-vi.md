# Giao việc và review cho người triển khai một mình

Bạn giữ ba việc: chốt bài toán với khách, chọn người xử lý rủi ro khó và quyết định nhận bàn giao dựa trên bằng chứng. Claude/Codex giúp đọc, viết, kiểm tra; chuyên gia chịu trách nhiệm phần được giao. Có nhiều agent không làm giảm số quyết định nghiệp vụ bạn phải quản lý.

Khởi đầu với **một phần nghiệp vụ đang làm**, hoàn tất review rồi nhận phần tiếp theo. Khi đã rõ đầu vào/đầu ra và người sở hữu, có thể giao song song. Đừng để nhiều người cùng sửa schema, fixtures hoặc thứ tự migration. Đây là gợi ý giảm việc dang dở, không phải giới hạn cứng về số dev hay công cụ.

## Chỉ cần những gì để quyết định và kiểm chứng

| Giữ lại | Dùng trong kit |
|---|---|
| Spec ngắn, quy tắc và tiêu chí nghiệm thu rõ | `spec`, kiểm tra lại bằng `review` |
| Kiểm tra luồng thiếu, ngoại lệ và quyền | `review` trước khi giao việc và trước khi nhận code |
| Đối chiếu spec với code và các điểm nối | `review`, có nguồn hai phía và phân biệt chưa tìm thấy với chưa đủ bằng chứng |
| Task có phạm vi, giao diện và bằng chứng bàn giao | `plan`, thực hiện bằng `code` kèm tests |
| Đánh giá thay đổi so với điều đã chốt | `review` đề xuất thay đổi; `spec` cập nhật khi được chốt |

Không cài thêm skill BA, hooks, hệ thống knowledge graph hay công cụ điều phối model. Không bắt buộc viết BRD → PRD → SRS → user story cho cùng một việc. Chín lệnh cũ vẫn dùng được; thường ngày chỉ cần `spec → plan → code → review`. `design`, `test`, `docs`, `release` phục vụ quyết định hoặc bước bàn giao tương ứng.

Một feature là một phần nghiệp vụ có kết quả có thể kiểm tra, ví dụ “đo lại nhưng giữ nguyên báo giá khách đã duyệt”. Một **baseline** là phiên bản spec đã được người có thẩm quyền chốt, dùng làm mốc so sánh. **AC** là tiêu chí nghiệm thu: kết quả khách quan sát được để biết đã làm đúng. AC không thay cho toàn bộ test kỹ thuật.

## 1. Chốt một spec đủ giao việc

Dùng file yêu cầu hiện có. Nếu chưa có cấu trúc, đặt tại `docs/erpnext/features/<ten-nghiep-vu>.md`. Mẫu dưới đây là các mục trong **một file**, không phải mỗi mục một tài liệu:

```text
Tên / outcome: Ai làm được việc gì, vì sao khách cần?
Nguồn: Yêu cầu, mẫu đo/báo giá đã ẩn thông tin riêng tư.
Baseline: revision + link quyết định/người chốt; chưa chốt ghi draft.
Phạm vi / không thuộc phạm vi:
Quy tắc: ID, người thực hiện, điều kiện/trạng thái, input/đơn vị,
         kết quả, quyền và ngoại lệ liên quan.
AC: ID → quy tắc → tình huống → kết quả quan sát được.
Vận hành khi liên quan: lượng dữ liệu/người dùng đồng thời, thời gian chờ
hoặc khung chạy tác vụ, điều kiện đo, ngưỡng khách chốt và cách kiểm.
Chưa có ngưỡng: ghi người cần quyết; không tự đặt số.
ERPNext: phần chuẩn / config / app; bằng chứng phiên bản; lựa chọn/đánh đổi.
Còn thiếu: câu hỏi, người quyết, phần việc bị ảnh hưởng.
Thay đổi: chỉ thêm mục trước/sau khi có thay đổi thực sự.
```

Ví dụ sau **chỉ để học cách viết**. Không phải chính sách đã được khách duyệt:

| ID | Quy tắc/tiêu chí minh họa |
|---|---|
| RULE-01 | Khi đo lại sau khi khách đã chấp nhận báo giá, giữ nguyên số đo và giá của báo giá đó; bản đo mới lưu liên kết về bản trước |
| RULE-02 | Chỉ vai trò được khách chỉ định mới được duyệt bản đo mới; API và UI cùng tuân thủ |
| AC-01 → RULE-01 | Báo giá Q1 tham chiếu bản đo M1; tạo M2 với rộng 2,6 m thay vì 2,4 m thì Q1 vẫn hiện số liệu M1 và giá cũ |
| AC-02 → RULE-02 | Người không có quyền thử duyệt qua API: yêu cầu bị từ chối, không đổi trạng thái/bản ghi |
| AC-03 → RULE-01 | Bản đo M2 truy ra được M1 và người tạo; không mất lịch sử sau khi tải lại |

Phải hỏi thêm: ai được duyệt, “khách chấp nhận” được ghi nhận ở đâu, đang may rồi thì xử lý đo lại thế nào? Chỉ giữ phần phụ thuộc các câu hỏi này ở trạng thái chưa sẵn sàng. Không tự đồng nhất việc khách đồng ý với `docstatus = 1`.

Giữ nguyên ID khi sửa câu chữ; không đánh lại số toàn bộ. Gắn revision với Git commit hoặc phần lịch sử trước/sau có bằng chứng quyết định. Chỉ ghi “v1 đã duyệt” trong file chưa đủ nếu không biết ai duyệt gì.

```text
/pankit spec Yêu cầu khách và file hiện có: [đường dẫn/nội dung].
Làm spec ngắn cho một phần nghiệp vụ; giải thích thuật ngữ cho tôi.
Có rule/AC ID, đơn vị, quyền, ngoại lệ, fit-gap ERPNext và điều chưa chốt.
Đọc tài liệu có sẵn trước khi hỏi. Không tạo bộ hồ sơ BA nhiều tầng.
```

## 2. Giao một task mà người nhận không cần nghe lại cả dự án

Task nằm trong plan/issue hiện có. Dùng mẫu trong [delivery contract](../skill/reference/delivery-contract.md). Trước khi giao, điền đường dẫn thật, phiên bản thật và người nhận thật.

Với ví dụ giữ lịch sử báo giá, có thể chia như sau sau khi quy tắc được chốt:

| Task | Người chịu trách nhiệm | Bàn giao / phụ thuộc |
|---|---|---|
| Xác minh mô hình revision trên version đang dùng | Bạn hoặc chuyên gia Frappe | Đọc schema/controllers; đề xuất model, trạng thái, API, quyền và files sở hữu; giải thích standard/custom |
| Lưu snapshot và tạo revision theo contract đã chọn | Một chuyên gia Frappe | Code/config/patch nếu cần, tests AC-01/03 và hồi quy; phụ thuộc model đã chốt |
| Kiểm tra quyền và nhận bàn giao | Bạn, nhờ chuyên gia quyền khi cần | AC-02 bằng role thật, review diff/lifecycle/migration và log kết quả; phụ thuộc implementation |

Nếu đã biết mô hình và thay đổi nhỏ, gộp hai task đầu. Không tách thêm người chỉ vì có thể chạy thêm agent. Muốn song song phần biểu mẫu, chốt trước các trường và đơn vị mà biểu mẫu sử dụng.

```text
/pankit plan [feature spec @ revision đã chốt]
Chia task để tôi giao chuyên gia. Mỗi task có outcome, người làm,
người review, người tích hợp, trạng thái, việc tiếp theo và mốc kiểm tra đã thống nhất,
file/module được sửa, interface/đơn vị/quyền, dependency, AC,
đầu ra, cách kiểm chứng và gói bàn giao. Ghi người chưa phân công.
Ước lượng theo khoảng và nêu bất định; chưa rõ API thì tách việc xác minh.
Tôi giữ điều phối và review. Hạn chế việc dang dở; không tự gửi task.
```

Prompt gửi cho chuyên gia/agent trong repo app:

```text
/pankit code [đường dẫn plan, task cụ thể]
Đọc baseline và các file ghi trong task. Thực hiện đúng phạm vi sở hữu,
không ghi đè phần của người khác. Khi cần thay đổi interface hoặc nghiệp vụ,
nêu tác động trước; tiếp tục phần độc lập. Bàn giao diff/base/head,
bảng AC → code → tests → kết quả, môi trường, điều chưa kiểm và rollback.
```

Khi bị chặn, người nhận báo: đã thử gì và bằng chứng, ảnh hưởng, ai cần quyết, việc tiếp theo và phần vẫn làm được. Đổi nghiệp vụ/interface dùng phần delta của baseline trước khi sửa contract. Người tích hợp kiểm lại AC xuyên task trên bản đã ghép.

**Đủ để bắt đầu:** quyết định cần cho task đã chốt, interface rõ, có quyền/môi trường cần thiết. **Đủ để nhận code:** phần việc đã làm, có bằng chứng phù hợp, lỗi review đã xử lý. Ghi riêng UAT và triển khai còn thiếu; nhận code không đồng nghĩa khách đã nghiệm thu.

## 3. Review là điểm kiểm soát chính

Gửi cùng lúc spec/revision, diff hoặc commit, kết quả tests và các giới hạn đã biết. Reviewer đọc code thực tế, không chỉ lời tóm tắt của người làm. Với phần rủi ro cao, có thể dùng session Claude/Codex khác hoặc chuyên gia độc lập. Khác model không tự chứng minh kết luận đúng.

```text
/pankit review [spec/task/diff/đề xuất thay đổi]
Baseline: [file @ revision + quyết định]. Phạm vi diff: [base..head].
Bằng chứng: [tests, phiên bản/site, role, kết quả, phần chưa chạy].
Chỉ review, không sửa. Đối chiếu nghiệp vụ trước, rồi kỹ thuật ERPNext.
Mỗi lỗi cần vị trí, rule/AC, tình huống, hậu quả và cách kiểm chứng sửa lỗi.
Tách lỗi thật, thiếu bằng chứng, câu hỏi và gợi ý tùy chọn.
Kết luận đủ/chưa đủ cho bước nào; cho tôi phần tóm tắt để ra quyết định.
```

Bạn cần nhận một kết quả ngắn ở đầu, ví dụ **“Cần sửa trước khi merge: đo lại làm thay đổi báo giá cũ”**, rồi mới đến chi tiết. Các trạng thái:

| Kết luận | Ý nghĩa |
|---|---|
| Đủ cho bước đang xét | Bằng chứng đáp ứng bước cụ thể: giao task, merge hay chuẩn bị release |
| Cần sửa | Có sai lệch được chứng minh; trả một danh sách sửa gộp cho người làm |
| Cần quyết định/bằng chứng | Chưa có policy, môi trường hoặc kết quả để kết luận; chỉ rõ ai bổ sung gì |

Nếu vừa có lỗi vừa thiếu bằng chứng, kết luận cần sửa và vẫn ghi phần thiếu. Một người báo ba lỗi giống nhau hay ba agent báo cùng lỗi vẫn là một lỗi; mức nghiêm trọng dựa trên thiệt hại và khả năng xảy ra.

| AC | Code/cấu hình | Cách kiểm tra | Kết quả | Bằng chứng/giới hạn |
|---|---|---|---|---|
| AC-01 | File/line thật | M1 → Q1 → M2 → mở lại Q1 | Pass/fail/not-run | App commit, role/site, expected/actual |
| AC-02 | File/line thật | User thiếu quyền gọi API | Not-run nếu chưa có site | Không lấy unit test thay quyền thực tế |

Sửa theo một lượt góp ý đã gộp, rồi review phần bị ảnh hưởng. Nếu vẫn tranh luận cùng một rule, yêu cầu ví dụ tái hiện hoặc người sở hữu nghiệp vụ chốt; đừng chạy vòng sửa/review vô hạn. Chỉ đưa bạn những quyết định cần bạn xử lý, không chuyển toàn bộ log agent lên bạn.

## 4. Khi khách đổi yêu cầu

Ví dụ khách muốn “từ nay báo giá chưa chấp nhận tự tính lại theo bảng giá mới”. Đây là đề xuất đổi hành vi, cần làm rõ trạng thái nào được tính lại. Nếu baseline giữ nguyên báo giá đã chấp nhận mà code tự đổi giá, đó là lỗi, không phải yêu cầu mới.

Trong cùng feature/issue, ghi: **trước → sau → vì sao → rule/AC ảnh hưởng → code/dữ liệu/tests/task/vận hành → công sức/phục hồi → quyết định**. Với ví dụ trên cần xem cả báo giá đang mở, đơn đã chốt, lịch sử bảng giá, tests và hướng dẫn nhân viên. Chưa kết luận phải migrate khi chưa xem dữ liệu và thiết kế thật.

```text
/pankit review Đề xuất thay đổi: [nội dung khách].
So với [baseline], phân loại lỗi/làm rõ/thay đổi phạm vi bằng bằng chứng.
Nêu trước/sau, tác động tới chứng từ cũ, công thức, quyền, migration,
tests và chi phí vận hành. Đưa phương án và khuyến nghị. Chỉ phân tích.
```

Khi đã có quyết định, cập nhật spec và task/tests bị ảnh hưởng cùng đợt. Giữ lại bằng chứng cũ nhưng đánh dấu cần kiểm lại nếu rule thay đổi. Không xin duyệt lại từng file cho phần việc đã được cho phép; không dùng sự im lặng của khách làm chấp nhận.

Claude Code dùng `/pankit`, Codex dùng `$pankit`; các nội dung prompt giữ nguyên. Bước tiếp theo: chọn **một** yêu cầu khách đang vướng nhất, viết spec ngắn và chạy review trước khi giao task.

## Review sâu đúng chỗ, tránh tạo thêm việc

Một lỗi nhãn trên phiếu in thường cần kiểm tra nội dung hiển thị và ảnh hưởng liên quan. Đổi công thức, quyền duyệt hay revision cần lần theo server và các chứng từ sử dụng kết quả. Đụng kho, công nợ, migration hoặc ghi hàng loạt thì cần thêm bằng chứng site, đối soát và phục hồi phù hợp bước đang xét. Không yêu cầu diễn tập production chỉ để review bản spec nháp.

Reviewer cần phân biệt **code trông khớp** với **đã chạy thử đạt**. Hai cột riêng giúp bạn không nhận nhầm bằng chứng:

| Rule/AC | Spec mong đợi | Code/config thực tế | Đối chiếu | Test và độ mới | Việc tiếp theo |
|---|---|---|---|---|---|
| ID thật | File/section @ revision | File/line @ app revision hoặc cấu hình site | Khớp / khác / không thấy trong phạm vi đã kiểm / thêm hành vi / chưa đủ bằng chứng | Pass/fail/not-run; đã cũ nếu không còn áp dụng | Owner, việc cần làm và điều kiện kiểm lại |

Ví dụ minh họa về cách kết luận, không phải lỗi đã phát hiện trong app của bạn:

| Tình huống | Kết luận có căn cứ |
|---|---|
| Không thấy kiểm tra quyền trong app custom | Kiểm tra controller chuẩn, hook và cấu hình site trước; chưa truy cập được thì ghi chưa đủ bằng chứng, không kết luận hệ thống thiếu quyền |
| Spec tính mét nhưng phiếu đo gửi millimet | Kiểm tra nơi chuyển đổi và giá trị đầu vào/đầu ra; trích nguồn cả hai phía, dùng ví dụ 2.400 mm tương ứng 2,4 m |
| Form hiển thị số đo mới, báo giá cần bản đã duyệt | Kiểm tra ID revision truyền giữa hai nơi; từng màn hình đúng riêng lẻ chưa chứng minh liên kết đúng |
| Tests xanh trên commit trước khi sửa quy tắc nhún | Kết quả công thức cũ cần kiểm lại; tests không liên quan có thể giữ nếu giải thích được phạm vi |
| Code thêm kiểm tra dữ liệu đầu vào | Xác định có thay đổi hành vi đã cam kết không; không coi mọi helper/validation kỹ thuật là scope mới |

Trước khi kết luận “thiếu”, reviewer ghi đã tìm ở đâu và theo đường thực thi nào. Một screenshot không chứng minh API cũng kiểm tra quyền. Một bản báo cáo code sinh ra rồi tự đối chiếu với chính code đó không chứng minh khách muốn hành vi ấy.

Nếu nhận dự án cũ chưa có spec:

```text
/pankit spec Tiếp quản app tại [đường dẫn], chưa có spec đáng tin.
Ghi hành vi quan sát được kèm nguồn code/config/version, đánh dấu chưa xác nhận
ý định nghiệp vụ. Đối chiếu với mẫu đơn và quyết định khách đã có.
Tách điểm cần khách chốt; không lấy tài liệu sinh từ code làm bằng chứng
độc lập rằng code đáp ứng yêu cầu. Chỉ mô tả phần tôi cần tiếp quản.
```

Với quy tắc nhiều nhánh, thêm bảng ngay trong spec: **điều kiện → kết quả → ngoại lệ**. Với duyệt/hủy/đo lại: **ai → trạng thái trước → hành động → trạng thái sau → tác động/cách sửa sai**. Nếu vài câu đã đủ rõ thì không cần bảng hoặc sơ đồ.

Khi gửi review, ghi chính xác revision và cả diff chưa commit nếu có. Sau khi sửa, yêu cầu kiểm lại các finding và tests bị ảnh hưởng. Bản review cũ không tự áp dụng cho code mới. Bạn nhận một danh sách hành động có owner và điều kiện đóng, thay vì một đề nghị “cải thiện kiến trúc” không có điểm kết thúc.

## Chạy thử một lần giao việc

Chọn một phần nghiệp vụ đã chốt, ghi app/site/version, người nhận, reviewer và người tích hợp. Giao task cùng các liên kết cho người hoặc session chưa biết lịch sử chat. Chỉ thực hiện khi phạm vi và quyền truy cập đã rõ.

Kiểm tra họ có bắt đầu được, báo vướng đúng người, đề nghị đổi contract đúng cách và bàn giao bằng chứng tái kiểm được không. Trong task hiện có, ghi số lần hỏi lại do thiếu thông tin, lỗi interface, số lần trả lại vì thiếu bằng chứng và kết quả AC sau tích hợp. Sửa packet theo lỗi quan sát được trước khi mở rộng giao việc. Chưa chạy ghi **not-run**; khách nghiệm thu nghiệp vụ riêng.
