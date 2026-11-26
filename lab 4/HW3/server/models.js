import mongoose from 'mongoose';
import { swipeDirections } from './profiles.js';

const profileSchema = new mongoose.Schema({
  _id: String,
  name: String,
  age: Number,
  city: String,
  work: String,
  interests: [String],
  bio: String,
  order: Number,
}, { versionKey: false });

const historyEntry = new mongoose.Schema({
  profileId: { type: String, required: true },
  direction: { type: String, enum: swipeDirections, required: true },
}, { _id: false });

const swipeSchema = new mongoose.Schema({
  _id: String,
  history: { type: [historyEntry], default: [] },
  revision: { type: Number, required: true, default: 0 },
}, { versionKey: false });

export const Profile = mongoose.model('Profile', profileSchema);
export const Swipe = mongoose.model('Swipe', swipeSchema);
