import { createContext, useContext, useId, useRef, useState } from 'react';
import { appealReasons, fieldLabels, normalizeAppeal, sampleAppeal, validateAppeal } from '../shared/appeal.js';

const AppealFormContext = createContext(null);

function InputField({ name, as: Element = 'input', children, ...props }) {
  const { values, errors, changeField } = useContext(AppealFormContext);
  const id = useId();
  const errorId = `${id}-error`;
  const error = errors[name];

  return (
    <div className="appeal-field">
      <label htmlFor={id}>{fieldLabels[name]}</label>
      <Element {...props} id={id} name={name} value={values[name]} required
        onChange={(event) => changeField(name, event.target.value)}
        aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}>
        {children}
      </Element>
      {error && <span className="error" id={errorId}>{error}</span>}
    </div>
  );
}

export default function AppealForm({ dossier, expired, sendAppeal }) {
  const [values, setValues] = useState(() => sampleAppeal(dossier, window.location.origin));
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverFields, setServerFields] = useState({});
  const [notice, setNotice] = useState('');
  const request = useRef(null);
  const submitting = useRef(false);
  const errors = { ...validateAppeal(values), ...serverFields };
  const valid = Object.keys(errors).length === 0;

  function changeField(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setServerFields({});
    setServerError('');
    setNotice('');
  }

  function fillSample() {
    setValues(sampleAppeal(dossier, window.location.origin));
    setServerFields({});
    setServerError('');
    setNotice('');
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting.current || expired) return;
    if (!valid) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const normalized = normalizeAppeal(values);
    const fingerprint = JSON.stringify(normalized);
    if (request.current?.fingerprint !== fingerprint) {
      request.current = { fingerprint, id: crypto.randomUUID() };
    }
    submitting.current = true;
    setSending(true);
    setNotice('');
    setServerError('');
    try {
      const appeal = await sendAppeal(normalized, request.current.id);
      request.current = null;
      setNotice(`Đã lưu đơn ${appeal.id.slice(0, 8)}. Có thể xem lại trong danh sách bên dưới.`);
    } catch (error) {
      setServerError(error.message);
      setServerFields(error.fields ?? {});
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  return (
    <section className="panel" aria-label="Biểu mẫu kháng nghị">
      <h3>Gửi đơn kháng nghị</h3>
      <p className="muted">Các trường đã có dữ liệu minh họa. Bạn có thể chỉnh sửa trước khi gửi.</p>
      <AppealFormContext.Provider value={{ values, errors, changeField }}>
        <form noValidate onSubmit={submit}>
          <fieldset disabled={sending || expired} className="appeal-fieldset">
            <div className="appeal-fields">
              <InputField name="name" autoComplete="name" maxLength={80} />
              <InputField name="email" type="email" autoComplete="email" maxLength={120} />
              <InputField name="team" autoComplete="organization" maxLength={80} />
              <InputField name="reason" as="select">
                <option value="">Chọn lý do</option>
                {Object.entries(appealReasons).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
              </InputField>
              <InputField name="statement" as="textarea" rows={4} maxLength={1000} />
              <InputField name="evidenceUrl" type="url" inputMode="url" maxLength={400} />
            </div>
            <div className="actions">
              <button className="primary" type="submit">Gửi kháng nghị</button>
              <button type="button" onClick={fillSample}>Khôi phục dữ liệu mẫu</button>
            </div>
          </fieldset>
          <p className={valid ? 'muted form-status' : 'error form-status'} role="status">
            {expired ? 'Đã hết hạn nhận kháng nghị.' : sending ? 'Đang gửi…' : valid ? 'Biểu mẫu hợp lệ.' : 'Hãy sửa các trường được đánh dấu.'}
          </p>
          {serverError && <p className="error" role="alert">{serverError}</p>}
          {notice && <p className="success" role="status">{notice}</p>}
        </form>
      </AppealFormContext.Provider>
    </section>
  );
}
