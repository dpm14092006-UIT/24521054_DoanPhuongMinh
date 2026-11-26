import { Router } from 'express';
import { profiles, swipeDirections } from './profiles.js';
import { Profile, Swipe } from './models.js';
import { apiError, isUuid } from './common.js';

export const swipeRouter = Router();

function validatedSessionId(value) {
  if (!isUuid(value)) throw apiError(400, 'Phiên bộ thẻ không hợp lệ.');
  return value;
}

const emptyDeck = { revision: 0, history: [] };

export async function seedProfiles() {
  await Profile.bulkWrite(profiles.map(({ id, ...profile }, order) => ({
    updateOne: { filter: { _id: id }, update: { $set: { ...profile, order } }, upsert: true },
  })));
}

swipeRouter.get('/profiles', async (_req, res) => {
  const rows = await Profile.find({ _id: { $in: profiles.map(({ id }) => id) } }).sort('order').lean();
  res.json(rows.map(({ _id, order, ...profile }) => ({ id: _id, ...profile })));
});

swipeRouter.get('/swipes', async (req, res) => {
  const id = validatedSessionId(req.query.sessionId);
  const deck = await Swipe.findById(id).select('history revision -_id').lean();
  res.json(deck ?? emptyDeck);
});

async function changeDeck(body, undo) {
  const { sessionId, revision, profileId, direction } = body ?? {};
  const id = validatedSessionId(sessionId);
  if (!Number.isSafeInteger(revision) || revision < 0) {
    throw apiError(400, 'Phiên bản bộ thẻ không hợp lệ.');
  }
  if (!undo && (!swipeDirections.includes(direction))) {
    throw apiError(400, 'Hướng vuốt không hợp lệ.');
  }

  const current = await Swipe.findById(id).lean() ?? emptyDeck;
  if (current.revision !== revision) throw apiError(409, 'Bộ thẻ đã thay đổi. Tải lại lượt hiện tại.');
  if (undo && !current.history.length) throw apiError(400, 'Chưa có lượt để hoàn tác.');
  if (!undo && (!profiles[current.history.length] || profiles[current.history.length].id !== profileId)) {
    throw apiError(409, 'Thẻ này không còn ở đầu bộ thẻ.');
  }

  const next = {
    revision: revision + 1,
    history: undo ? current.history.slice(0, -1) : [...current.history, { profileId, direction }],
  };
  try {
    const updated = await Swipe.findOneAndUpdate(
      { _id: id, revision },
      { $set: next },
      { upsert: revision === 0, new: true, runValidators: true },
    ).lean();
    if (!updated) throw apiError(409, 'Bộ thẻ đã thay đổi. Tải lại lượt hiện tại.');
    return next;
  } catch (error) {
    if (error.code === 11000) throw apiError(409, 'Bộ thẻ đã thay đổi. Tải lại lượt hiện tại.');
    throw error;
  }
}

swipeRouter.post('/swipe', async (req, res) => {
  res.status(201).json(await changeDeck(req.body, false));
});

swipeRouter.post('/swipe/undo', async (req, res) => {
  res.json(await changeDeck(req.body, true));
});
