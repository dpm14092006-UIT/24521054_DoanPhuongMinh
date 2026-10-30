import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../services/pubgTelemetry.js';

export function PubgMatchTelemetry({ squadId = 'te' }) {
  const [view, setView] = useState({
    status: squadId ? 'LOADING' : 'IDLE',
    data: null,
    error: null,
    squadId,
  });

  useEffect(() => {
    if (!squadId) return undefined;

    const controller = new AbortController();
    let active = true;

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((payload) => {
        if (!active || controller.signal.aborted) return;
        setView({ status: 'SUCCESS', data: payload, error: null, squadId });
      })
      .catch((error) => {
        if (!active || error.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: error.message, squadId });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [squadId]);

  const status = !squadId
    ? 'IDLE'
    : view.squadId === squadId
      ? view.status
      : 'LOADING';

  if (status === 'IDLE') {
    return (
      <section className="telemetry-card" aria-label="Telemetry status">
        <p>Radar ready. Waiting for satellite connection.</p>
      </section>
    );
  }

  if (status === 'LOADING') {
    return (
      <section className="telemetry-card" aria-busy="true">
        <p>Syncing KRAFTON Radar…</p>
      </section>
    );
  }

  if (status === 'ERROR') {
    return (
      <section className="telemetry-card error-card" role="alert">
        <h2>Blue-Zone Link Lost</h2>
        <p>{view.error}</p>
      </section>
    );
  }

  const squad = view.data;

  return (
    <article className="telemetry-card success-card" aria-live="polite">
      <header>
        <h2>{squad.name}</h2>
        <p>{squad.map} · {squad.phase}</p>
      </header>

      <dl className="telemetry-stats">
        <div>
          <dt>Alive</dt>
          <dd>{squad.alive}</dd>
        </div>
        <div>
          <dt>Kills</dt>
          <dd>{squad.kills}</dd>
        </div>
        <div>
          <dt>WWCD</dt>
          <dd>{squad.wwcdProb}</dd>
        </div>
      </dl>

      <p className="squad-status">{squad.status}</p>
    </article>
  );
}
