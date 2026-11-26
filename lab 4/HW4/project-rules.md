# Hợp đồng kỹ thuật · HW4

- React Router v7 khai báo route /dossier/:playerID. Hai hồ sơ hợp lệ là himass và tanvuu. Hồ sơ lạ hiển thị 404.
- React Context và Express cùng gọi validateAppeal. Lỗi truy cập được qua aria-invalid và aria-describedby.
- Mongoose 8 dùng async/await, lấy URI từ môi trường hoặc tiến trình MongoDB local. Trình duyệt và API cùng origin.
- SLA dùng deadline tuyệt đối. Hook lấy lại thời gian server khi tab hiện trở lại và dọn interval, request và listener khi unmount.

| API | Hợp đồng |
| --- | --- |
| GET /api/dossiers/:playerId?sessionId=… | Hồ sơ, deadline, giờ server và các đơn của phiên |
| POST /api/dossiers/:playerId/appeals | Nhận sessionId, requestId và values gồm sáu trường. Trả 201 khi tạo, 200 khi gửi lại đúng mã và nội dung, 422 khi sai trường và 409 khi hết hạn hoặc dùng lại mã với nội dung khác. |
| GET /api/appeal-clock | Thời gian server tính theo millisecond |
