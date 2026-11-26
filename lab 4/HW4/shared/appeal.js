export const dossiers = [
  {
    id: 'himass', name: 'Himass', number: 'FP-DEMO-01', team: 'Đội Mẫu A',
    rule: 'R-04 · Rà soát dữ liệu thi đấu', incident: 'Mốc thời gian trong nhật ký cần được đối chiếu với replay.',
    reference: 'Replay minh họa · hiệp 2, phút 08:35', appliedDays: 14, baselineDays: 7, slaHours: 24,
  },
  {
    id: 'tanvuu', name: 'TanVuu', number: 'FP-DEMO-02', team: 'Đội Mẫu B',
    rule: 'R-07 · Rà soát quy trình xác nhận', incident: 'Biên bản minh họa còn thiếu một bước xác nhận trong quy trình.',
    reference: 'Biên bản minh họa · mục 3, dòng 12', appliedDays: 3, baselineDays: 3, slaHours: 48,
  },
];

export const appealReasons = {
  evidence: 'Bổ sung bằng chứng',
  procedure: 'Rà soát quy trình',
  proportionality: 'Xem lại mức án',
};

export const fieldLabels = {
  name: 'Họ và tên',
  email: 'Email liên hệ',
  team: 'Tên đội',
  reason: 'Lý do kháng nghị',
  statement: 'Nội dung kháng nghị',
  evidenceUrl: 'Liên kết bằng chứng',
};

export function sampleAppeal(dossier, origin = 'https://example.com') {
  return {
    name: dossier.id === 'himass' ? 'Nguyễn Minh An' : 'Trần Hoàng Linh',
    email: `${dossier.id}.demo@example.com`,
    team: dossier.team,
    reason: dossier.id === 'himass' ? 'evidence' : 'procedure',
    statement: `Tôi đề nghị đối chiếu ${dossier.reference.toLowerCase()} với biên bản, kiểm tra các mốc liên quan và xem xét lại kết quả theo quy trình.`,
    evidenceUrl: new URL(`/dossier/${dossier.id}/evidence`, origin).href,
  };
}

export function normalizeAppeal(input) {
  return Object.fromEntries(Object.keys(fieldLabels).map((name) => [
    name,
    typeof input?.[name] === 'string' ? input[name].trim() : '',
  ]));
}

export function validateAppeal(input) {
  const values = normalizeAppeal(input);
  const errors = {};
  if (values.name.length < 2 || values.name.length > 80) errors.name = 'Nhập từ 2 đến 80 ký tự.';
  if (values.email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Nhập địa chỉ email hợp lệ (tối đa 120 ký tự).';
  }
  if (values.team.length < 2 || values.team.length > 80) errors.team = 'Nhập từ 2 đến 80 ký tự.';
  if (!Object.hasOwn(appealReasons, values.reason)) errors.reason = 'Chọn một lý do kháng nghị.';
  if (values.statement.length < 30 || values.statement.length > 1000) {
    errors.statement = 'Nhập từ 30 đến 1.000 ký tự.';
  }
  try {
    const url = new URL(values.evidenceUrl);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || values.evidenceUrl.length > 400) {
      throw new Error();
    }
  } catch {
    errors.evidenceUrl = 'Nhập liên kết HTTP hoặc HTTPS hợp lệ (tối đa 400 ký tự).';
  }
  return errors;
}

export function timeLeft(deadline, now) {
  return Math.max(0, deadline - now);
}

export function computeMatrix(records) {
  return records.map(({ id, name, appliedDays, baselineDays }) => ({
    id, name, appliedDays, baselineDays,
    difference: appliedDays - baselineDays,
    percentage: baselineDays ? ((appliedDays - baselineDays) / baselineDays) * 100 : null,
  }));
}
