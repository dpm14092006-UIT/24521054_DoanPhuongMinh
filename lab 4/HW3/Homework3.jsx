import { NavLink, Outlet } from 'react-router';

export default function Homework3() {
  return (
    <>
      <h1>Homework 3</h1>
      <nav className="section-nav" aria-label="Nội dung Homework 3">
        <NavLink to="/hw3" end>Thư viện ảnh</NavLink>
        <NavLink to="/hw3/dossier">Hồ sơ kháng nghị</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
