import admin from '../../config/firebaseAdmin';
import { User } from './user.model';
import { AuthUser } from './user.types';

// Verifies a Firebase ID token and resolves/creates the corresponding Mongo user.
// Returns null if the token is missing, invalid, or the SDK isn't configured.
export const resolveUserFromAuthHeader = async (
  authHeader?: string
): Promise<AuthUser | null> => {
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
      email: decoded.email as string,
      name: user.name,
      role: user.role,
      mongoId: user._id as AuthUser['mongoId'],
    };
  } catch {
    return null;
  }
};

export const getUserById = (mongoId: AuthUser['mongoId']) =>
  User.findById(mongoId).select('name email role firebaseUid');

export const updateUserName = (mongoId: AuthUser['mongoId'], name: string) =>
  User.findByIdAndUpdate(
    mongoId,
    { name: name.trim() },
    { new: true, runValidators: true }
  ).select('name email role firebaseUid');
