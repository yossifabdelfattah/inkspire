export interface UserProfile {
  _id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
}
