import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import ShareRecipe from './ShareRecipe';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onClick }) => {
  const { isLoggedIn, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(Array.isArray(recipe.likes) ? recipe.likes.length : 0);
  const [avgRating, setAvgRating] = useState(Number(recipe.avgRating || 0));
  const [totalReviews, setTotalReviews] = useState(Number(recipe.totalReviews || 0));
  const [liked, setLiked] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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
        const id = u.pathname.slice(1);
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (host.includes('vimeo.com')) {
        const id = u.pathname.split('/').filter(Boolean)[0];
        return id ? `https://player.vimeo.com/video/${id}` : null;
      }
      return null;
    } catch (_) {
      return null;
    }
  };

  const handleNavigate = () => {
    if (onClick) return onClick();
    try {
      navigate(`/recipes/${recipe._id}`);
    } catch (_) {}
  };

  return (
    <div className="recipe-card" onClick={handleNavigate}>
      {recipe.videoUrl && (
        <div className="recipe-video">
          {getEmbedUrl(recipe.videoUrl) ? (
            <iframe
              src={getEmbedUrl(recipe.videoUrl)}
              title="Recipe video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video src={recipe.videoUrl} controls preload="metadata" />
          )}
        </div>
      )}

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">
          {recipe.description.length > 100
            ? `${recipe.description.substring(0, 100)}...`
            : recipe.description}
        </p>

        <div className="recipe-meta">
          <div className="time-info">
            <span>🕒 {formatTime(recipe.cookingTime + recipe.prepTime)}</span>
            <span>👥 {recipe.servings} servings</span>
          </div>
          <div className="recipe-stats">
            <span className="rating">⭐ {Math.round(avgRating)} ({totalReviews})</span>
            <span className="likes">❤️ {likesCount}</span>
          </div>
        </div>

        <div className="recipe-tags">
          {recipe.dietaryTags.slice(0, 2).map(tag => (
            <span key={tag} className="dietary-tag">{tag}</span>
          ))}
        </div>

        <div className="recipe-author">By {recipe.author?.name || recipe.authorName || 'Unknown'}</div>

        <div className="card-actions">
          <ShareRecipe recipe={recipe} className="small" />
          {isLoggedIn && (
            <>
              <div className={`like-group ${liked ? 'liked' : ''}`} onClick={async (e) => {
                e.stopPropagation();
                if (liked) return; // prevent multiple likes
                // Optimistic UI update: single-like
                setLiked(true);
                setLikesCount(prev => prev + 1);
                try {
                  const { data } = await axios.post(`${backendUrl}/api/recipes/${recipe._id}/like`, {}, { withCredentials: true });
                  if (data.success) {
                    setLikesCount(Number(data.likesCount || 0));
                  }
                } catch (err) {
                  // Revert on error
                  setLiked(false);
                  setLikesCount(prev => Math.max(0, prev - 1));
                }
              }}>
                <span className="like-emoji" role="button" aria-label="like">❤️</span>
                <span className="likes-count">{likesCount}</span>
              </div>
              <div className="rating-group">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= selectedRating ? 'filled' : ''}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      // Optimistic star fill
                      setSelectedRating(star);
                      try {
                        const { data } = await axios.post(`${backendUrl}/api/recipes/${recipe._id}/review`, { rating: star }, { withCredentials: true });
                        if (data.success) {
                          if (typeof data.avgRating !== 'undefined') {
                            setAvgRating(Number(data.avgRating));
                          }
                          if (typeof data.totalReviews !== 'undefined') {
                            setTotalReviews(Number(data.totalReviews));
                          }
                        }
                      } catch (err) {}
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;