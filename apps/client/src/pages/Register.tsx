import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Loader, Alert, Divider } from '@mantine/core';
import * as S from './Register.styled';
import { useAuth } from '../context/useAuth';

function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // Placeholder: integrate Firebase createUserWithEmailAndPassword here
      await new Promise((res) => setTimeout(res, 700));
      auth?.login?.({ _id: 'new-demo', email });
      void navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Registration failed.');
      setError(msg ?? 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // Placeholder for Google OAuth integration
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      auth?.login?.({ _id: 'google-demo', email: 'google@demo.com' });
      void navigate('/');
    }, 800);
  };

  return (
    <S.Page role="main">
      <S.Card aria-labelledby="register-title">
        <S.Header>
          <S.Title id="register-title">Create your Inkspire account</S.Title>
          <S.Subtitle>Create an account to save favorites and checkout faster.</S.Subtitle>
        </S.Header>

        {error && (
          <Alert title="Registration error" color="red">
            {error}
          </Alert>
        )}

        <form onSubmit={(e) => { void handleSubmit(e); }} aria-describedby={error ? 'register-error' : undefined}>
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            aria-required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            aria-required
            mt="sm"
          />

          <PasswordInput
            id="confirm"
            name="confirm"
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.currentTarget.value)}
            required
            aria-required
            mt="sm"
          />

          <S.Actions>
            <Button type="submit" disabled={loading} aria-disabled={loading}>
              {loading ? <Loader size="xs" /> : 'Create account'}
            </Button>
            <Button variant="default" onClick={handleGoogle} disabled={loading} aria-disabled={loading}>
              Continue with Google
            </Button>
          </S.Actions>
        </form>

        <Divider my="sm" />

        <S.Footer>
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </S.Footer>
      </S.Card>
    </S.Page>
  );
}

export default Register;

