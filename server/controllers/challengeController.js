import Challenge from '../models/challengeModel.js';
import ChallengeSubmission from '../models/challengeSubmissionModel.js';
import Recipe from '../models/recipeModel.js'; // if exists
import mongoose from 'mongoose';

export const listChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ startAt: -1 });
    res.json(challenges);
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
};

export const getActiveChallenge = async (req, res) => {
  try {
    const now = new Date();
    const active = await Challenge.findOne({ active: true }) ||
      await Challenge.findOne({ startAt: { $lte: now }, endAt: { $gte: now } }).sort({ startAt: -1 });
    res.json(active || null);
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
};

export const getChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false });
    const challenge = await Challenge.findById(id);
    if (!challenge) return res.status(404).json({ success: false, message: 'Not found' });
    const submissions = await ChallengeSubmission.find({ challengeId: challenge._id }).populate('userId', 'name').sort({ createdAt: -1 });
    res.json({ challenge, submissions });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
};

export const createChallenge = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ success: false });
    const payload = req.body;
    // deactivate others if active flag set
    if (payload.active) await Challenge.updateMany({ active: true }, { active: false });
    const ch = await Challenge.create({ ...payload, createdBy: req.user._id });
    res.status(201).json(ch);
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
};

export const updateChallenge = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ success: false });
    const { id } = req.params;
    const payload = req.body;
    if (payload.active) await Challenge.updateMany({ active: true }, { active: false });
    const updated = await Challenge.findByIdAndUpdate(id, payload, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
};

export const submitToChallenge = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const { recipeId, notes } = req.body;
    const challenge = await Challenge.findById(id);
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });

    const now = new Date();
    if (challenge.startAt && challenge.endAt) {
      if (now < challenge.startAt || now > challenge.endAt) {
        return res.status(400).json({ success: false, message: 'Challenge not active' });
      }
    } else if (!challenge.active) {
      return res.status(400).json({ success: false, message: 'Challenge not active' });
    }

    let snapshot = {};
    if (recipeId) {
      try {
        const r = await Recipe.findById(recipeId);
        if (r) snapshot = { title: r.title, summary: r.summary, image: r.images?.[0] || r.image };
      } catch (e) { /* ignore */ }
    }

    const submission = await ChallengeSubmission.create({
      challengeId: challenge._id,
      userId: req.user._id,
      recipeId: recipeId || undefined,
      snapshot,
      notes: notes || ''
    });

    res.status(201).json({ success: true, submission });
  } catch (err) { console.error(err); res.status(500).json({ success: false, message: 'Server error' }); }
};