import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as orderService from './order.service';

// POST /api/orders
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body, req.user!);
  res.status(201).json(order);
});

// GET /api/orders
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getMyOrders(req.user!);
  res.status(200).json(orders);
});
