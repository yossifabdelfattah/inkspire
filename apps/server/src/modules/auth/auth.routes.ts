import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from './firebaseAuth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { getUserById, updateUserName } from './user.service';

const router = Router();

// GET /api/users/me — returns the MongoDB profile (incl. role) for the authenticated Firebase user
const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.mongoId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(user);
});

// PATCH /api/users/me — allows the authenticated user to update their own display name
const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ message: 'Name is required' });
    return;
  }

  const user = await updateUserName(req.user!.mongoId, name);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(user);
});

router.get('/me', verifyFirebaseToken, getMe);
router.patch('/me', verifyFirebaseToken, updateMe);

export default router;
