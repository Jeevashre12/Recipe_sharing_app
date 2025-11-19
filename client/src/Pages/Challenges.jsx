import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Challenges.css';

const Challenges = () => {
  const { backendUrl } = useContext(AppContext);
  const [challenges, setChallenges] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.debug('Challenges: backendUrl=', backendUrl);
    if (!backendUrl) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      try {
        const [allRes, activeRes] = await Promise.all([
          fetch(`${backendUrl}/api/challenges`),
          fetch(`${backendUrl}/api/challenges/active`)
        ]);
        const allJson = await allRes.json().catch(() => null);
        const activeJson = await activeRes.json().catch(() => null);
        console.debug('API /challenges =>', allJson);
        console.debug('API /challenges/active =>', activeJson);

        const list = Array.isArray(allJson)
          ? allJson
          : Array.isArray(allJson?.challenges)
          ? allJson.challenges
          : Array.isArray(allJson?.data)
          ? allJson.data
          : [];

        setChallenges(list);
        setActive(activeJson || null);
      } catch (e) {
        console.error('Failed load challenges', e);
        setError('Failed to load challenges');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [backendUrl]);

  // DEBUG: show raw JSON if no items so you can see response
  const showRaw = !loading && !error && challenges.length === 0 && !active;

  return (
    <div className="challenges-page">
      <header className="challenges-header">
        <h1>Cooking Challenges</h1>
        <p className="sub">Monthly themes — submit your recipes and compete.</p>
      </header>

      {loading && <div className="loading">Loading challenges…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && active && (
        <section className="active-challenge">
          <h2>Active: {active.title}</h2>
          <p className="desc">{active.description}</p>
          <div className="meta">
            <span>
              {active.startAt ? new Date(active.startAt).toLocaleDateString() : ''}
              {active.endAt ? ` — ${new Date(active.endAt).toLocaleDateString()}` : ''}
            </span>
            <Link to={`/challenges/${active._id}`} className="view-link">View / Submit</Link>
          </div>
        </section>
      )}

      <section className="past-challenges">
        <h3>All Challenges</h3>

        {showRaw && (
          <pre style={{ whiteSpace: 'pre-wrap', background:'#fff8f0', padding:12, borderRadius:8, border:'1px solid #efe6df' }}>
            Debug: no challenges found. Response shown below:
            {JSON.stringify({ challenges, active }, null, 2)}
          </pre>
        )}

        <div className="cards">
          {challenges.map(c => (
            <div key={c._id} className="challenge-card">
              <h4>{c.title}</h4>
              <p className="small">{c.description}</p>
              <Link to={`/challenges/${c._id}`} className="view-link">Open</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Challenges;