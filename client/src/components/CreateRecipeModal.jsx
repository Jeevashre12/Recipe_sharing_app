import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreateRecipeModal.css';

const CreateRecipeModal = ({ onClose, onRecipeCreated }) => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: '',
    prepTime: '',
    servings: '',
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: '',
    videoUrl: '',
    dietaryTags: []
  });
  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: '' }
  ]);
  const [instructions, setInstructions] = useState([
    { step: 1, instruction: '' }
  ]);
  

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDietaryChange = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', quantity: '', unit: '' }]);
  };

  const updateIngredient = (index, field, value) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, { 
      step: prev.length + 1, 
      instruction: '' 
    }]);
  };

  const updateInstruction = (index, value) => {
    setInstructions(prev => prev.map((inst, i) => 
      i === index ? { ...inst, instruction: value } : inst
    ));
  };

  const removeInstruction = (index) => {
    setInstructions(prev => prev.filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, step: i + 1 })));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'dietaryTags') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add ingredients and instructions
      submitData.append('ingredients', JSON.stringify(ingredients));
      submitData.append('instructions', JSON.stringify(instructions));

      // No images are appended; images upload disabled

      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/recipes/create`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        toast.success('Recipe created successfully!');
        onRecipeCreated();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-recipe-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Your Recipe</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <input
              type="text"
              name="title"
              placeholder="Recipe Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            
            <textarea
              name="description"
              placeholder="Recipe Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />

            <div className="form-row">
              <input
                type="number"
                name="prepTime"
                placeholder="Prep Time (minutes)"
                value={formData.prepTime}
                onChange={handleInputChange}
                required
              />
              
              <input
                type="number"
                name="cookingTime"
                placeholder="Cooking Time (minutes)"
                value={formData.cookingTime}
                onChange={handleInputChange}
                required
              />
              
              <input
                type="number"
                name="servings"
                placeholder="Servings"
                value={formData.servings}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>

              <input
                type="text"
                name="cuisine"
                placeholder="Cuisine (e.g., Italian, Chinese)"
                value={formData.cuisine}
                onChange={handleInputChange}
                required
              />
            </div>

            <input
              type="url"
              name="videoUrl"
              placeholder="Video URL (YouTube/Vimeo - Optional)"
              value={formData.videoUrl}
              onChange={handleInputChange}
            />
          </div>

          {/* Dietary Tags */}
          <div className="form-section">
            <h3>Dietary Options</h3>
            <div className="dietary-tags">
              {dietaryOptions.map(tag => (
                <label key={tag} className="tag-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.dietaryTags.includes(tag)}
                    onChange={() => handleDietaryChange(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-section">
            <h3>Ingredients</h3>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  required
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="add-btn">
              Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-section">
            <h3>Instructions</h3>
            {instructions.map((instruction, index) => (
              <div key={index} className="instruction-row">
                <span className="step-number">{instruction.step}</span>
                <textarea
                  placeholder={`Step ${instruction.step} instructions`}
                  value={instruction.instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  required
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addInstruction} className="add-btn">
              Add Step
            </button>
          </div>

          {/* Images upload removed by request */}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Share Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;