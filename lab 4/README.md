# Lab 4 · Các project Homework

Mỗi thư mục có package.json, package-lock.json, lệnh chạy và hướng dẫn riêng. Chạy lệnh từ bên trong thư mục bài tương ứng với Node.js 22.12 trở lên.

| Project | Nội dung | Địa chỉ mặc định |
| --- | --- | --- |
| [HW1](HW1/) | Photo & Evidence Gallery | [localhost:4171/gallery](http://localhost:4171/gallery) |
| [HW2](HW2/) | Giao diện bộ thẻ Hẹn hò nhưng không yêu | [localhost:4172](http://localhost:4172) |
| [HW3](HW3/) | Express và MongoDB cho bộ thẻ | [localhost:4173](http://localhost:4173) |
| [HW4](HW4/) | Esports Fair-Play Appeal Tribunal | [localhost:4174/dossier](http://localhost:4174/dossier) |

~~~powershell
cd HW1
npm ci
npm run dev
~~~

Thay HW1 bằng thư mục bài cần chạy. HW2 chạy với hồ sơ và lịch sử cục bộ theo mặc định. Để thử lưu MongoDB, mở HW3 trong terminal riêng rồi chạy npm run dev:api trong HW2. HW4 có API và database của riêng bài.

Cách chia theo mục VIII của hướng dẫn đính kèm là **ba ứng dụng, bốn phần triển khai**. HW2 và HW3 là hai phần của cùng đề tài bộ thẻ. Slide đặt nhãn không nhất quán, nên số thư mục dùng để tổ chức bài theo nội dung.

## Kiểm tra sau khi tách

Cả bốn project chạy được bằng lệnh riêng và tổng cộng tám kiểm thử Node đã qua. Chromium xác nhận HW2 lưu cục bộ khi chạy riêng. Ở chế độ API, HW2 lưu lượt vuốt qua HW3 vào MongoDB, giữ lịch sử sau khi tải lại và đồng bộ hoàn tác. HW4 gửi đơn và mở bằng chứng trên cùng cổng của bài.

Lighthouse mobile trên bản production của HW1 tại /gallery đo được 100/100 Performance và 100/100 Accessibility, LCP khoảng 1,73 giây và CLS bằng 0. Quét axe và thử bàn phím cũng đã chạy trên gallery và lightbox.
