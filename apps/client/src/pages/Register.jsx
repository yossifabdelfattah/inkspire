import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerRequest } from '../services/authService';
import {
  AuthWrapper,
  AuthTitle,
  AuthForm,
  AuthInput,
  AuthButton,
  AuthError,
  AuthLink
} from '../styles/AuthStyles';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerRequest(name, email, password);
      login(res.data);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthTitle>Create Account</AuthTitle>
      <AuthForm onSubmit={handleSubmit}>
        {error && <AuthError>{error}</AuthError>}
        <AuthInput
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthButton type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </AuthButton>
      </AuthForm>
      <AuthLink>
        Already have an account? <Link to="/login">Login</Link>
      </AuthLink>
    </AuthWrapper>
  );
}

export default Register;