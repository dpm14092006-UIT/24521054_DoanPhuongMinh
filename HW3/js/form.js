import { createMachine } from './formMachine.js';
import { submitRegistration } from './api.js';

export function initForm(form) {
  const status = form.querySelector('#form-status');
  const machine = createMachine((state) => { form.dataset.state = state; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;
    machine.send('SUBMIT');
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
