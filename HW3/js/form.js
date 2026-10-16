import { createMachine } from './formMachine.js';
import { submitRegistration } from './api.js';
import { validate } from './sanitize.js';

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

    const { data, errors, ok } = validate({
      name: form.elements.name.value,
      email: form.elements.email.value,
    });
    if (!ok) {
      status.textContent = Object.values(errors).join(' ');
      (errors.name ? form.elements.name : form.elements.email).focus();
      return;
    }

    if (!machine.send('SUBMIT')) return;         // lớp bảo vệ 2: máy trạng thái từ chối
    status.textContent = '';

    try {
      await submitRegistration(data);
      machine.send('RESOLVE');
      status.textContent = `Cảm ơn ${data.name}, bạn đã đăng ký thành công!`;
      form.reset();
    } catch (err) {
      machine.send('REJECT');
      status.textContent = err.message;
    }
  });
}
