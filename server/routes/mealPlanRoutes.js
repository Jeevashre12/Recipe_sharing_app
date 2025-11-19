import express from 'express';
import { createMealPlan, getMyPlans } from '../controllers/mealPlanController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();
router.post('/', userAuth, createMealPlan); // save (auth required)
router.get('/my-plans', userAuth, getMyPlans);
export default router;