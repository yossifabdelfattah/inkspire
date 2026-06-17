import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler';
import * as bookService from './book.service';

// GET /api/books
export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await bookService.getBooks(req.query, req.user);
  res.status(200).json(books);
});

// GET /api/books/recommendations
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const books = await bookService.getRecommendations(
    req.query.limit as string | undefined,
    req.user?.mongoId
  );
  res.status(200).json(books);
});

// GET /api/books/:id/related
export const getRelatedBooks = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid book id' });
    return;
  }

  const related = await bookService.getRelatedBooks(id, req.query.limit as string | undefined);
  if (related === null) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  res.status(200).json(related);
});

// GET /api/books/:id/stores
export const getBookStores = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid book id' });
    return;
  }

  const stores = await bookService.getBookStores(id);
  res.status(200).json(stores);
});

// GET /api/books/:id
export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const book = await bookService.getBookById(req.params.id);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.status(200).json(book);
});

// POST /api/books
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, author, description, price, category, image, stock } = req.body;

  if (!title || !author || !description || !price || !category || !image) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  const newBook = await bookService.createBook({
    title,
    author,
    description,
    price,
    category,
    image,
    stock,
  });
  res.status(201).json(newBook);
});

// PUT /api/books/:id (admin)
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, author, description, price, category, image, stock } = req.body;

  const updated = await bookService.updateBook(req.params.id, {
    title,
    author,
    description,
    price,
    category,
    image,
    stock,
  });

  if (!updated) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.status(200).json(updated);
});

// DELETE /api/books/:id (admin)
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const book = await bookService.deleteBook(req.params.id);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.status(200).json({ message: 'Book deleted' });
});
