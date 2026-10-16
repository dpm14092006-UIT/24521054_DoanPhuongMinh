// Đếm ngược dựa trên mốc tuyệt đối: mỗi lần chạy đều TÍNH LẠI từ Date.now(),
// nên dù timer bị trễ cũng không bao giờ trôi.
export function startCountdown(el, targetISO, onDone) {
  const target = Date.parse(targetISO);            // ISO có 'Z' → UTC, mọi máy như nhau
  if (Number.isNaN(target)) throw new Error(`Mốc thời gian không hợp lệ: ${targetISO}`);

  const units = {
    days: el.querySelector('[data-unit="days"]'),
    hours: el.querySelector('[data-unit="hours"]'),
    minutes: el.querySelector('[data-unit="minutes"]'),
    seconds: el.querySelector('[data-unit="seconds"]'),
  };
  let timerId = null;

  function render(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));   // không bao giờ âm
    const pad = (n) => String(n).padStart(2, '0');
    units.days.textContent = pad(Math.floor(total / 86400));
    units.hours.textContent = pad(Math.floor((total % 86400) / 3600));
    units.minutes.textContent = pad(Math.floor((total % 3600) / 60));
    units.seconds.textContent = pad(total % 60);
  }

  function tick() {
    const remaining = target - Date.now();
    render(remaining);
    if (remaining <= 0) {                // về 0 → dừng hẳn, không hẹn lần sau
      timerId = null;
      if (onDone) onDone();
      return;
    }
    // Hẹn lần chạy kế tiếp đúng lúc sang giây mới
    timerId = setTimeout(tick, remaining % 1000 || 1000);
  }

  tick();
  return function stop() {               // cho phép dừng từ bên ngoài
    if (timerId !== null) clearTimeout(timerId);
    timerId = null;
  };
}
