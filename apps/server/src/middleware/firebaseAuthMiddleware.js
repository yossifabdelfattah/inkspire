const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

// Verifies a Firebase ID token and resolves/creates the corresponding Mongo user.
// Returns null if the token is missing, invalid, or the SDK isn't configured.
const resolveUserFromAuthHeader = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ') || !admin.apps.length) {
    return null;
  }

  try {
    const idToken = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user && decoded.email) {
      // Link an existing account (e.g. created via the legacy email/password flow) to this Firebase UID
      user = await User.findOne({ email: decoded.email });
      if (user && !user.firebaseUid) {
        user.firebaseUid = decoded.uid;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        name: decoded.name || decoded.email || 'Unnamed User',
        email: decoded.email,
        firebaseUid: decoded.uid,
        role: 'user',
      });
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      role: user.role,
      mongoId: user._id,
    };
  } catch {
    return null;
  }
};

// Verifies the Firebase ID token and attaches req.user (Mongo user doc + uid)
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — missing token' });
  }

  if (!admin.apps.length) {
    return res.status(503).json({ message: 'Firebase Admin SDK is not configured on the server' });
  }

  const user = await resolveUserFromAuthHeader(authHeader);

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  next();
};

// Attaches req.user when a valid token is present, but never blocks the request.
// Useful for endpoints that personalize results for logged-in users but also
// serve anonymous visitors (e.g. recommendations).
const attachUserIfPresent = async (req, _res, next) => {
  req.user = await resolveUserFromAuthHeader(req.headers.authorization);
  next();
};

// Requires verifyFirebaseToken to have run first
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { verifyFirebaseToken, requireAdmin, attachUserIfPresent };
