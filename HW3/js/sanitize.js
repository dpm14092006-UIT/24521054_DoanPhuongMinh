// Chuẩn hoá dữ liệu: bỏ ký tự điều khiển, cắt khoảng trắng thừa, giới hạn độ dài.
export function normalizeText(value, maxLength) {
  return String(value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(raw) {
  const name = normalizeText(raw.name, 60);
  const email = normalizeText(raw.email, 100).toLowerCase();
  const errors = {};
  if (name.length < 2) errors.name = 'Họ tên cần ít nhất 2 ký tự.';
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Email không hợp lệ.';
  return { data: { name, email }, errors, ok: Object.keys(errors).length === 0 };
}
