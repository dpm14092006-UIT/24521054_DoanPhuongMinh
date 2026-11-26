# Kiểm chứng và hậu kiểm Lab 4

## Vấn đề đã gặp

| Vấn đề | Cách kiểm tra và sửa |
| --- | --- |
| Nhãn Homework mâu thuẫn giữa tiêu đề, chân trang và hợp đồng code. | Đối chiếu thứ tự thật của các trang PowerPoint. Giữ thư viện ảnh và bộ thẻ trong HW1, giữ hồ sơ ở HW2 và HW3, rồi triển khai cả bộ thẻ và cổng hồ sơ có ma trận trong HW4. |
| Thư viện ban đầu đạt 99/100 Performance. | Báo cáo Lighthouse chỉ ra ảnh LCP xuất hiện sau khi JavaScript khởi tạo. Thêm preload cho ảnh đầu trang và render HTML thư viện trên Express ở bản production. Chạy lại cả Lighthouse và kiểm tra tương tác sau khi React gắn sự kiện. |
| Lần kiểm tra axe đầu tiên dừng trước khi quét trang. | Test dùng `browser.newPage()`, trong khi axe cần context mở được trang phụ. Chuyển sang `browser.newContext()` và tạo trang từ context, sau đó quét lại trang chính và modal. |

## Quyết định kiến trúc

- React Router v7 giữ danh mục và ảnh đang mở trong URL. Dialog dùng `showModal()` để giới hạn focus, sau khi đóng trả focus về ảnh đã mở hoặc bộ lọc nếu người dùng vào từ deep link.
- Form chỉ lưu giá trị đang nhập. Cả UI lẫn Express tính lỗi từ một hàm validation. Gửi lại mã yêu cầu với cùng dữ liệu trả về đơn đã lưu.
- Deadline được lưu trong MongoDB. Hook tính lại từ thời điểm tuyệt đối, còn sự kiện `visibilitychange` khởi động lại cập nhật và lấy lại giờ server.
- Lịch sử vuốt là dữ liệu lưu. Điểm và thẻ kế tiếp được tính từ lịch sử. Điều kiện `revision` trong lệnh cập nhật Mongoose xử lý hai yêu cầu ghi vào cùng một bộ thẻ.

## Kết quả đã đo

- `npm test` qua 6 kiểm thử. Bản build frontend và SSR chạy thành công.
- Chromium kiểm tra thao tác vuốt chuột và bàn phím, hoàn tác, dữ liệu sau khi tải lại, lỗi biểu mẫu, gửi đơn, đồng bộ SLA, deep link, bộ lọc, điều hướng trong modal và luồng HW4. Không có lỗi JavaScript trong các luồng này.
- Quét axe theo nhóm quy tắc WCAG 2.2 AA không phát hiện vi phạm ở thư viện, modal hoặc màn hình hồ sơ và ma trận HW4. Kiểm tra bàn phím xác nhận Tab trong modal, Escape và trả focus.
- Kiểm tra API với MongoDB xác nhận hai lệnh vuốt đồng thời chỉ ghi một thay đổi. Lệnh đến với phiên bản cũ trả 409. Hai lần gửi cùng mã và nội dung chỉ lưu một đơn, còn cùng mã với nội dung khác trả 409.
- Sau khi dừng bản production và chạy lại bằng `npm run dev`, lịch sử bộ thẻ, mã đơn đã gửi và deadline vẫn đọc lại được từ MongoDB.
- Lighthouse 13.6.0, chế độ mobile trên bản production tại `/hw3`, đo **100/100 Performance** và **100/100 Accessibility**, LCP khoảng **1,81 giây** và CLS bằng **0**. Kết quả khả năng tiếp cận ghi nhận phạm vi kiểm tra tự động và thao tác bàn phím ở trên.
