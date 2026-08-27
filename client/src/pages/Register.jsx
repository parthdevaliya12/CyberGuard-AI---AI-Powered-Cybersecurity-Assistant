import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Eye, EyeOff, Lock, Mail, User, Zap, ShieldCheck, Scan, Activity } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully! Welcome aboard.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-effects">
        <div className="cyber-grid"></div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo-wrapper">
              <Shield size={40} />
              <div className="auth-logo-ring"></div>
            </div>
            <h1>CyberGuard AI</h1>
            <p>AI-Powered Cybersecurity Assistant</p>
          </div>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="feature-icon-box"><Zap size={16} /></div>
              <div>
                <span className="feature-title">AI Threat Analysis</span>
                <span className="feature-desc">Instant URL scanning & risk assessment</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon-box"><ShieldCheck size={16} /></div>
              <div>
                <span className="feature-title">Incident Management</span>
                <span className="feature-desc">Track and resolve security incidents</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon-box"><Scan size={16} /></div>
              <div>
                <span className="feature-title">Knowledge Base</span>
                <span className="feature-desc">Learn about cybersecurity threats</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon-box"><Activity size={16} /></div>
              <div>
                <span className="feature-title">Security Scoring</span>
                <span className="feature-desc">Track your personal security posture</span>
              </div>
            </div>
          </div>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-value">24/7</span>
              <span className="auth-stat-label">AI Protection</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-value">100+</span>
              <span className="auth-stat-label">Threat Types</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-value">Real-time</span>
              <span className="auth-stat-label">Analysis</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2>Create Account</h2>
              <p className="auth-subtitle">Join CyberGuard AI and stay protected</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-auth" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="btn-spinner"></span>
                    Creating account...
                  </span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Create Secure Account
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <p className="auth-switch">
              <Link to="/login" className="auth-switch-link">
                Sign in instead <span>→</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
