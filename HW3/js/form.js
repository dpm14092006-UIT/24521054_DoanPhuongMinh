import { createMachine } from './formMachine.js';
import { submitRegistration } from './api.js';

export function initForm(form) {
  const btn = form.querySelector('#submit-btn');
  const status = form.querySelector('#form-status');

  // Giao diện chỉ phụ thuộc vào trạng thái hiện tại
  const machine = createMachine((state) => {
    form.dataset.state = state;
    const busy = state === 'submitting';
    btn.disabled = busy;                         // khoá nút khi đang gửi
    form.setAttribute('aria-busy', String(busy));
    btn.textContent = busy ? 'Đang gửi...' : 'Đăng ký';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (machine.state === 'submitting') return;  // lớp bảo vệ 1: đang gửi thì bỏ qua

    const name = form.name.value;
    const email = form.email.value;
    if (!machine.send('SUBMIT')) return;         // lớp bảo vệ 2: máy trạng thái từ chối
    status.innerHTML = 'Đang gửi...';
    try {
      await submitRegistration({ name, email });
      machine.send('RESOLVE');
      status.innerHTML = 'Cảm ơn <b>' + name + '</b>, bạn đã đăng ký thành công!';
    } catch (err) {
      machine.send('REJECT');
      status.innerHTML = err.message;
    }
  });
}
