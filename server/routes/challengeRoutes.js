import express from 'express';
import {
  listChallenges,
  getActiveChallenge,
  getChallenge,
  createChallenge,
  updateChallenge,
  submitToChallenge
} from '../controllers/challengeController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.get('/', listChallenges);
router.get('/active', getActiveChallenge);
router.get('/:id', getChallenge);
router.post('/', userAuth, createChallenge); // admin
router.put('/:id', userAuth, updateChallenge); // admin
router.post('/:id/submit', userAuth, submitToChallenge); // submit by user

export default router;