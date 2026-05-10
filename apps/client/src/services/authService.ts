import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebase';
import type { UserProfile } from '../types/auth';

function toUserProfile(user: User): UserProfile {
  return {
    _id: user.uid,
    email: user.email ?? '',
    name: user.displayName ?? undefined,
  };
}

export async function loginWithEmailPassword(email: string, password: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return toUserProfile(credential.user);
}

export async function registerWithEmailPassword(email: string, password: string): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return toUserProfile(credential.user);
}

export async function signInWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(firebaseAuth, provider);
  return toUserProfile(credential.user);
}

export async function logoutUser(): Promise<void> {
  await signOut(firebaseAuth);
}

export function subscribeToAuthState(onChange: (user: UserProfile | null) => void): () => void {
  return onAuthStateChanged(firebaseAuth, (user) => {
    onChange(user ? toUserProfile(user) : null);
  });
}
