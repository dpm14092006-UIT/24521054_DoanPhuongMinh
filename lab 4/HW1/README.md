# HW1 · Photo & Evidence Gallery

Chạy trong thư mục này với Node.js 22.12 trở lên.

~~~powershell
npm ci
npm run dev
~~~

Mở [http://localhost:4171/gallery](http://localhost:4171/gallery). Thử [mở ảnh qua URL](http://localhost:4171/gallery?category=evidence&photoId=coding), đổi bộ lọc, dùng phím mũi tên để đổi ảnh và Escape để đóng. Ảnh WebP và nguồn ảnh nằm trong project này.

Để đo Lighthouse, dừng dev server rồi chạy npm run build và npm run preview. Bản preview kết xuất HTML thư viện ở server và dùng cùng URL. npm test kiểm tra bộ lọc.
