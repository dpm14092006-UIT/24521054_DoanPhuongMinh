import { lazy, Suspense } from 'react';
import { Link, NavLink, Outlet, Route, Routes } from 'react-router';

const Homework1 = lazy(() => import('../HW1/Homework1.jsx'));
const Homework2 = lazy(() => import('../HW2/Homework2.jsx'));
const Homework3 = lazy(() => import('../HW3/Homework3.jsx'));
const SwipeDeck = lazy(() => import('../HW1/SwipeDeck.jsx'));
const PhotoGallery = lazy(() => import('../HW3/PhotoGalleryLayout.jsx'));
const FairPlayAppealPortal = lazy(() => import('../HW2/FairPlayAppealPortal.jsx'));
const DossierRoute = lazy(() => import('../HW2/FairPlayAppealPortal.jsx').then(
  (module) => ({ default: module.DossierRoute }),
));
const DossierStart = lazy(() => import('../HW2/FairPlayAppealPortal.jsx').then(
  (module) => ({ default: module.DossierStart }),
));

const homework = [
  { to: '/hw1', label: 'HW1', title: 'Bộ thẻ vuốt và thư viện ảnh' },
  { to: '/hw2', label: 'HW2', title: 'Hồ sơ kháng nghị fair-play Esports' },
  { to: '/hw3', label: 'HW3', title: 'Thư viện ảnh và hồ sơ kháng nghị' },
];

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="site-header">
        <nav className="shell site-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>Lab 4</NavLink>
          {homework.map(({ to, label }) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
      </header>
      <main id="main" className="shell site-main" tabIndex={-1}>
        <Suspense fallback={<p role="status" className="route-loading">Đang tải bài tập…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}

function Home() {
  return (
    <>
      <h1>Lab 4 · UIT–S3T</h1>
      <ul className="homework-list">
        {homework.map(({ to, label, title }) => (
          <li key={to}><Link to={to}><strong>{label}</strong> {title}</Link></li>
        ))}
      </ul>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hw1" element={<Homework1 />}>
          <Route index element={<SwipeDeck scope="hw1" />} />
          <Route path="gallery" element={<PhotoGallery />} />
        </Route>
        <Route path="hw2" element={<Homework2 />}>
          <Route index element={<DossierStart />} />
        </Route>
        <Route path="dossier" element={<Homework2 />}>
          <Route index element={<DossierStart />} />
          <Route path=":playerID" element={<DossierRoute scope="hw2" />} />
        </Route>
        <Route path="hw3" element={<Homework3 />}>
          <Route index element={<PhotoGallery />} />
          <Route path="dossier" element={<FairPlayAppealPortal dossierPath="/hw3/dossier" />}>
            <Route index element={<DossierStart />} />
            <Route path=":playerID" element={<DossierRoute scope="hw3" />} />
          </Route>
        </Route>
        <Route path="*" element={<section><h1>Không tìm thấy trang</h1><Link to="/">Về danh sách bài tập</Link></section>} />
      </Route>
    </Routes>
  );
}
