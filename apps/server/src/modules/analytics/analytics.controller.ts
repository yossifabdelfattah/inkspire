import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as analyticsService from './analytics.service';

const parseLimit = (raw: unknown, fallback: number): number =>
  parseInt(raw as string) || fallback;

// GET /api/admin/analytics/searches
export const getTopSearches = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getTopSearches(parseLimit(req.query.limit, 20));
  res.status(200).json(data);
});

// GET /api/admin/analytics/overview
export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getOverview();
  res.status(200).json(data);
});

// GET /api/admin/analytics/sales
export const getSalesOverTime = asyncHandler(async (_req: Request, res: Response) => {
  const data = await analyticsService.getSalesOverTime();
  res.status(200).json(data);
});

// GET /api/admin/analytics/requests
export const getMostRequestedBooks = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getMostRequestedBooks(parseLimit(req.query.limit, 10));
  res.status(200).json(data);
});

// GET /api/admin/analytics/purchases
export const getTopPurchasedBooks = asyncHandler(async (req: Request, res: Response) => {
  const data = await analyticsService.getTopPurchasedBooks(parseLimit(req.query.limit, 10));
  res.status(200).json(data);
});
