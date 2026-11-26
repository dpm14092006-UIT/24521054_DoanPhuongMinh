# Hợp đồng kỹ thuật Lab 4

- React 19 và React Router v7 dùng `Routes`, `Outlet`, `useParams` và `useSearchParams`. URL là nguồn trạng thái của bộ lọc và ảnh mở trong thư viện.
- React Context truyền giá trị trường và lỗi từ hàm validation đồng bộ. Express dùng cùng hàm để kiểm tra payload. `useId`, `aria-invalid` và `aria-describedby` liên kết nhãn, trường nhập và lỗi.
- Express và Mongoose 8 xử lý REST qua async/await. MongoDB nhận cấu hình từ `MONGODB_URI` hoặc từ phiên bản chạy local. Trình duyệt và API cùng origin.
- SLA lưu deadline tuyệt đối trong MongoDB. Trang tính thời gian từ deadline, bù chênh lệch đồng hồ qua API khi quay lại tab và dùng thời gian server để kiểm tra hạn lúc nhận đơn.
- Mỗi bộ thẻ có lịch sử theo phiên, theo bài và một số phiên bản tăng dần. Server xác nhận thẻ ở đầu hàng đợi, kiểm tra phiên bản trước khi ghi và hoàn tác phần tử cuối cùng.

## API

| Phương thức và URL | Hợp đồng |
| --- | --- |
| `GET /api/profiles` | Trả danh sách hồ sơ thẻ theo thứ tự. |
| `GET /api/swipe/:scope?sessionId=…` | Trả `history` và `revision` hiện tại. |
| `POST /api/swipe` | Nhận `scope`, `sessionId`, `revision`, `profileId`, `direction`. Trả 201 và trạng thái mới. |
| `POST /api/swipe/undo` | Nhận `scope`, `sessionId`, `revision`. Trả trạng thái sau khi hoàn tác. |
| `GET /api/dossiers/:scope/:playerId?sessionId=…` | Trả hồ sơ, deadline, thời gian server và đơn của phiên. Hồ sơ lạ trả 404. |
| `POST /api/dossiers/:scope/:playerId/appeals` | Nhận `sessionId`, `requestId` và `values` gồm sáu trường. Trả 201 khi lưu và 200 khi gửi lại đúng mã và payload. Lỗi trường trả 422. |
| `GET /api/appeal-clock` | Trả `serverNow` tính bằng millisecond. |
| `409 Conflict` | Báo phiên bản bộ thẻ cũ, mã yêu cầu bị dùng với dữ liệu khác hoặc kháng nghị quá hạn. |
