import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as bookRequestService from './bookRequest.service';

// POST /api/book-requests
export const createBookRequest = asyncHandler(async (req: Request, res: Response) => {
  const { title, author, note } = req.body;

  if (!title || !title.trim() || !author || !author.trim()) {
    res.status(400).json({ message: 'Title and author are required' });
    return;
  }

  const uid = req.user?.uid ?? null;
  const result = await bookRequestService.createBookRequest(title, author, note, uid);

  res.status(result.status).json({ message: result.message, request: result.request });
});

// GET /api/book-requests (admin)
export const getBookRequests = asyncHandler(async (req: Request, res: Response) => {
  const requests = await bookRequestService.getBookRequests(req.query.status as string | undefined);
  res.status(200).json(requests);
});

// PATCH /api/book-requests/:id (admin) — approve or reject a request
export const updateBookRequestStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400).json({ message: 'Status must be pending, approved, or rejected' });
    return;
  }

  const request = await bookRequestService.updateBookRequestStatus(req.params.id, status);
  if (!request) {
    res.status(404).json({ message: 'Book request not found' });
    return;
  }

  res.status(200).json(request);
});

// GET /api/book-requests/:id/candidates (admin) — metadata suggestions for prefilling "Add Book"
export const getBookRequestCandidates = asyncHandler(async (req: Request, res: Response) => {
  const request = await bookRequestService.findBookRequestById(req.params.id);
  if (!request) {
    res.status(404).json({ message: 'Book request not found' });
    return;
  }

  try {
    const candidates = await bookRequestService.searchBookCandidates(request.title, request.author);
    res.status(200).json({ candidates });
  } catch {
    res.status(200).json({ candidates: [], message: 'Book metadata lookup is currently unavailable.' });
  }
});
