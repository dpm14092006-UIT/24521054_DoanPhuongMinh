// Giả lập gửi lên máy chủ mất 1.5 giây.
// Email kết thúc bằng @fail.test sẽ luôn lỗi → dễ test trạng thái error.
let callCount = 0;
export function submitRegistration(data) {
  callCount++;
  console.log(`[api] Lần gọi thứ ${callCount}`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email.endsWith('@fail.test')) reject(new Error('Máy chủ đang bận, vui lòng thử lại.'));
      else resolve({ ok: true });
    }, 1500);
  });
}
