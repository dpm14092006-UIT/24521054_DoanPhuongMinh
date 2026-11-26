# UIT–S3T Lab 4

## Chạy bốn Homework

Mở PowerShell tại thư mục gốc của repository và dùng Node.js 22.12 trở lên.

```powershell
cd "lab 4"
npm ci
npm run dev
```

Mở [http://localhost:4174](http://localhost:4174). Lần đầu chạy trên Windows, chế độ local có thể tải gói MongoDB khoảng 600 MB. Lượt vuốt, đơn kháng nghị và hạn SLA được lưu trong `.data/mongo`. Những lần sau dùng lại bản MongoDB đã tải. Dừng bằng Ctrl+C.

Để kiểm tra bản build, dừng server đang chạy rồi dùng `npm run build` và `npm run demo`. Nếu đã có MongoDB, sao chép `.env.example` thành `.env`, điền `MONGODB_URI` và chạy `npm run build`, sau đó `npm start`. Có thể đổi cổng trong `.env`.

## Nội dung theo slide

Số dưới đây là **thứ tự trang trong file PowerPoint**. Từ trang 22, số ghi trong một số tiêu đề lớn hơn số trang thực tế một đơn vị.

| Bài | Đường dẫn | Nội dung đã làm |
| --- | --- | --- |
| [HW1](HW1/) | `/hw1`, `/hw1/gallery` | Bộ thẻ Hẹn hò nhưng không yêu và thư viện ảnh, vì trang 19–20 đều mang nhãn Homework 1. Vuốt bằng chuột, cảm ứng, bàn phím hoặc nút. Điểm tính từ lịch sử, lượt vuốt lưu vào MongoDB và có hoàn tác LIFO. |
| [HW2](HW2/) | `/hw2`, `/dossier/himass`, `/dossier/tanvuu` | Cổng kháng nghị theo tiêu đề trang 21. Có hai hồ sơ, biểu mẫu React Context, kiểm tra ngay khi nhập, đồng hồ SLA và danh sách đơn đã gửi. |
| [HW3](HW3/) | `/hw3`, `/hw3/dossier` | Thư viện ảnh theo hợp đồng code ở trang 29. Giữ cổng hồ sơ vì chân trang 21 cũng ghi Homework 03. |
| [HW4](HW4/) | `/hw4`, `/hw4/dossier/himass`, `/hw4/dossier/tanvuu` | Bộ thẻ full-stack theo trang 30–31, cùng hồ sơ và ma trận so sánh mức án theo trang 32. |

Bài 1 và 4 dùng chung logic bộ thẻ, với lịch sử riêng cho từng bài. Bài 2, 3 và 4 dùng chung form và đồng hồ, với đơn kháng nghị riêng cho từng bài và từng hồ sơ.

Mỗi biểu mẫu có sẵn sáu trường mẫu gồm họ tên, email, đội, lý do, nội dung và liên kết ảnh minh họa. Chọn một hồ sơ, chỉnh dữ liệu nếu cần rồi bấm **Gửi kháng nghị**. Hồ sơ và mức án là tình huống mô phỏng. Mốc SLA được tạo khi mở hồ sơ lần đầu. Quy tắc điểm theo ví dụ trong slide là **Thích +10**, **Bỏ qua −5** và **Làm bạn −5**.

Thử mở thẳng [ảnh minh chứng](http://localhost:4174/hw3?category=evidence&photoId=coding). Modal hỗ trợ phím mũi tên để xem ảnh khác và Escape để đóng, đồng thời giữ danh mục đang lọc. Tác giả và nguồn được ghi trong từng ảnh.

## Kiểm tra và tài liệu

- `npm test` chạy sáu kiểm thử cho dữ liệu mẫu, lỗi biểu mẫu, SLA, ma trận, bộ thẻ và bộ lọc ảnh.
- [project-rules.md](project-rules.md) ghi hợp đồng dữ liệu và API.
- [TASK_DECOMPOSITION.md](TASK_DECOMPOSITION.md) ghi phạm vi theo từng bước.
- [AI_FAILURE_AUDIT.md](AI_FAILURE_AUDIT.md) ghi các vấn đề đã gặp và kết quả kiểm tra.
