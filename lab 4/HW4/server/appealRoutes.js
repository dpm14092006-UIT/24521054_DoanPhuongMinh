import { Router } from 'express';
import mongoose from 'mongoose';
import { dossiers, fieldLabels, normalizeAppeal, validateAppeal } from '../shared/appeal.js';
import { apiError, isUuid } from './common.js';

export const appealRouter = Router();

const caseSchema = new mongoose.Schema({
  _id: String,
  deadline: { type: Date, required: true },
}, { versionKey: false });

const appealSchema = new mongoose.Schema({
  _id: String,
  caseId: { type: String, required: true },
  sessionId: { type: String, required: true },
  ...Object.fromEntries(Object.keys(fieldLabels).map((key) => [key, { type: String, required: true }])),
  createdAt: { type: Date, required: true },
}, { versionKey: false });
appealSchema.index({ caseId: 1, sessionId: 1, createdAt: -1 });

const Dossier = mongoose.model('Dossier', caseSchema);
const Appeal = mongoose.model('Appeal', appealSchema);

function getDossier(playerId, sessionId) {
  if (!isUuid(sessionId)) throw apiError(400, 'Phiên không hợp lệ.');
  const dossier = dossiers.find(({ id }) => id === playerId);
  if (!dossier) throw apiError(404, 'Không tìm thấy hồ sơ.');
  return { dossier, caseId: playerId };
}

async function getDeadline(caseId, hours) {
  const deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  const record = await Dossier.findByIdAndUpdate(
    caseId, { $setOnInsert: { deadline } }, { upsert: true, new: true },
  ).lean();
  return record.deadline;
}

function publicAppeal({ _id, createdAt, ...record }) {
  return { id: _id.split(':').at(-1), createdAt, ...normalizeAppeal(record) };
}

appealRouter.get('/appeal-clock', (_req, res) => res.json({ serverNow: Date.now() }));

appealRouter.get('/dossiers/:playerId', async (req, res) => {
  const { sessionId } = req.query;
  const { dossier, caseId } = getDossier(req.params.playerId, sessionId);
  const [deadline, appeals] = await Promise.all([
    getDeadline(caseId, dossier.slaHours),
    Appeal.find({ caseId, sessionId }).sort({ createdAt: -1, _id: 1 }).limit(25).lean(),
  ]);
  res.json({ dossier, deadline: deadline.toISOString(), serverNow: Date.now(), appeals: appeals.map(publicAppeal) });
});

appealRouter.post('/dossiers/:playerId/appeals', async (req, res) => {
  const { sessionId, requestId, values } = req.body ?? {};
  const { dossier, caseId } = getDossier(req.params.playerId, sessionId);
  if (!isUuid(requestId)) throw apiError(400, 'Mã yêu cầu không hợp lệ.');
  const fields = validateAppeal(values);
  if (Object.keys(fields).length) throw apiError(422, 'Hãy kiểm tra các trường của biểu mẫu.', fields);

  const id = `${caseId}:${sessionId}:${requestId}`;
  const payload = normalizeAppeal(values);
  const previous = await Appeal.findById(id).lean();
  if (previous) {
    if (Object.keys(fieldLabels).some((field) => previous[field] !== payload[field])) {
      throw apiError(409, 'Mã yêu cầu đã được dùng cho một đơn khác.');
    }
    return res.json(publicAppeal(previous));
  }

  const deadline = await getDeadline(caseId, dossier.slaHours);
  if (Date.now() >= deadline.getTime()) throw apiError(409, 'Đã hết thời hạn nhận kháng nghị.');
  try {
    const row = await Appeal.create({ ...payload, _id: id, caseId, sessionId, createdAt: new Date() });
    res.status(201).json(publicAppeal(row.toObject()));
  } catch (error) {
    if (error.code !== 11000) throw error;
    const row = await Appeal.findById(id).lean();
    if (!row || Object.keys(fieldLabels).some((field) => row[field] !== payload[field])) {
      throw apiError(409, 'Mã yêu cầu đã được dùng cho một đơn khác.');
    }
    res.json(publicAppeal(row));
  }
});
