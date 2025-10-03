import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

const MyRecipes = () => {
  const { backendUrl } = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMyRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + '/api/recipes/user/my-recipes');
      if (data.success) {
        setRecipes(data.recipes || []);
      } else {
        setError(data.message || 'Failed to load your recipes');
      }
    } catch (err) {
      setError('Failed to load your recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>Your Recipes</h1>
      </div>

      {loading ? (
        <div className="loading">Loading your recipes...</div>
      ) : error ? (
        <div className="no-recipes">{error}</div>
      ) : (
        <div className="recipes-grid">
          {recipes.length > 0 ? (
            recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
          ) : (
            <div className="no-recipes">You haven't added any recipes yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;



