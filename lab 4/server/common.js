export const isUuid = (value) => typeof value === 'string'
  && /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(value);

export function apiError(status, message, fields) {
  return Object.assign(new Error(message), { status, fields });
}

export function handleError(error, _req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  if (status === 500) console.error(error);
  const message = status === 500 ? 'Máy chủ gặp lỗi. Vui lòng thử lại.'
    : error.type === 'entity.parse.failed' ? 'Dữ liệu JSON không hợp lệ.'
      : error.message;
  res.status(status).json({ error: message, fields: error.fields });
}
