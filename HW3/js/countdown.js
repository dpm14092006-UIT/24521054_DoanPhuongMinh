export function startCountdown(el) {
  let seconds = Math.floor((new Date('2026-12-05 19:00') - new Date()) / 1000);
  setInterval(() => {
    seconds--;
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    el.querySelector('[data-unit="days"]').textContent = d;
    el.querySelector('[data-unit="hours"]').textContent = h;
    el.querySelector('[data-unit="minutes"]').textContent = m;
    el.querySelector('[data-unit="seconds"]').textContent = s;
  }, 1000);
}
