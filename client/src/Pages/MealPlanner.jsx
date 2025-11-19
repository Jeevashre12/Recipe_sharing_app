import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import generateShoppingList from '../utils/generateShoppingList';
import './MealPlanner.css';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SLOTS = ['Breakfast','Lunch','Dinner'];

const MealPlanner = () => {
  const { backendUrl } = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});
  const [plan, setPlan] = useState(() => {
    const p = {};
    DAYS.forEach(d => { p[d] = { Breakfast: null, Lunch: null, Dinner: null }; });
    return p;
  });
  const [shopping, setShopping] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/recipes/list`);
        const data = await res.json();

        // normalize response to an array
        const recipesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.recipes)
          ? data.recipes
          : Array.isArray(data.data)
          ? data.data
          : [];

        // debug if shape is unexpected
        if (!recipesArray.length && (data && typeof data === 'object')) {
          console.debug('MealPlanner: recipes response shape', data);
        }

        setRecipes(recipesArray);
        const map = {};
        recipesArray.forEach(r => { if (r?._id) map[r._id] = r; });
        setRecipesMap(map);
      } catch (e) {
        console.error('Failed to load recipes', e);
        setRecipes([]); setRecipesMap({});
      }
    };
    fetchRecipes();
  }, [backendUrl]);

  const assignRecipe = (day, slot, recipeId) => {
    setPlan(prev => ({ ...prev, [day]: { ...prev[day], [slot]: recipeId || null } }));
  };

  const onGenerate = () => {
    const list = generateShoppingList(plan, recipesMap);
    setShopping(list);
  };

  const onSave = async () => {
    try {
      await fetch(`${backendUrl}/api/meal-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name || 'Weekly Plan', plan })
      });
      alert('Meal plan saved.');
    } catch (e) {
      alert('Save failed.');
    }
  };

  return (
    <div className="meal-page">
      <h2>Weekly Meal Planner</h2>
      <p className="muted">Pick recipes for each day and generate a shopping list.</p>

      <div className="planner-grid">
        <div className="planner-header">
          <div className="slot-col">Day / Meal</div>
          {DAYS.map(d => <div key={d} className="day-col">{d}</div>)}
        </div>

        {SLOTS.map(slot => (
          <div className="planner-row" key={slot}>
            <div className="slot-col">{slot}</div>
            {DAYS.map(day => (
              <div className="day-col" key={day}>
                <select value={plan[day][slot] || ''} onChange={e => assignRecipe(day, slot, e.target.value || null)}>
                  <option value="">— choose recipe —</option>
                  {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                </select>
                {plan[day][slot] && (
                  <div className="chosen">{recipesMap[plan[day][slot]]?.title}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="planner-actions">
        <input placeholder="Plan name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={onGenerate}>Generate Shopping List</button>
        <button onClick={onSave}>Save Plan</button>
      </div>

      {shopping.length > 0 && (
        <div className="shopping-list">
          <h3>Shopping List</h3>
          <ul>
            {shopping.map(item => (
              <li key={item.key}>{item.name} — {item.total}{item.unit ? ` ${item.unit}` : ''}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;