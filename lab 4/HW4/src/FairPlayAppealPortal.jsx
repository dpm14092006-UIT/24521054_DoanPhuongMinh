import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useParams } from 'react-router';
import { api, getSessionId } from '../shared/api.js';
import { appealReasons, dossiers, fieldLabels } from '../shared/appeal.js';
import AppealForm from './AppealForm.jsx';
import { useAppealSlaTimer } from './useAppealSlaTimer.js';
import PenaltyMatrix from './PenaltyMatrix.jsx';
import './appeal.css';

const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'medium' });

export default function FairPlayAppealPortal() {
  return (
    <section className="appeal-portal">
      <h2>Hồ sơ kháng nghị fair-play Esports</h2>
      <p className="muted">Hồ sơ, mức án và đơn gửi trên trang đều là dữ liệu mô phỏng cho Lab 4.</p>
      <PenaltyMatrix />
      <div className="case-layout">
        <nav className="case-nav panel" aria-label="Hồ sơ tuyển thủ">
          {dossiers.map(({ id, name, number }) => (
            <NavLink key={id} to={`/dossier/${id}`}>{name} · {number}</NavLink>
          ))}
        </nav>
        <div className="case-content"><Outlet /></div>
      </div>
    </section>
  );
}

export function DossierStart() {
  return <p>Chọn Himass hoặc TanVuu để xem hồ sơ và gửi đơn kháng nghị.</p>;
}

export function DossierRoute() {
  const { playerID } = useParams();
  if (!dossiers.some(({ id }) => id === playerID)) {
    return <p role="alert" className="error">404 · Không tìm thấy hồ sơ tuyển thủ.</p>;
  }
  return <DossierLoader key={playerID} playerId={playerID} />;
}

function DossierLoader({ playerId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const sessionId = getSessionId();
  const casePath = `/api/dossiers/${playerId}`;

  useEffect(() => {
    const controller = new AbortController();
    const startedAt = Date.now();
    api(`${casePath}?sessionId=${sessionId}`, { signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setData({ ...result, clockOffset: result.serverNow - (startedAt + Date.now()) / 2 });
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      });
    return () => controller.abort();
  }, [casePath, sessionId, attempt]);

  async function sendAppeal(values, requestId) {
    const result = await api(`${casePath}/appeals`, { method: 'POST', body: { sessionId, requestId, values } });
    setData((previous) => ({
      ...previous, appeals: [result, ...previous.appeals.filter(({ id }) => id !== result.id)].slice(0, 25),
    }));
    return result;
  }

  if (error) {
    return <div><p role="alert" className="error">{error}</p>
      <button type="button" onClick={() => { setError(''); setAttempt((value) => value + 1); }}>Tải lại hồ sơ</button></div>;
  }

  if (!data) return <p role="status">Đang tải hồ sơ và hạn kháng nghị…</p>;
  return <DossierView {...data} sendAppeal={sendAppeal} />;
}

function DossierView({ dossier, deadline, clockOffset, appeals, sendAppeal }) {
  const remaining = useAppealSlaTimer(Date.parse(deadline), clockOffset);
  const seconds = Math.ceil(remaining / 1000);
  const clock = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((part) => String(part).padStart(2, '0')).join(':');

  return (
    <>
      <section className="panel" aria-labelledby="case-title">
        <h3 id="case-title">{dossier.name} · {dossier.number}</h3>
        <dl className="details">
          <div><dt>Đội</dt><dd>{dossier.team}</dd></div>
          <div><dt>Điều khoản</dt><dd>{dossier.rule}</dd></div>
          <div><dt>Nội dung</dt><dd>{dossier.incident}</dd></div>
          <div><dt>Tài liệu</dt><dd><Link to={`/dossier/${dossier.id}/evidence`}>{dossier.reference}</Link></dd></div>
          <div><dt>Án mô phỏng</dt><dd>{dossier.appliedDays} ngày</dd></div>
          <div><dt>Hạn kháng nghị</dt><dd><time dateTime={deadline}>{dateFormat.format(new Date(deadline))}</time></dd></div>
        </dl>
        <p className="sla-clock">
          SLA còn lại <span role="timer" aria-label="Giờ, phút, giây còn lại">{clock}</span>
          {!remaining && <span role="status"> · Đã hết hạn</span>}
        </p>
      </section>
      <AppealForm dossier={dossier} expired={remaining === 0} sendAppeal={sendAppeal} />
      <section className="panel" aria-labelledby="submitted-title">
        <h3 id="submitted-title">Đơn đã gửi trong phiên này</h3>
        {appeals.length ? (
          appeals.map((appeal, index) => <ShowData key={appeal.id} appeal={appeal} open={index === 0} />)
        ) : <p>Chưa có đơn nào.</p>}
      </section>
    </>
  );
}

function ShowData({ appeal, open }) {
  const fields = {
    ...appeal,
    reason: appealReasons[appeal.reason],
    evidenceUrl: <a href={appeal.evidenceUrl}>{appeal.evidenceUrl}</a>,
  };

  return (
    <details open={open} className="submitted-appeal">
      <summary>Đơn {appeal.id.slice(0, 8)} · <time dateTime={appeal.createdAt}>{dateFormat.format(new Date(appeal.createdAt))}</time></summary>
      <dl className="details">
        <div><dt>Trạng thái</dt><dd>Đã tiếp nhận</dd></div>
        {Object.entries(fieldLabels).map(([name, label]) => (
          <div key={name}>
            <dt>{label}</dt>
            <dd>{fields[name]}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
