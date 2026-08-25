import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const NotFound = () => (
  <div className="not-found-page">
    <ShieldOff size={80} />
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
  </div>
);

export default NotFound;
