import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ArrowLeft, AlertTriangle, Clock, Shield, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const { data } = await API.get(`/incidents/${id}`);
        setIncident(data.incident);
      } catch (error) {
        toast.error('Failed to load incident');
        navigate('/incidents');
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleClose = async () => {
    try {
      const { data } = await API.put(`/incidents/${id}`, { status: 'Closed' });
      setIncident(data.incident);
      toast.success('Incident closed');
    } catch (error) {
      toast.error('Failed to close incident');
    }
  };

  const severityColor = (s) => ({ Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Critical: 'badge-critical' })[s] || '';
  const statusColor = (s) => ({ Open: 'badge-open', 'Under Review': 'badge-review', Resolved: 'badge-resolved', Closed: 'badge-closed' })[s] || '';

  if (loading) return <div className="page-loading"><p>Loading...</p></div>;
  if (!incident) return null;

  return (
    <div className="incident-details-page">
      <button className="btn btn-outline btn-back" onClick={() => navigate('/incidents')}>
        <ArrowLeft size={18} /> Back to Incidents
      </button>

      <div className="incident-detail-card">
        <div className="incident-detail-header">
          <div>
            <h1>{incident.title}</h1>
            <div className="incident-meta">
              <span className={`badge ${severityColor(incident.severity)}`}>{incident.severity}</span>
              <span className={`badge ${statusColor(incident.status)}`}>{incident.status}</span>
              <span className="meta-category">{incident.category}</span>
            </div>
          </div>
          {incident.status === 'Open' && (
            <button className="btn btn-outline btn-danger" onClick={handleClose}>
              Close Incident
            </button>
          )}
        </div>

        <div className="incident-detail-body">
          <div className="detail-section">
            <h3><Shield size={18} /> Description</h3>
            <p>{incident.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{incident.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Severity</span>
              <span className={`badge ${severityColor(incident.severity)}`}>{incident.severity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`badge ${statusColor(incident.status)}`}>{incident.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Reported</span>
              <span className="detail-value">{new Date(incident.createdAt).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">{new Date(incident.updatedAt).toLocaleString()}</span>
            </div>
            {incident.user && (
              <div className="detail-item">
                <span className="detail-label">Reported By</span>
                <span className="detail-value">{incident.user.name || 'You'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
