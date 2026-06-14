import { createContext } from 'react';
import type { UserProfile } from '../types/auth';

export interface AuthContextType {
  user: UserProfile | null;
  authLoading: boolean;
  actionLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
