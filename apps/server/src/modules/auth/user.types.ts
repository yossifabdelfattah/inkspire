import { Types } from 'mongoose';

export type UserRole = 'user' | 'admin';

// Shape attached to req.user by the Firebase auth middleware.
export interface AuthUser {
  uid: string;
  mongoId: Types.ObjectId | string;
  email: string;
  name?: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser | null;
    }
  }
}

export {};
