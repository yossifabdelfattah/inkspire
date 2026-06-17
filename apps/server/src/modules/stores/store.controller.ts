import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getStoresForBook } from './store.service';

// GET stores carrying a given book. Currently surfaced through the books
// module (/api/books/:id/stores); exposed here for reuse/future store routes.
export const getBookStores = asyncHandler(async (req: Request, res: Response) => {
  const stores = await getStoresForBook(req.params.id);
  res.status(200).json(stores);
});
