# HW4 · Esports Fair-Play Appeal Tribunal

Chạy trong thư mục này với Node.js 22.12 trở lên.

~~~powershell
npm ci
npm run dev
~~~

Mở [Himass](http://localhost:4174/dossier/himass) hoặc [TanVuu](http://localhost:4174/dossier/tanvuu). Cả sáu trường đã có dữ liệu mẫu. Liên kết bằng chứng mở trang tài liệu mô phỏng của chính hồ sơ. Bấm **Gửi kháng nghị** và tải lại để kiểm tra đơn đã lưu. Dữ liệu hồ sơ, bằng chứng và án đều là mô phỏng.

Chế độ dev tự chạy MongoDB local và lưu dữ liệu trong .data/mongo. Lần đầu trên Windows có thể phải tải khoảng 600 MB. Để thử bản build, dừng dev rồi chạy npm run build và npm run demo. Khi đã có MongoDB riêng, điền MONGODB_URI theo .env.example, build và chạy npm start.

- [Quy tắc dự án và hợp đồng API](project-rules.md)
- [Phân rã công việc](TASK_DECOMPOSITION.md)
- [Hậu kiểm kiến trúc và kiểm thử](AI_FAILURE_AUDIT.md)
