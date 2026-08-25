import { useState, useEffect } from 'react';
import API from '../../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Users, AlertTriangle, ShieldCheck, ShieldAlert, Activity, TrendingUp,
} from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#22c55e', '#06b6d4'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page-loading"><p>Loading admin dashboard...</p></div>;

  const categoryData = stats?.incidentsByCategory?.map((c) => ({ name: c._id, value: c.count })) || [];
  const severityData = stats?.incidentsBySeverity?.map((s) => ({ name: s._id, value: s.count })) || [];

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">System overview and analytics</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card stat-open">
          <div className="stat-icon"><Activity size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalIncidents || 0}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-icon"><AlertTriangle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.openIncidents || 0}</span>
            <span className="stat-label">Open Incidents</span>
          </div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-icon"><ShieldCheck size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.resolvedIncidents || 0}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
        <div className="stat-card stat-high">
          <div className="stat-icon"><ShieldAlert size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.highRiskIncidents || 0}</span>
            <span className="stat-label">High Risk</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Incidents by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="chart-empty">No data available</p>}
        </div>

        <div className="chart-card">
          <h3>Incidents by Severity</h3>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {severityData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="chart-empty">No data available</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
