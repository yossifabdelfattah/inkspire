import { useState } from 'react';
import { forgotPasswordRequest } from '../services/authService';
import {
  AuthWrapper,
  AuthTitle,
  AuthForm,
  AuthInput,
  AuthButton,
  AuthError,
  AuthSuccess,
  AuthLink
} from '../styles/AuthStyles';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await forgotPasswordRequest(email);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthTitle>Forgot Password</AuthTitle>
      <AuthForm onSubmit={handleSubmit}>
        {error && <AuthError>{error}</AuthError>}
        {success && <AuthSuccess>{success}</AuthSuccess>}
        <AuthInput
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </AuthButton>
      </AuthForm>
      <AuthLink>
        <Link to="/login">Back to Login</Link>
      </AuthLink>
    </AuthWrapper>
  );
}

export default ForgotPassword;