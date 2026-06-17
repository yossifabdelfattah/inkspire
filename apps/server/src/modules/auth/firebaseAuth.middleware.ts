import { Request, Response, NextFunction } from 'express';
import admin from '../../config/firebaseAdmin';
import { resolveUserFromAuthHeader } from './user.service';
import { asyncHandler } from '../../utils/asyncHandler';

// Verifies the Firebase ID token and attaches req.user (Mongo user doc + uid)
export const verifyFirebaseToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized — missing token' });
      return;
    }

    if (!admin.apps.length) {
      res.status(503).json({ message: 'Firebase Admin SDK is not configured on the server' });
      return;
    }

    const user = await resolveUserFromAuthHeader(authHeader);

    if (!user) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    req.user = user;
    next();
  }
);

// Attaches req.user when a valid token is present, but never blocks the request.
// Useful for endpoints that personalize results for logged-in users but also
// serve anonymous visitors (e.g. recommendations).
export const attachUserIfPresent = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.user = await resolveUserFromAuthHeader(req.headers.authorization);
    next();
  }
);

// Requires verifyFirebaseToken to have run first
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};
