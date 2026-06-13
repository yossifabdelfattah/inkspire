import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode, FC } from 'react';
import { AuthContext } from './authContext';

export type { AuthContextType } from './authContext';
import {
  loginWithEmailPassword,
  logoutUser,
  registerWithEmailPassword,
  signInWithGoogle,
  subscribeToAuthState,
} from '../services/authService';
import { getMyProfile, updateMyProfile } from '../services/userService';
import type { UserProfile } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setRoleLoading(true);
        getMyProfile()
          .then((profile) => {
            setUser((prev) => (prev ? { ...prev, role: profile.role } : prev));
          })
          .catch(() => {
            // Role stays undefined if the backend profile can't be fetched
          })
          .finally(() => {
            setRoleLoading(false);
          });
      } else {
        setRoleLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginWithEmailPassword(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      await registerWithEmailPassword(email, password, name);

      if (name) {
        try {
          await updateMyProfile({ name });
        } catch {
          // The Mongo profile will still be created with a fallback name on
          // the next authenticated request; non-fatal if this sync fails.
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      setLoading(false);
    }
  }, []);

  const googleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (name: string) => {
    const profile = await updateMyProfile({ name });
    setUser((prev) => (prev ? { ...prev, name: profile.name } : prev));
  }, []);

  const value = useMemo(
    () => ({ user, loading, roleLoading, login, register, logout, signInWithGoogle: googleSignIn, updateProfile }),
    [user, loading, roleLoading, login, register, logout, googleSignIn, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
