import express from 'express';
import cors from 'cors';
import contactRoutes from './routes/contactRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/meal-plans', mealPlanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});