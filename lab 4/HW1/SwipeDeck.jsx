import { useEffect, useRef, useState } from 'react';
import { api, getSessionId } from '../shared/api.js';
import { getSwipeDirection, scoreHistory, swipeActions } from '../shared/deck.js';
import './swipe.css';

const keyDirections = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' };

export default function SwipeDeck({ scope }) {
  const [profiles, setProfiles] = useState([]);
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const lock = useRef(false);
  const gesture = useRef(null);
  const sessionId = getSessionId();
  const deckPath = `/api/swipe/${scope}?sessionId=${sessionId}`;

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    Promise.all([api('/api/profiles', options), api(deckPath, options)])
      .then(([items, current]) => {
        if (controller.signal.aborted) return;
        setProfiles(items);
        setDeck(current);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      });
    return () => controller.abort();
  }, [deckPath, loadAttempt]);

  const history = deck?.history ?? [];
  const current = profiles[history.length];
  const profileNames = Object.fromEntries(profiles.map(({ id, name }) => [id, name]));

  async function changeDeck(direction) {
    const undo = direction === 'undo';
    if (lock.current || !deck || (undo ? !history.length : !current)) return;
    lock.current = true;
    setPending(true);
    setError('');
    setNotice('');
    try {
      const body = { scope, sessionId, revision: deck.revision };
      if (!undo) Object.assign(body, { profileId: current.id, direction });
      const result = await api(undo ? '/api/swipe/undo' : '/api/swipe', { method: 'POST', body });
      setDeck(result);
      setNotice(undo ? 'Đã khôi phục thẻ trước.' : `Đã lưu: ${swipeActions[direction].label} ${current.name}.`);
    } catch (failure) {
      setError(failure.message);
      try {
        setDeck(await api(deckPath));
      } catch {
        setError(`${failure.message} Không thể đồng bộ bộ thẻ. Tải lại trang để thử lại.`);
      }
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const action = event.key === 'Backspace' ? 'undo' : keyDirections[event.key];
    if (!action) return;
    event.preventDefault();
    if (!event.repeat) void changeDeck(action);
  }

  function handlePointerDown(event) {
    if (!event.isPrimary || event.button !== 0 || pending) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    const start = gesture.current;
    if (start?.id !== event.pointerId) return;
    gesture.current = null;
    const direction = getSwipeDirection(event.clientX - start.x, event.clientY - start.y);
    if (direction) void changeDeck(direction);
  }

  return (
    <section aria-labelledby={`swipe-title-${scope}`} onKeyDown={handleKeyDown}>
      <h2 id={`swipe-title-${scope}`}>Hẹn hò nhưng không yêu</h2>
      <p id={`swipe-help-${scope}`} className="muted">
        Vuốt thẻ hoặc dùng phím ← Bỏ qua, → Thích, ↑ Làm bạn và Backspace để hoàn tác.
      </p>
      {error && <p className="error" role="alert">{error}</p>}
      {!deck && (error ? (
        <button type="button" onClick={() => { setError(''); setLoadAttempt((value) => value + 1); }}>Tải lại bộ thẻ</button>
      ) : <p role="status">Đang tải hồ sơ…</p>)}
      {deck && (
        <>
          <dl className="deck-stats" aria-label="Kết quả bộ thẻ">
            <div><dt>Điểm</dt><dd>{scoreHistory(history)}</dd></div>
            <div><dt>Đã xem</dt><dd>{history.length}/{profiles.length}</dd></div>
            <div><dt>Thích</dt><dd>{history.filter(({ direction }) => direction === 'right').length}</dd></div>
          </dl>
          {current ? (
            <article className="panel swipe-card" tabIndex={0} aria-describedby={`swipe-help-${scope}`}
              onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}
              onPointerCancel={() => { gesture.current = null; }}
              onLostPointerCapture={() => { gesture.current = null; }}>
              <h3>{current.name}, {current.age} tuổi</h3>
              <p>{current.bio}</p>
              <dl className="details">
                <div><dt>Thành phố</dt><dd>{current.city}</dd></div>
                <div><dt>Công việc</dt><dd>{current.work}</dd></div>
                <div><dt>Sở thích</dt><dd>{current.interests.join(', ')}</dd></div>
              </dl>
            </article>
          ) : (
            <div className="panel swipe-card" tabIndex={0}><h3>Đã xem hết bộ thẻ</h3><p>Hoàn tác để quay lại thẻ cuối.</p></div>
          )}
          <div className="actions">
            <button type="button" aria-disabled={pending || !current} onClick={() => void changeDeck('left')}>← Bỏ qua (−5)</button>
            <button type="button" aria-disabled={pending || !current} onClick={() => void changeDeck('up')}>↑ Làm bạn (−5)</button>
            <button type="button" className="primary" aria-disabled={pending || !current} onClick={() => void changeDeck('right')}>Thích (+10) →</button>
            <button type="button" aria-disabled={pending || !history.length} onClick={() => void changeDeck('undo')}>Hoàn tác lượt cuối</button>
          </div>
          <p className="deck-notice" role="status">{pending ? 'Đang lưu…' : notice}</p>
          <h3>Lịch sử lựa chọn</h3>
          {history.length ? (
            <ol>{history.map(({ profileId, direction }) => (
              <li key={profileId}>{profileNames[profileId]} · {swipeActions[direction].label}</li>
            ))}</ol>
          ) : <p className="muted">Chưa có lượt vuốt.</p>}
        </>
      )}
    </section>
  );
}
