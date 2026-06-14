import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Loader, Alert, Divider } from '@mantine/core';
import * as S from './Register.styled';
import { useAuth } from '../context/useAuth';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, signInWithGoogle, authLoading, actionLoading, user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim() || !email || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      await register(email, password, name);
      void navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      void navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  };

  // Redirect authenticated users away from register page when already signed in
  useEffect(() => {
    if (!authLoading && user) {
      void navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate, redirectTo]);

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
          <S.NameRow>
            <TextInput
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              required
              aria-required
            />

            <TextInput
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              required
              aria-required
            />
          </S.NameRow>

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
            mt="sm"
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
            <Button type="submit" disabled={actionLoading} aria-disabled={actionLoading}>
              {actionLoading ? <Loader size="xs" /> : 'Create account'}
            </Button>
            <Button type="button" variant="default" onClick={() => { void handleGoogle(); }} disabled={actionLoading} aria-disabled={actionLoading}>
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

