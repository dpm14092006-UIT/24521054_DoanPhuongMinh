export async function fetchKraftonPubgTelemetry(squadId, { signal } = {}) {
  const response = await fetch(
    `/api/telemetry?squadId=${encodeURIComponent(squadId)}`,
    {
      signal,
      cache: 'no-store',
    },
  );

  let payload;

  try {
    payload = await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Telemetry server trả về dữ liệu không hợp lệ.');
  }

  if (!response.ok) {
    throw new Error(payload.message || `HTTP Error ${response.status}`);
  }

  return payload;
}
