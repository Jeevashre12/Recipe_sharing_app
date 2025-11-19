import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, default: 'Weekly Plan' },
  plan: { type: Object, required: true } // store day -> slot -> recipeId
}, { timestamps: true });

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlan;