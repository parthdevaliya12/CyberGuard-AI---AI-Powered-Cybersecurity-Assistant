import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Incidents = () => {
  const toast = useToast();
  const [incidents, setIncidents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ status: '', category: '', severity: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '', description: '', category: 'Phishing', severity: 'Medium',
  });
  const navigate = useNavigate();

  const categories = ['Phishing', 'Suspicious URL', 'Malware', 'Account Security', 'Social Engineering', 'Data Privacy', 'Other'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Open', 'Under Review', 'Resolved', 'Closed'];

  useEffect(() => { fetchIncidents(); }, [filters, pagination.page]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.search) params.set('search', filters.search);
      params.set('page', pagination.page);
      const { data } = await API.get(`/incidents?${params}`);
      setIncidents(data.incidents);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/incidents', newIncident);
      toast.success('Incident created successfully!');
      setShowCreate(false);
      setNewIncident({ title: '', description: '', category: 'Phishing', severity: 'Medium' });
      fetchIncidents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create incident');
    }
  };

  const severityColor = (s) => ({ Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' })[s] || '';
  const statusColor = (s) => ({ Open: 'badge-open', 'Under Review': 'badge-review', Resolved: 'badge-resolved', Closed: 'badge-closed' })[s] || '';

  return (
    <div className="incidents-page">
      <div className="page-header">
        <div>
          <h1>Incidents</h1>
          <p className="page-subtitle">Manage your security incidents</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Report Incident
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search incidents..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.severity} onChange={(e) => setFilters({ ...filters, severity: e.target.value })}>
          <option value="">All Severity</option>
          {severities.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Incidents Table */}
      {loading ? (
        <div className="page-loading"><p>Loading incidents...</p></div>
      ) : incidents.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle size={48} />
          <h3>No incidents found</h3>
          <p>Create your first incident report to get started.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} /> Report Incident
          </button>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc._id} onClick={() => navigate(`/incidents/${inc._id}`)} className="table-row-clickable">
                    <td className="table-title">{inc.title}</td>
                    <td>{inc.category}</td>
                    <td><span className={`badge ${severityColor(inc.severity)}`}>{inc.severity}</span></td>
                    <td><span className={`badge ${statusColor(inc.status)}`}>{inc.status}</span></td>
                    <td>{new Date(inc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-sm btn-outline"
                disabled={pagination.page <= 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn btn-sm btn-outline"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Incident Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Report Incident</h2>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={newIncident.title} onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })} placeholder="Brief incident title" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newIncident.description} onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })} placeholder="Describe the incident in detail..." rows={4} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={newIncident.category} onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Severity</label>
                  <select value={newIncident.severity} onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}>
                    {severities.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Incident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
