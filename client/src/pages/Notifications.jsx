import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Bell, Check, CheckCheck, AlertTriangle, Shield, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'incident_created': return <AlertTriangle size={18} />;
      case 'incident_resolved': return <Shield size={18} />;
      case 'status_change': return <Info size={18} />;
      default: return <Bell size={18} />;
    }
  };

  if (loading) return <div className="page-loading"><p>Loading notifications...</p></div>;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllAsRead}>
            <CheckCheck size={18} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${notif.read ? '' : 'unread'}`}
              onClick={() => {
                if (!notif.read) markAsRead(notif._id);
                if (notif.relatedIncident) navigate(`/incidents/${notif.relatedIncident._id || notif.relatedIncident}`);
              }}
            >
              <div className="notification-icon">{getIcon(notif.type)}</div>
              <div className="notification-content">
                <span className="notification-title">{notif.title}</span>
                <p className="notification-message">{notif.message}</p>
                <span className="notification-time">{new Date(notif.createdAt).toLocaleString()}</span>
              </div>
              {!notif.read && <span className="unread-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
