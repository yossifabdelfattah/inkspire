import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPasswordRequest } from '../services/authService';
import {
  AuthWrapper,
  AuthTitle,
  AuthForm,
  AuthInput,
  AuthButton,
  AuthError,
  AuthSuccess
} from '../styles/AuthStyles';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await resetPasswordRequest(token, password);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthTitle>Reset Password</AuthTitle>
      <AuthForm onSubmit={handleSubmit}>
        {error && <AuthError>{error}</AuthError>}
        {success && <AuthSuccess>{success} Redirecting to login...</AuthSuccess>}
        <AuthInput
          type="password"
          placeholder="New password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </AuthButton>
      </AuthForm>
    </AuthWrapper>
  );
}

export default ResetPassword;