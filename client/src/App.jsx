import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Recipes from './Pages/Recipes';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Pages/Login';
import EmailVerify from './Pages/EmailVerify';
import ResetPassword from './Pages/ResetPassword';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import EnterEmail from './Pages/EnterEmail';
import MyRecipes from './Pages/MyRecipes';
import Contact from './Pages/Contact';
import MealPlanner from './Pages/MealPlanner';

// Recipe-related components
import RecipeCard from './components/RecipeCard';
import CreateRecipeModal from './components/CreateRecipeModal';
// import RecipeModal from './components/RecipeModal'; // Not needed if it doesn’t exist

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AppContextProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import RecipeDetail from './Pages/RecipeDetail';

const App = () => {
  return (
    <AppContextProvider>
      <div className="page-container">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/recipes/:id' element={<RecipeDetail />} />
          <Route
            path='/my-recipes'
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/enter-email' element={<EnterEmail />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
        </Routes>
      </div>
    </AppContextProvider>
  );
};

export default App;
