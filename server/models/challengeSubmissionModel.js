import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, // optional reference
  snapshot: { type: Object }, // small copy of recipe title/image for resilience
  notes: String,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  votes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ChallengeSubmission', submissionSchema);