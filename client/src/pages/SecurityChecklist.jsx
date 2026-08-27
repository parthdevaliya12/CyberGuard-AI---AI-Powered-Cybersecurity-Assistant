import { useState, useEffect } from 'react';
import API from '../api/axios';
import { CheckSquare, Square, Shield, TrendingUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SecurityChecklist = () => {
  const toast = useToast();
  const [checklist, setChecklist] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [checkRes, scoreRes] = await Promise.all([
        API.get('/security/checklist'),
        API.get('/security/score'),
      ]);
      setChecklist(checkRes.data.checklist);
      setScore(scoreRes.data);
    } catch (error) {
      console.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (key, completed) => {
    try {
      const { data } = await API.put('/security/checklist', { key, completed: !completed });
      setChecklist(data.checklist);
      // Refresh score
      const scoreRes = await API.get('/security/score');
      setScore(scoreRes.data);
      toast.success(completed ? 'Item unchecked' : 'Item completed!');
    } catch (error) {
      toast.error('Failed to update checklist');
    }
  };

  if (loading) return <div className="page-loading"><p>Loading...</p></div>;

  const completedCount = checklist?.items.filter((i) => i.completed).length || 0;
  const totalItems = checklist?.items.length || 0;

  return (
    <div className="checklist-page">
      <div className="page-header">
        <div>
          <h1>Security Checklist</h1>
          <p className="page-subtitle">Complete these steps to improve your security posture</p>
        </div>
      </div>

      <div className="checklist-layout">
        {/* Score Card */}
        {score && (
          <div className="score-card-large">
            <div className="score-header">
              <TrendingUp size={22} />
              <h3>Security Score</h3>
            </div>
            <div className="score-display-large">
              <div className="score-circle-large">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={score.score >= 70 ? 'var(--success)' : score.score >= 40 ? 'var(--warning)' : 'var(--danger)'}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${score.score * 3.14} 314`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className="score-number">{score.score}</span>
              </div>
              <span className="score-label">out of {score.maxScore}</span>
            </div>

            <div className="score-breakdown">
              {score.breakdown?.map((item, i) => (
                <div key={i} className={`breakdown-item ${item.earned ? 'earned' : ''}`}>
                  <span>{item.earned ? '✅' : '⬜'} {item.label}</span>
                  <span className="breakdown-points">+{item.earnedPoints || item.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className="checklist-card">
          <div className="checklist-progress">
            <div className="progress-text">
              <span>{completedCount} of {totalItems} completed</span>
              <span>{totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${totalItems > 0 ? (completedCount / totalItems) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="checklist-items">
            {checklist?.items.map((item) => (
              <div
                key={item.key}
                className={`checklist-item ${item.completed ? 'completed' : ''}`}
                onClick={() => toggleItem(item.key, item.completed)}
              >
                {item.completed ? (
                  <CheckSquare size={22} className="check-icon checked" />
                ) : (
                  <Square size={22} className="check-icon" />
                )}
                <span className="checklist-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityChecklist;
