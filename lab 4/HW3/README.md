# HW3 · Bộ thẻ vuốt, backend

API Express và MongoDB dùng Mongoose 8. Khởi chạy riêng bằng Node.js 22.12 trở lên.

~~~powershell
npm ci
npm run dev
~~~

Mở [http://localhost:4173](http://localhost:4173) để xem danh sách endpoint hoặc [mở dữ liệu hồ sơ](http://localhost:4173/api/profiles). Chế độ dev tự khởi chạy MongoDB local và lưu dữ liệu trong .data/mongo. Lần đầu trên Windows, bản MongoDB tải về khoảng 600 MB nếu chưa có trong cache. Nếu dùng MongoDB riêng, sao chép .env.example thành .env, điền URI và chạy npm start.

| Endpoint | Dữ liệu |
| --- | --- |
| GET /api/profiles | Danh sách năm hồ sơ mẫu đã seed |
| GET /api/swipes?sessionId=… | Lịch sử và revision của phiên UUID v4 |
| POST /api/swipe | sessionId, revision, profileId, direction (left, right, up) |
| POST /api/swipe/undo | sessionId, revision |

Lượt vuốt thành công trả 201. Phiên bản cũ hoặc thẻ không còn ở đầu hàng đợi trả 409. npm test chạy một MongoDB test tạm để xác minh luồng API. Để thử giao diện với API thật, mở HW2 ở chế độ npm run dev:api.
