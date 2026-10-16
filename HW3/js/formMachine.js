// Bảng chuyển trạng thái: [trạng thái hiện tại][sự kiện] → trạng thái mới
const transitions = {
  idle:       { SUBMIT: 'submitting' },
  submitting: { RESOLVE: 'success', REJECT: 'error' },
  success:    { RESET: 'idle' },
  error:      { SUBMIT: 'submitting', RESET: 'idle' },
};

export function createMachine(onChange) {
  let state = 'idle';
  return {
    get state() { return state; },
    send(event) {
      const next = transitions[state][event];
      if (!next) return false;          // chuyển không hợp lệ → từ chối
      state = next;
      onChange(state);
      return true;
    },
  };
}
