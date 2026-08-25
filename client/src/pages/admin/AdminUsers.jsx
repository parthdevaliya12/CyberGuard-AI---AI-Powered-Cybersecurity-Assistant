import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Users, User, Shield } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/admin/users');
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="page-loading"><p>Loading users...</p></div>;

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-cell-avatar">
                      {u.profileImage ? <img src={u.profileImage} alt={u.name} /> : <User size={16} />}
                    </div>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-critical' : 'badge-low'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
