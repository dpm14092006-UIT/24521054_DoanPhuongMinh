import { Link, Route, Routes } from 'react-router';
import PhotoGalleryLayout from './PhotoGalleryLayout.jsx';

export default function App() {
  const gallery = <PhotoGalleryLayout />;

  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="site-header">
        <nav className="shell site-nav" aria-label="Điều hướng chính">
          <Link to="/gallery">HW1 · Photo & Evidence Gallery</Link>
        </nav>
      </header>
      <main id="main" className="shell site-main" tabIndex={-1}>
        <h1>Thư viện ảnh Lab 4</h1>
        <Routes>
          <Route index element={gallery} />
          <Route path="gallery" element={gallery} />
          <Route path="*" element={<p>Không tìm thấy trang. <Link to="/gallery">Mở thư viện ảnh</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
