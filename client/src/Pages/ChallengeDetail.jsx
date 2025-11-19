import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SubmitToChallengeModal from '../components/SubmitToChallengeModal';
import './Challenges.css';

const ChallengeDetail = () => {
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await fetch(`${backendUrl}/api/challenges/${id}`);
      const json = await res.json();
      setData(json);
    };
    load();
  }, [backendUrl, id]);

  if (!data) return <div className="loading">Loading…</div>;
  const { challenge, submissions } = data;

  return (
    <div className="challenge-detail-page">
      <header className="detail-header">
        <h1>{challenge.title}</h1>
        <p>{challenge.description}</p>
        <div className="actions">
          <button onClick={() => setShowModal(true)}>Submit Recipe</button>
        </div>
      </header>

      <section className="submissions">
        <h3>Submissions</h3>
        <div className="submission-grid">
          {submissions.length === 0 && <div>No submissions yet.</div>}
          {submissions.map(s => (
            <div key={s._id} className="submission-card">
              <div className="title">{s.snapshot?.title || 'Recipe'}</div>
              <div className="author">{s.userId?.name || s.userId}</div>
              <div className="notes">{s.notes}</div>
            </div>
          ))}
        </div>
      </section>

      {showModal && <SubmitToChallengeModal challengeId={challenge._id} onClose={() => setShowModal(false)} onSubmitted={() => {
        // refresh submissions
        fetch(`${backendUrl}/api/challenges/${id}`).then(r => r.json()).then(j => setData(j));
        setShowModal(false);
      }} />}
    </div>
  );
};

export default ChallengeDetail;