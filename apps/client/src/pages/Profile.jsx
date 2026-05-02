import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserRequest, updateUserRequest, deleteUserRequest } from '../services/userService';
import {
  ProfileWrapper,
  ProfileTitle,
  ProfileForm,
  ProfileInput,
  ProfileButton,
  DeleteButton,
  ProfileMessage
} from '../styles/ProfileStyles';

function Profile() {
  const { logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserRequest().then((res) => {
      setName(res.data.name);
      setEmail(res.data.email);
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const payload = { name, email };
      if (password) payload.password = password;
      const res = await updateUserRequest(payload);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Profile updated successfully');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await deleteUserRequest();
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Delete failed.');
    }
  };

  return (
    <ProfileWrapper>
      <ProfileTitle>My Profile</ProfileTitle>
      <ProfileForm onSubmit={handleUpdate}>
        {message && <ProfileMessage>{message}</ProfileMessage>}
        {error && <ProfileMessage $error>{error}</ProfileMessage>}
        <ProfileInput
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ProfileInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ProfileInput
          type="password"
          placeholder="New password (leave blank to keep current)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ProfileButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </ProfileButton>
      </ProfileForm>
      <DeleteButton type="button" onClick={handleDelete}>
        Delete My Account
      </DeleteButton>
    </ProfileWrapper>
  );
}

export default Profile;