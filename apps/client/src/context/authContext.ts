import { createContext } from 'react';
import type { UserProfile } from '../types/auth';

export interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  setUser: (userData: UserProfile | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
