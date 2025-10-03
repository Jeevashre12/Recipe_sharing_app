import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import CreateRecipeModal from '../components/CreateRecipeModal';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { backendUrl, isLoggedIn } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      const res = await axios.get(backendUrl + '/api/recipes/list', { params });
      setRecipes(res.data?.recipes || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>All Recipes</h1>
        {isLoggedIn ? (
          <button className="create-recipe-btn" onClick={() => setShowCreateModal(true)}>Create Recipe</button>
        ) : (
          <button className="create-recipe-btn" onClick={() => navigate('/login')}>Login to Upload</button>
        )}
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search recipes by title, description, or cuisine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchRecipes(); }}
          />
        </div>
        <div className="filter-dropdowns">
          <button className="search-btn" onClick={fetchRecipes}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Recipes
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateRecipeModal
          onClose={() => setShowCreateModal(false)}
          onRecipeCreated={fetchRecipes}
        />
      )}

      {loading ? (
        <div className="loading">Loading recipes...</div>
      ) : error ? (
        <div className="no-recipes">{error}</div>
      ) : (
        <div className="recipes-grid">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))
          ) : (
            <div className="no-recipes">No recipes found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Recipes;
