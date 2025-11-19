import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  description: String,
  startAt: Date,
  endAt: Date,
  active: { type: Boolean, default: false },
  image: String,
  rules: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Challenge', challengeSchema);