import MealPlan from '../models/mealPlanModel.js';

export const createMealPlan = async (req, res) => {
  try {
    const { name, plan } = req.body;
    if (!plan) return res.status(400).json({ success: false, message: 'Plan required' });
    const mp = await MealPlan.create({ userId: req.user?._id, name: name || 'Weekly Plan', plan });
    return res.status(201).json({ success: true, planId: mp._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ userId: req.user?._id }).sort({ createdAt: -1 });
    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};