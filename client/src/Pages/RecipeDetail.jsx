import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import ShareRecipe from '../components/ShareRecipe';

import './Recipes.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`${backendUrl}/api/recipes/${id}`);
        if (data.success) {
          const r = data.recipe || {};
          // Normalize ingredients/instructions if saved as strings
          const normalizeList = (val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
              try {
                const parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : val.split(/\r?\n|,\s*/).filter(Boolean);
              } catch (_) {
                return val.split(/\r?\n|,\s*/).filter(Boolean);
              }
            }
            return [];
          };
          r.ingredients = normalizeList(r.ingredients);
          r.instructions = normalizeList(r.instructions);
          setRecipe(r);
        } else {
          setError(data.message || 'Failed to load recipe');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, backendUrl]);

  // inject Botpress webchat core
  const s1 = document.createElement('script');
  s1.src = 'https://cdn.botpress.cloud/webchat/v3.4/inject.js';
  s1.async = true;
  document.body.appendChild(s1);

  // inject your bot config/instance (deferred)
  const s2 = document.createElement('script');
  s2.src = 'https://files.bpcontent.cloud/2025/11/your-bot-config.js';
  s2.async = true;
  document.body.appendChild(s2);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '');
      if (host.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}` : null;
      }
      if (host.includes('youtu.be')) {
        const vid = u.pathname.slice(1);
        return vid ? `https://www.youtube.com/embed/${vid}` : null;
      }
      if (host.includes('vimeo.com')) {
        const vid = u.pathname.split('/').filter(Boolean)[0];
        return vid ? `https://www.youtube.com/embed/${vid}` : null;
      }
      return null;
    } catch (_) {
      return null;
    }
  };

  if (loading) return <div className="recipes-page"><div className="loading">Loading recipe...</div></div>;
  if (error) return <div className="recipes-page"><div className="no-recipes">{error}</div></div>;
  if (!recipe) return <div className="recipes-page"><div className="no-recipes">Recipe not found.</div></div>;

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>{recipe.title}</h1>
        <ShareRecipe recipe={recipe} />
      </div>

      {recipe.videoUrl && (
        <div className="recipe-video" style={{ marginBottom: 24 }}>
          {getEmbedUrl(recipe.videoUrl) ? (
            <iframe
              src={getEmbedUrl(recipe.videoUrl)}
              title="Recipe video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: 360, borderRadius: 12 }}
            />
          ) : (
            <video src={recipe.videoUrl} controls preload="metadata" style={{ width: '100%', borderRadius: 12 }} />
          )}
        </div>
      )}

      <div className="recipe-content" style={{ background: 'white', padding: 24, borderRadius: 16 }}>
        <h2 style={{ marginTop: 0 }}>Description</h2>
        <p style={{ lineHeight: 1.6 }}>{recipe.description}</p>

        {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
          <>
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map((item, idx) => (
                <li key={idx}>
                  {typeof item === 'string' ? item : `${item.quantity} ${item.unit} ${item.name}`}
                </li>
              ))}
            </ul>
          </>
        )}

        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
          <>
            <h2>Instructions</h2>
            <ol>
              {recipe.instructions.map((step, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  {typeof step === 'string' ? step : step.instruction}
                </li>
              ))}
            </ol>
          </>
        )}

        {Array.isArray(recipe.dietaryTags) && recipe.dietaryTags.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {recipe.dietaryTags.map(tag => (
              <span key={tag} className="dietary-tag">{tag}</span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
          <h3>Recipe Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <strong>Prep Time:</strong> {recipe.prepTime} minutes
            </div>
            <div>
              <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
            </div>
            <div>
              <strong>Total Time:</strong> {recipe.prepTime + recipe.cookingTime} minutes
            </div>
            <div>
              <strong>Servings:</strong> {recipe.servings}
            </div>
            <div>
              <strong>Difficulty:</strong> {recipe.difficulty}
            </div>
            <div>
              <strong>Category:</strong> {recipe.category}
            </div>
            <div>
              <strong>Cuisine:</strong> {recipe.cuisine}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecipeDetail;