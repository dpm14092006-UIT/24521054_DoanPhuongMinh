import assert from 'node:assert/strict';
import { test } from 'node:test';
import { computeMatrix, dossiers, normalizeAppeal, sampleAppeal, timeLeft, validateAppeal } from '../shared/appeal.js';

test('Hồ sơ mẫu có đầy đủ trường và được nhận sau khi chuẩn hóa', () => {
  for (const dossier of dossiers) {
    const sample = sampleAppeal(dossier);
    assert.equal(Object.values(sample).filter(Boolean).length, 6);
    assert.deepEqual(validateAppeal(sample), {});
    assert.equal(new URL(sample.evidenceUrl).pathname, `/dossier/${dossier.id}/evidence`);
    assert.equal(normalizeAppeal({ ...sample, name: `  ${sample.name}  ` }).name, sample.name);
  }
});

test('Biểu mẫu từ chối các trường thiếu, mã lý do lạ và URL ngoài HTTP(S)', () => {
  assert.equal(Object.keys(validateAppeal(null)).length, 6);
  const sample = sampleAppeal(dossiers[0]);
  const errors = validateAppeal({ ...sample, reason: '__proto__', evidenceUrl: 'file:///evidence' });
  assert.deepEqual(Object.keys(errors), ['reason', 'evidenceUrl']);
});

test('SLA dùng thời điểm tuyệt đối và dừng ở 0 sau khi đồng hồ tiến qua hạn', () => {
  const deadline = 60_000;
  assert.equal(timeLeft(deadline, 1_000), 59_000);
  assert.equal(timeLeft(deadline, 45_000), 15_000);
  assert.equal(timeLeft(deadline, 65_000), 0);
});

test('Ma trận tính chênh lệch từ dữ liệu hồ sơ và xử lý mốc bằng 0', () => {
  const rows = computeMatrix([...dossiers, { id: 'zero', name: 'Mẫu', appliedDays: 4, baselineDays: 0 }]);
  assert.deepEqual(rows.map(({ difference, percentage }) => [difference, percentage]), [[7, 100], [0, 0], [4, null]]);
});
