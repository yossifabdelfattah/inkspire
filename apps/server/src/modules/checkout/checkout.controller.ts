import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as checkoutService from './checkout.service';

// POST /api/checkout
export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { order, payment } = await checkoutService.checkout(req.body, req.user!);
  res.status(201).json({ order, payment });
});
