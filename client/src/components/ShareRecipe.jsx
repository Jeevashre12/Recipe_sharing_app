import React, { useState } from 'react';
import './ShareRecipe';

const ShareRecipe = ({ recipe, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `${window.location.origin}/recipes/${recipe._id}`;
  
  // Extract YouTube video ID and generate thumbnail URL
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '');
      let videoId = null;
      
      if (host.includes('youtube.com')) {
        videoId = u.searchParams.get('v');
      } else if (host.includes('youtu.be')) {
        videoId = u.pathname.slice(1);
      }
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
      return null;
    } catch (_) {
      return null;
    }
  };
  
  // Format recipe content for sharing
  const formatRecipeContent = () => {
    let content = `🍳 *${recipe.title}*\n\n`;
    
    if (recipe.description) {
      content += `📝 *Description:*\n${recipe.description}\n\n`;
    }
    
    // Add video if available
    if (recipe.videoUrl) {
      const thumbnailUrl = getYouTubeThumbnail(recipe.videoUrl);
      if (thumbnailUrl) {
        content += `🎥 *Video Tutorial:*\n${thumbnailUrl}\n\n`;
      } else {
        content += `🎥 *Video Tutorial:*\n${recipe.videoUrl}\n\n`;
      }
    }
    
    // Add recipe details
    content += `⏱️ *Prep Time:* ${recipe.prepTime} minutes\n`;
    content += `🔥 *Cooking Time:* ${recipe.cookingTime} minutes\n`;
    content += `👥 *Servings:* ${recipe.servings}\n`;
    if (recipe.difficulty) content += `⭐ *Difficulty:* ${recipe.difficulty}\n`;
    if (recipe.cuisine) content += `🌍 *Cuisine:* ${recipe.cuisine}\n`;
    content += `\n`;
    
    // Add ingredients
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      content += `🥘 *Ingredients:*\n`;
      recipe.ingredients.forEach((item, idx) => {
        const ingredient = typeof item === 'string' ? item : `${item.quantity} ${item.unit} ${item.name}`;
        content += `${idx + 1}. ${ingredient}\n`;
      });
      content += `\n`;
    }
    
    // Add instructions
    if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
      content += `👨‍🍳 *Instructions:*\n`;
      recipe.instructions.forEach((step, idx) => {
        const instruction = typeof step === 'string' ? step : step.instruction;
        content += `${idx + 1}. ${instruction}\n`;
      });
      content += `\n`;
    }
    
    // Add dietary tags
    if (Array.isArray(recipe.dietaryTags) && recipe.dietaryTags.length > 0) {
      content += `🏷️ *Tags:* ${recipe.dietaryTags.join(', ')}\n\n`;
    }
    
    // Add author information
    if (recipe.author?.name || recipe.authorName) {
      content += `👨‍🍳 *Recipe by:* ${recipe.author?.name || recipe.authorName}\n\n`;
    }
    
    content += `Enjoy cooking! 🍽️`;
    
    return content;
  };
  
  const shareContent = formatRecipeContent();
  const shareText = `Check out this amazing recipe: ${recipe.title}`;
  const shareDescription = recipe.description ? recipe.description.substring(0, 200) + '...' : '';

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      color: '#25D366',
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareContent)}`;
        window.open(whatsappUrl, '_blank');
      }
    },
    {
      name: 'Gmail',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.455-6.27h.909c.904 0 1.636.732 1.636 1.636z"/>
        </svg>
      ),
      color: '#EA4335',
      action: () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(`Recipe: ${recipe.title}`)}&body=${encodeURIComponent(shareContent)}`;
        window.open(gmailUrl, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#1877F2',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(facebookUrl, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      color: '#1DA1F2',
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`;
        window.open(twitterUrl, '_blank');
      }
    },
    {
      name: 'Copy Recipe',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      ),
      color: '#6B7280',
      action: () => {
        navigator.clipboard.writeText(shareContent).then(() => {
          alert('Recipe content copied to clipboard!');
        }).catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareContent;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Recipe content copied to clipboard!');
        });
      }
    }
  ];

  const toggleShare = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`share-recipe ${className}`}>
      <button 
        className="share-button"
        onClick={toggleShare}
        title="Share Recipe"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="share-overlay" onClick={toggleShare}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-header">
              <h3>Share Recipe</h3>
              <button className="share-close" onClick={toggleShare}>×</button>
            </div>
            <div className="share-content">
              <div className="recipe-preview">
                <h4>🍳 {recipe.title}</h4>
                <div className="recipe-meta-preview">
                  <span>⏱️ {recipe.prepTime + recipe.cookingTime} min</span>
                  <span>👥 {recipe.servings} servings</span>
                  {recipe.difficulty && <span>⭐ {recipe.difficulty}</span>}
                  {recipe.videoUrl && <span>🎥 Video</span>}
                </div>
                <p>{shareDescription}</p>
                {recipe.videoUrl && (
                  <div className="video-preview">
                    <strong>🎥 Video Tutorial:</strong>
                    {getYouTubeThumbnail(recipe.videoUrl) ? (
                      <div 
                        className="video-thumbnail"
                        onClick={() => window.open(recipe.videoUrl, '_blank')}
                        title="Click to watch video"
                      >
                        <img 
                          src={getYouTubeThumbnail(recipe.videoUrl)} 
                          alt="Video thumbnail"
                          className="thumbnail-image"
                        />
                        <div className="play-button">▶️</div>
                      </div>
                    ) : (
                      <p className="video-url">{recipe.videoUrl}</p>
                    )}
                  </div>
                )}
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                  <div className="ingredients-preview">
                    <strong>🥘 Ingredients ({recipe.ingredients.length}):</strong>
                    <p>{recipe.ingredients.slice(0, 3).map(item => 
                      typeof item === 'string' ? item : `${item.quantity} ${item.unit} ${item.name}`
                    ).join(', ')}{recipe.ingredients.length > 3 ? '...' : ''}</p>
                  </div>
                )}
              </div>
              <div className="share-options">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    className="share-option"
                    onClick={option.action}
                    style={{ '--color': option.color }}
                  >
                    <span className="share-icon">{option.icon}</span>
                    <span className="share-name">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareRecipe;
