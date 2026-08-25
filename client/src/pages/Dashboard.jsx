import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Activity,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, highRisk: 0 });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [securityScore, setSecurityScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, convRes, scoreRes] = await Promise.all([
          API.get('/incidents/stats/me'),
          API.get('/conversations'),
          API.get('/security/score'),
        ]);
        setStats(statsRes.data.stats);
        setRecentIncidents(statsRes.data.recentIncidents);
        setConversations(convRes.data.conversations?.slice(0, 5) || []);
        setSecurityScore(scoreRes.data);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const severityColor = (severity) => {
    const colors = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' };
    return colors[severity] || 'badge-low';
  };

  const statusColor = (status) => {
    const colors = { Open: 'badge-open', 'Under Review': 'badge-review', Resolved: 'badge-resolved', Closed: 'badge-closed' };
    return colors[status] || 'badge-open';
  };

  if (loading) {
    return <div className="page-loading"><Activity className="spin" size={32} /><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your security posture</p>
        </div>
        <Link to="/assistant" className="btn btn-primary">
          <MessageSquare size={18} />
          Chat with AI
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
        </div>

        <div className="stat-card stat-open">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open Incidents</span>
          </div>
        </div>

        <div className="stat-card stat-resolved">
          <div className="stat-icon">
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>

        <div className="stat-card stat-high">
          <div className="stat-icon">
            <ShieldAlert size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.highRisk}</span>
            <span className="stat-label">High Risk</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Security Score */}
        {securityScore && (
          <div className="dashboard-card security-score-card">
            <div className="card-header">
              <h3><TrendingUp size={18} /> Security Score</h3>
            </div>
            <div className="score-display">
              <div className="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={securityScore.score >= 70 ? 'var(--success)' : securityScore.score >= 40 ? 'var(--warning)' : 'var(--danger)'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${securityScore.score * 2.51} 251`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="score-value">{securityScore.score}</span>
              </div>
              <span className="score-max">/ {securityScore.maxScore}</span>
            </div>
            {securityScore.recommendations?.length > 0 && (
              <div className="score-recommendations">
                <p className="recommendations-title">Improve your score:</p>
                {securityScore.recommendations.slice(0, 3).map((rec, i) => (
                  <span key={i} className="recommendation-item">• {rec}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Incidents */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><AlertTriangle size={18} /> Recent Incidents</h3>
            <Link to="/incidents" className="card-link">View all <ArrowRight size={14} /></Link>
          </div>
          {recentIncidents.length === 0 ? (
            <div className="empty-state-small">
              <p>No incidents reported yet</p>
              <Link to="/incidents" className="btn btn-sm btn-outline">Report Incident</Link>
            </div>
          ) : (
            <div className="incident-list-compact">
              {recentIncidents.map((incident) => (
                <Link key={incident._id} to={`/incidents/${incident._id}`} className="incident-item-compact">
                  <div className="incident-item-info">
                    <span className="incident-item-title">{incident.title}</span>
                    <span className="incident-item-date">
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="incident-item-badges">
                    <span className={`badge ${severityColor(incident.severity)}`}>{incident.severity}</span>
                    <span className={`badge ${statusColor(incident.status)}`}>{incident.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3><MessageSquare size={18} /> Recent Conversations</h3>
            <Link to="/assistant" className="card-link">View all <ArrowRight size={14} /></Link>
          </div>
          {conversations.length === 0 ? (
            <div className="empty-state-small">
              <p>No conversations yet</p>
              <Link to="/assistant" className="btn btn-sm btn-outline">Start Chat</Link>
            </div>
          ) : (
            <div className="conversation-list-compact">
              {conversations.map((conv) => (
                <Link key={conv._id} to="/assistant" className="conversation-item-compact">
                  <MessageSquare size={16} />
                  <div className="conversation-item-info">
                    <span className="conversation-item-title">{conv.title}</span>
                    <span className="conversation-item-date">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
