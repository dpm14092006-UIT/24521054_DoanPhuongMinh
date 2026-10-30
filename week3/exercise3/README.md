# KRAFTON PVS — PUBG Live Telemetry

Ứng dụng React + Vite mô phỏng telemetry cho ba đội tuyển PUBG Vietnam Series. Dữ liệu là mock, không kết nối API chính thức của KRAFTON.

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Vite cung cấp mock endpoint `GET /api/telemetry?squadId=ces|te|ge`. Mỗi request chờ 1,8–3,2 giây. Erangel và Miramar có xác suất packet loss 35% cho mỗi request; Taego không áp dụng lỗi ngẫu nhiên.

## Cấu trúc

- `src/data/squads.js`: dữ liệu CES, TE và GE.
- `src/services/pubgTelemetry.js`: gọi endpoint và chuyển HTTP error thành lỗi ứng dụng.
- `src/components/PubgMatchTelemetry.jsx`: state machine `IDLE → LOADING → SUCCESS | ERROR`; AbortController hủy request cũ khi đổi đội.
- `vite.config.js`: middleware mock API cho Vite dev và preview server.
- `src/App.jsx`: chọn đội và kết nối giao diện telemetry.

Đây là checkpoint nền tảng: giao diện hiển thị trạng thái tải, dữ liệu thành công và lỗi có thể truy cập. Skeleton và Retry được bổ sung ở checkpoint tiếp theo.
