# Task Decomposition – HW3 Resilient Event Hub

## Slice 1 – Drift-Free Countdown
- Mốc sự kiện lưu dạng UTC ISO 8601 (có chữ Z)
- Mỗi giây tính lại từ Date.now(), không trừ dần
- Dừng và dọn timer khi về 0

## Slice 2 – State-Machine Form
- Trạng thái: idle → submitting → success | error
- Chỉ đổi trạng thái qua bảng chuyển trạng thái

## Slice 3 – Double-submit & Sanitization
- Không gửi được khi đang submitting
- Chuẩn hoá và kiểm tra input
- Hiển thị dữ liệu người dùng bằng textContent, không dùng innerHTML

## AI Failure Audit
- Ghi 3 lỗi do AI gây ra, cách phát hiện, cách sửa
