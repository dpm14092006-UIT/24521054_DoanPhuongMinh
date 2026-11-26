import { lazy, Suspense } from 'react';
import { Link, NavLink, Outlet, Route, Routes } from 'react-router';

const Homework1 = lazy(() => import('../HW1/Homework1.jsx'));

const homework = [
  { to: '/hw1', label: 'HW1', title: 'Hẹn hò nhưng không yêu' },
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
        <Route path="hw1" element={<Homework1 />} />
        <Route path="*" element={<section><h1>Không tìm thấy trang</h1><Link to="/">Về danh sách bài tập</Link></section>} />
      </Route>
    </Routes>
  );
}
