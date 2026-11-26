# HW2 · Bộ thẻ vuốt, frontend

Chạy riêng bằng Node.js 22.12 trở lên.

~~~powershell
npm ci
npm run dev
~~~

Mở [http://localhost:4172](http://localhost:4172). Hồ sơ mẫu có sẵn và lịch sử lưu trong trình duyệt. Thử vuốt bằng cảm ứng, chuột, phím trái/phải/lên hoặc các nút. Backspace hoàn tác lượt cuối khi focus đang ở bộ thẻ.

Để thử MongoDB, chạy HW3 trên cổng 4173 trước. Dừng dev server của HW2 rồi dùng npm run dev:api. Nếu HW3 dùng cổng khác, đặt SWIPE_API_TARGET trong .env. Chế độ API có phiên riêng và lấy hồ sơ, lượt vuốt và hoàn tác từ HW3. Có thể dùng npm run build:api rồi npm run preview:api để thử bản build của chế độ này.

npm test kiểm tra hướng vuốt và điểm. npm run build tạo bản frontend chạy riêng.
