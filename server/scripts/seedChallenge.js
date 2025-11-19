import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Challenge from '../models/challengeModel.js';

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGODB_URI);
  const sample = {
    title: 'Bread Week',
    slug: 'bread-week',
    description: 'Show off your best bread recipes — loaves, sourdough, quick breads.',
    startAt: new Date(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    active: true,
    rules: 'Any bread recipe qualifies. Submit an existing recipe or quick-create one.'
  };
  const created = await Challenge.create(sample);
  console.log('Created challenge:', created._id);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });