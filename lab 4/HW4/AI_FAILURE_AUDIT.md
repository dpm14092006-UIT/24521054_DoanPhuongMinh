# Kiểm chứng và hậu kiểm · HW4

## Các vấn đề đã sửa

| Điều quan sát được | Nguyên nhân và cách sửa | Kiểm chứng |
| --- | --- | --- |
| Bản đầu có một npm project và một trang điều hướng qua bốn mục. Cổng kháng nghị cần chạy trong app Lab 4 chung. | Các chức năng chỉ tách theo route, dùng chung entry point và server. Tách HW4 thành project riêng với package, React Router, API Express và database riêng. | Chạy npm run dev trong HW4. Truy cập thẳng /dossier/himass hoặc /dossier/tanvuu mà không cần server của bài khác. |
| Liên kết minh họa đi tới thư viện ảnh trong dự án chung. Sau khi tách, đường dẫn cũ không còn thuộc HW4. | Thay liên kết mẫu bằng route /dossier/:playerID/evidence trong chính HW4. | Kiểm tra cả sáu trường có sẵn dữ liệu. Mở liên kết mẫu, xem đúng mã hồ sơ rồi quay về biểu mẫu. |

## Kiểm tra đã chạy

- Kiểm thử Node cho dữ liệu mẫu, URL, lỗi trường, công thức thời gian tuyệt đối và ma trận so sánh.
- Chromium mở hai hồ sơ, kiểm tra 404, gửi đơn hợp lệ, đọc lại đơn sau khi reload và bắt request đồng bộ SLA khi tab hiện trở lại.
- API trả lỗi cho sáu trường thiếu. Gửi lại cùng mã và dữ liệu trả đúng đơn đã lưu. Cùng mã với dữ liệu khác trả 409.
- Quét axe trên màn hình hồ sơ, form và ma trận không thấy vi phạm trong các quy tắc WCAG được quét.
