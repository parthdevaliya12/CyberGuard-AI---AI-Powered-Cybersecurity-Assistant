import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Camera, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (profileImage) formData.append('profileImage', profileImage);

      const { data } = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const { data } = await API.put('/auth/change-password', { currentPassword, newPassword });
      localStorage.setItem('token', data.token);
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      <div className="profile-grid">
        {/* Profile Info */}
        <div className="profile-card">
          <h3><User size={18} /> Personal Information</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {(profileImage ? URL.createObjectURL(profileImage) : user?.profileImage) ? (
                  <img src={profileImage ? URL.createObjectURL(profileImage) : user?.profileImage} alt="Profile" />
                ) : (
                  <User size={40} />
                )}
                <label className="avatar-upload-btn">
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} hidden />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user?.role} disabled className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Member Since</label>
              <input type="text" value={new Date(user?.createdAt).toLocaleDateString()} disabled className="input-disabled" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="profile-card">
          <h3><Lock size={18} /> Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              <Lock size={18} /> {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
