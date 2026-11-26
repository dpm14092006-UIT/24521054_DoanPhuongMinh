import { useEffect, useState } from 'react';
import { api } from '../shared/api.js';
import { timeLeft } from '../shared/appeal.js';

export function useAppealSlaTimer(deadline, initialOffset) {
  const [now, setNow] = useState(() => Date.now() + initialOffset);

  useEffect(() => {
    let offset = initialOffset;
    let interval;
    let request;

    function tick() {
      setNow(Date.now() + offset);
    }

    function startTicks() {
      clearInterval(interval);
      tick();
      interval = setInterval(tick, 250);
    }

    async function resync() {
      clearInterval(interval);
      request?.abort();
      if (document.visibilityState !== 'visible') return;

      startTicks();
      const controller = new AbortController();
      request = controller;
      const startedAt = Date.now();
      try {
        const { serverNow } = await api('/api/appeal-clock', { signal: controller.signal });
        if (!controller.signal.aborted) {
          offset = serverNow - (startedAt + Date.now()) / 2;
          tick();
        }
      } catch {
        // The last known offset still yields a countdown based on the absolute deadline.
      }
    }

    startTicks();
    document.addEventListener('visibilitychange', resync);
    return () => {
      clearInterval(interval);
      request?.abort();
      document.removeEventListener('visibilitychange', resync);
    };
  }, [initialOffset]);

  return timeLeft(deadline, now);
}
