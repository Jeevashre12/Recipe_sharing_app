import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../pages/Challenges.css';

const SubmitToChallengeModal = ({ challengeId, onClose, onSubmitted }) => {
  const { backendUrl } = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${backendUrl}/api/recipes/list`);
        const data = await r.json();
        setRecipes(Array.isArray(data) ? data : (data?.recipes || []));
      } catch (e) { setRecipes([]); }
    };
    load();
  }, [backendUrl]);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipeId || null, notes })
      });
      const json = await res.json();
      if (res.ok) onSubmitted && onSubmitted(json);
      else alert(json?.message || 'Submit failed');
    } catch (e) { alert('Submit failed'); }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Submit to challenge</h3>
        <label>Choose one of your recipes</label>
        <select value={recipeId} onChange={e => setRecipeId(e.target.value)}>
          <option value="">-- select recipe --</option>
          {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
        </select>
        <label>Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
        <div className="modal-actions">
          <button onClick={onClose} className="secondary">Cancel</button>
          <button onClick={submit} disabled={loading}>{loading ? 'Submitting…' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );
};

export default SubmitToChallengeModal;