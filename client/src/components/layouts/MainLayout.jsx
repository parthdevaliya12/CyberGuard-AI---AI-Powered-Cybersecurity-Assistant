import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
    { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { path: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { path: '/security-checklist', label: 'Security Checklist', icon: CheckSquare },
    { path: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/incidents', label: 'Manage Incidents', icon: AlertTriangle },
    { path: '/admin/knowledge', label: 'Manage Knowledge', icon: BookOpen },
  ];

  const navLinks = user?.role === 'admin' ? [...userLinks, ...adminLinks] : userLinks;

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <Shield size={28} />
            <span>CyberGuard AI</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {user?.role !== 'admin' ? (
            <div className="nav-section">
              <span className="nav-section-title">Main</span>
              {userLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="nav-section">
              <span className="nav-section-title">Administration</span>
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                <User size={18} />
              )}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="navbar-right">
            <Link to="/notifications" className="navbar-icon-btn">
              <Bell size={20} />
            </Link>

            <div className="profile-dropdown-wrapper">
              <button
                className="profile-trigger"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                <div className="navbar-avatar">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <span className="navbar-username">{user?.name}</span>
                <ChevronDown size={14} />
              </button>

              {profileDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/security-checklist"
                    className="dropdown-item"
                    onClick={() => setProfileDropdown(false)}
                  >
                    <Settings size={16} />
                    <span>Security Settings</span>
                  </Link>
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
