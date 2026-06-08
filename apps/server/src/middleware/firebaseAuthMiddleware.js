const admin = require('../config/firebaseAdmin');
const User = require('../models/User');

// Verifies the Firebase ID token and attaches req.user (Mongo user doc + uid)
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — missing token' });
  }

  if (!admin.apps.length) {
    return res.status(503).json({ message: 'Firebase Admin SDK is not configured on the server' });
  }

  try {
    const idToken = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        name: decoded.name || decoded.email || 'Unnamed User',
        email: decoded.email,
        firebaseUid: decoded.uid,
        role: 'user',
      });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: user.role,
      mongoId: user._id,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// Requires verifyFirebaseToken to have run first
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { verifyFirebaseToken, requireAdmin };
