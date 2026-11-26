import { NavLink, Outlet } from 'react-router';

export default function Homework1() {
  return (
    <>
      <h1>Homework 1</h1>
      <nav className="section-nav" aria-label="Nội dung Homework 1">
        <NavLink to="/hw1" end>Bộ thẻ vuốt</NavLink>
        <NavLink to="/hw1/gallery">Thư viện ảnh</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
