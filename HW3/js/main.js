import { startCountdown } from './countdown.js';
import { initForm } from './form.js';

const eventSection = document.getElementById('event');
const targetISO = eventSection.dataset.target;

// Hiển thị giờ sự kiện theo múi giờ của người xem
document.getElementById('event-time').textContent =
  new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'short' })
    .format(new Date(targetISO));

startCountdown(eventSection, targetISO, () => {
  document.getElementById('cd-done').hidden = false;
});

initForm(document.getElementById('signup'));
