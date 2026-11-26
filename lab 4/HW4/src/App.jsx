import { Link, Route, Routes } from 'react-router';
import FairPlayAppealPortal, { DossierRoute, DossierStart } from './FairPlayAppealPortal.jsx';
import Evidence from './Evidence.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="site-header">
        <nav className="shell site-nav" aria-label="Điều hướng chính">
          <Link to="/dossier">HW4 · Fair-Play Appeal Tribunal</Link>
        </nav>
      </header>
      <main id="main" className="shell site-main" tabIndex={-1}>
        <h1>Cổng kháng nghị Esports</h1>
        <Routes>
          <Route element={<FairPlayAppealPortal />}>
            <Route index element={<DossierStart />} />
            <Route path="dossier">
              <Route index element={<DossierStart />} />
              <Route path=":playerID" element={<DossierRoute />} />
              <Route path=":playerID/evidence" element={<Evidence />} />
            </Route>
          </Route>
          <Route path="*" element={<p>Không tìm thấy trang. <Link to="/dossier">Về hồ sơ</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
