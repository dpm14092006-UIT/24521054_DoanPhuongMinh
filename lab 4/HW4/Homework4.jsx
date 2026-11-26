import { NavLink, Outlet } from 'react-router';

export default function Homework4() {
  return (
    <>
      <h1>Homework 4</h1>
      <nav className="section-nav" aria-label="Nội dung Homework 4">
        <NavLink to="/hw4" end>Bộ thẻ vuốt</NavLink>
        <NavLink to="/hw4/dossier">Hồ sơ và bảng so sánh</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
