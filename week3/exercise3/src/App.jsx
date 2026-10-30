import { useState } from 'react';
import './App.css';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import { PUBG_VN_SQUADS } from './data/squads.js';

function App() {
  const [squadId, setSquadId] = useState('te');

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand" href="#main-content" aria-label="KRAFTON PVS home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span className="brand-copy">
            <strong>KRAFTON <span>/</span> PVS</strong>
            <small>Vietnam Series</small>
          </span>
        </a>
        <p className="simulation-badge"><span aria-hidden="true" /> Simulation</p>
      </header>

      <section className="page-heading" id="main-content" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Match center <span>·</span> Vietnam</p>
          <h1 id="page-title">PUBG Live Telemetry</h1>
          <p className="page-description">
            Theo dõi trạng thái trận đấu mô phỏng của các đội tuyển Việt Nam.
          </p>
        </div>
        <p className="preview-label">Preview mode</p>
      </section>

      <section className="squad-section" aria-labelledby="squad-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Squad selection</p>
            <h2 id="squad-title">Chọn đội tuyển</h2>
          </div>
          <span className="section-meta">03 squads</span>
        </div>

        <div className="squad-list">
          {PUBG_VN_SQUADS.map((squad, index) => (
            <button
              key={squad.id}
              className="squad-option"
              type="button"
              aria-pressed={squadId === squad.id}
              onClick={() => setSquadId(squad.id)}
            >
              <span className="squad-index">0{index + 1}</span>
              <span className="squad-option-copy">
                <strong>{squad.code}</strong>
                <small>{squad.name}</small>
              </span>
              <span className="squad-map">{squad.map}</span>
              <span className="squad-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="telemetry-section" aria-labelledby="telemetry-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live feed</p>
            <h2 id="telemetry-title">Match telemetry</h2>
          </div>
          <span className="feed-indicator"><span aria-hidden="true" /> Mock API</span>
        </div>

        <PubgMatchTelemetry key={squadId} squadId={squadId} />
      </section>

      <footer className="app-footer">
        <p>Dữ liệu giả lập cho mục đích học tập · Không phải telemetry trực tiếp từ KRAFTON.</p>
        <span>API latency 1.8–3.2s</span>
      </footer>
    </main>
  );
}

export default App;
