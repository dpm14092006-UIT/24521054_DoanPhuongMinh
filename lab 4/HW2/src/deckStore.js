import { profiles, swipeActions } from './deck.js';

export const apiMode = import.meta.env.MODE === 'api';

const storageKey = 'uit-lab4-hw2-deck';
let fallback = { revision: 0, history: [] };
let remoteSession;

function sessionId() {
  if (remoteSession) return remoteSession;
  const key = 'uit-lab4-hw2-session';
  remoteSession = crypto.randomUUID();
  try {
    remoteSession = localStorage.getItem(key) || remoteSession;
    localStorage.setItem(key, remoteSession);
  } catch {
    // Keep the same session for the lifetime of the page.
  }
  return remoteSession;
}

async function api(path, { body, signal } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Không kết nối được HW3. Hãy kiểm tra backend và SWIPE_API_TARGET.');
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('HW3 chưa trả về dữ liệu. Hãy kiểm tra backend và SWIPE_API_TARGET.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Yêu cầu không thành công.');
  return data;
}

function readLocalDeck() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey));
    if (value && Number.isSafeInteger(value.revision) && Array.isArray(value.history)
      && value.revision >= value.history.length
      && value.history.every((entry, index) => entry?.profileId === profiles[index]?.id
        && Object.hasOwn(swipeActions, entry?.direction))) {
      return value;
    }
  } catch {
    // Invalid or unavailable browser storage falls back to the current page state.
  }
  return fallback;
}

export async function readDeck(signal) {
  return apiMode ? api('/api/swipes?sessionId=' + sessionId(), { signal }) : readLocalDeck();
}

export function loadDeck(signal) {
  return Promise.all([apiMode ? api('/api/profiles', { signal }) : profiles, readDeck(signal)]);
}

export async function saveAction(revision, profileId, direction) {
  const undo = direction === 'undo';
  if (apiMode) {
    const body = { sessionId: sessionId(), revision };
    if (!undo) Object.assign(body, { profileId, direction });
    return api(undo ? '/api/swipe/undo' : '/api/swipe', { body });
  }

  const current = readLocalDeck();
  const history = current.history;
  if (revision !== current.revision || (!undo && profiles[history.length]?.id !== profileId)) {
    throw new Error('Bộ thẻ đã thay đổi. Đã đồng bộ về lượt hiện tại.');
  }
  const next = {
    revision: revision + 1,
    history: undo ? history.slice(0, -1) : [...history, { profileId, direction }],
  };
  fallback = next;
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // The deck is still playable for the lifetime of the page.
  }
  return next;
}
