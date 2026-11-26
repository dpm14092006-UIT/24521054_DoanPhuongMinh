export async function api(path, { body, signal, method = 'GET' } = {}) {
  const response = await fetch(path, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    throw Object.assign(new Error(data.error || 'Yêu cầu không thành công.'), {
      status: response.status,
      fields: data.fields,
    });
  }
  return data;
}

let session;

export function getSessionId() {
  if (session) return session;
  const key = 'uit-lab4-session';
  try {
    session = localStorage.getItem(key) || crypto.randomUUID();
    localStorage.setItem(key, session);
  } catch {
    session = crypto.randomUUID();
  }
  return session;
}
