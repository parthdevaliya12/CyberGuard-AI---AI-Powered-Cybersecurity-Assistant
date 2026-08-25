import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { AlertTriangle, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ status: '', category: '', severity: '', search: '' });
  const [loading, setLoading] = useState(true);

  const statuses = ['Open', 'Under Review', 'Resolved', 'Closed'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const categories = ['Phishing', 'Suspicious URL', 'Malware', 'Account Security', 'Social Engineering', 'Data Privacy', 'Other'];

  useEffect(() => { fetchIncidents(); }, [filters, pagination.page]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('page', pagination.page);
      const { data } = await API.get(`/admin/incidents?${params}`);
      setIncidents(data.incidents);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const updateIncident = async (id, updates) => {
    try {
      await API.put(`/admin/incidents/${id}`, updates);
      toast.success('Incident updated');
      fetchIncidents();
    } catch (error) {
      toast.error('Failed to update incident');
    }
  };

  const deleteIncident = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;
    try {
      await API.delete(`/admin/incidents/${id}`);
      toast.success('Incident deleted');
      fetchIncidents();
    } catch (error) {
      toast.error('Failed to delete incident');
    }
  };

  const severityColor = (s) => ({ Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' })[s] || '';

  return (
    <div className="admin-incidents-page">
      <div className="page-header">
        <div>
          <h1>Manage Incidents</h1>
          <p className="page-subtitle">{pagination.total} total incidents</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
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

      {loading ? (
        <div className="page-loading"><p>Loading...</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Reporter</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc._id}>
                  <td className="table-title">{inc.title}</td>
                  <td>{inc.user?.name || 'Unknown'}</td>
                  <td>{inc.category}</td>
                  <td>
                    <select
                      className={`inline-select ${severityColor(inc.severity)}`}
                      value={inc.severity}
                      onChange={(e) => updateIncident(inc._id, { severity: e.target.value })}
                    >
                      {severities.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <select
                      className="inline-select"
                      value={inc.status}
                      onChange={(e) => updateIncident(inc._id, { status: e.target.value })}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(inc.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-danger-icon" onClick={() => deleteIncident(inc._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminIncidents;
