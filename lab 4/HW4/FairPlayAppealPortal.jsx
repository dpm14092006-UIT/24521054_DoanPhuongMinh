import { useMemo } from 'react';
import { Link } from 'react-router';
import FairPlayAppealPortal from '../HW2/FairPlayAppealPortal.jsx';
import { computeMatrix, dossiers } from '../shared/appeal.js';
import './matrix.css';

const formatDelta = new Intl.NumberFormat('vi-VN', { signDisplay: 'exceptZero', maximumFractionDigits: 1 });

export default function Homework4FairPlayPortal() {
  const matrix = useMemo(() => computeMatrix(dossiers), []);

  return (
    <FairPlayAppealPortal dossierPath="/hw4/dossier">
      <div className="panel penalty-panel">
        <h3>So sánh mức án với mốc tham chiếu</h3>
        <div className="table-scroll" role="region" aria-label="Bảng mức án" tabIndex={0}>
          <table className="penalty-table">
            <thead>
              <tr>
                <th scope="col">Tuyển thủ</th>
                <th scope="col">Mức áp dụng</th>
                <th scope="col">Mốc tham chiếu</th>
                <th scope="col">Chênh lệch</th>
                <th scope="col">Tỷ lệ chênh lệch</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map(({ id, name, appliedDays, baselineDays, difference, percentage }) => (
                <tr key={id}>
                  <th scope="row"><Link to={`/hw4/dossier/${id}`}>{name}</Link></th>
                  <td>{appliedDays} ngày</td>
                  <td>{baselineDays} ngày</td>
                  <td>{formatDelta.format(difference)} ngày</td>
                  <td>{percentage === null ? 'Không áp dụng' : `${formatDelta.format(percentage)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">Tỷ lệ chênh lệch = (mức áp dụng − mốc tham chiếu) ÷ mốc tham chiếu × 100%.</p>
      </div>
    </FairPlayAppealPortal>
  );
}
