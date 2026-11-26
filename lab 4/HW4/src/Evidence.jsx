import { Link, useParams } from 'react-router';
import { dossiers } from '../shared/appeal.js';

export default function Evidence() {
  const { playerID } = useParams();
  const dossier = dossiers.find(({ id }) => id === playerID);

  if (!dossier) return <p role="alert" className="error">404 · Không tìm thấy tài liệu.</p>;

  return (
    <section className="panel" aria-labelledby="evidence-title">
      <h3 id="evidence-title">Tài liệu mô phỏng · {dossier.number}</h3>
      <dl className="details">
        <div><dt>Hồ sơ</dt><dd>{dossier.name}</dd></div>
        <div><dt>Nguồn đối chiếu</dt><dd>{dossier.reference}</dd></div>
        <div><dt>Nội dung</dt><dd>{dossier.incident}</dd></div>
      </dl>
      <Link to={'/dossier/' + dossier.id}>Về hồ sơ và biểu mẫu</Link>
    </section>
  );
}
