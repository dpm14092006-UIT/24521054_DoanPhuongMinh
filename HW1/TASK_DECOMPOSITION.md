# Task Decomposition – HW1 Portfolio

## M1 – WCAG 2.2 AA audit
- Dùng thẻ ngữ nghĩa (header, nav, main, footer)
- Độ tương phản chữ ≥ 4.5:1
- Ảnh có alt, html có lang
Commit: fix(a11y): contrast & landmarks

## M2 – Focus trap audit
- Đi hết trang bằng Tab, không kẹt
- Viền focus nhìn thấy được
- Skip link, menu đóng bằng Esc
Commit: fix(nav): keyboard trap prevention

## M3 – Strict CSP
- Không có onclick inline, không có script/style inline
- Thêm Content-Security-Policy
Commit: fix(security): strict CSP & no inline handlers

## M4 – Lighthouse 100
- Ảnh WebP, có width/height
- Meta description, viewport
Commit: perf: optimize assets
