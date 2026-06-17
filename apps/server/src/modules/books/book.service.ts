import { FilterQuery } from 'mongoose';
import { Book, IBook } from './book.model';
import { SearchLog } from '../analytics/searchLog.model';
import { Order } from '../orders/order.model';
import { getStoresForBook, BookStore } from '../stores/store.service';
import { BookQuery, CreateBookInput } from './book.types';
import { AuthUser } from '../auth/user.types';

// GET all books with search, filter, and sort
export const getBooks = async (
  query: BookQuery,
  user?: AuthUser | null
): Promise<IBook[]> => {
  const { search, category, minPrice, maxPrice, sort } = query;

  const filter: FilterQuery<IBook> = {};

  // Search: match title or author case-insensitively
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter
  if (category && category !== 'All') {
    filter.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    const price: Record<string, number> = {};
    if (minPrice) price.$gte = parseFloat(minPrice);
    if (maxPrice) price.$lte = parseFloat(maxPrice);
    filter.price = price;
  }

  // Build sort object
  let sortObj: Record<string, 1 | -1> = {};
  if (sort === 'price-asc') sortObj = { price: 1 };
  else if (sort === 'price-desc') sortObj = { price: -1 };
  else if (sort === 'rating') sortObj = { ratingAverage: -1 };
  else if (sort === 'newest') sortObj = { createdAt: -1 };

  const books = await Book.find(filter).sort(sortObj);

  // Fire-and-forget: log non-empty searches without blocking the response
  if (search && search.trim().length > 0) {
    SearchLog.create({
      query: search.trim(),
      normalizedQuery: search.trim().toLowerCase(),
      resultCount: books.length,
      userId: user?.uid ?? null,
    }).catch((err: Error) => {
      console.error('[SearchLog] Failed to log search:', err.message);
    });
  }

  return books;
};

// Personalized "recommended for you" list.
export const getRecommendations = async (
  limitRaw: string | undefined,
  mongoId?: AuthUser['mongoId']
): Promise<IBook[]> => {
  const limit = Math.min(parseInt(limitRaw || '') || 8, 20);

  let purchasedCategories: string[] = [];
  let purchasedBookIds: string[] = [];

  if (mongoId) {
    const orders = await Order.find({ user: mongoId }).select('orderItems.product');
    purchasedBookIds = [
      ...new Set(
        orders.flatMap((order) => order.orderItems.map((item) => String(item.product)))
      ),
    ];

    if (purchasedBookIds.length > 0) {
      const purchasedBooks = await Book.find({ _id: { $in: purchasedBookIds } }).select('category');
      purchasedCategories = [
        ...new Set(purchasedBooks.map((b) => b.category).filter(Boolean)),
      ];
    }
  }

  let books: IBook[] = [];

  if (purchasedCategories.length > 0) {
    books = await Book.find({
      category: { $in: purchasedCategories },
      _id: { $nin: purchasedBookIds },
    })
      .sort({ ratingAverage: -1, ratingCount: -1 })
      .limit(limit);
  }

  if (books.length < limit) {
    const excludeIds = [...purchasedBookIds, ...books.map((b) => String(b._id))];
    const fallback = await Book.find({ _id: { $nin: excludeIds } })
      .sort({ ratingAverage: -1, ratingCount: -1 })
      .limit(limit - books.length);

    books = [...books, ...fallback];
  }

  return books;
};

// Returns books related to a given book (same category), falling back to
// top-rated books overall. Returns null if the book is not found.
export const getRelatedBooks = async (
  id: string,
  limitRaw: string | undefined
): Promise<IBook[] | null> => {
  const limit = Math.min(parseInt(limitRaw || '') || 6, 20);

  const book = await Book.findById(id).select('category');
  if (!book) return null;

  let related = await Book.find({ _id: { $ne: id }, category: book.category })
    .sort({ ratingAverage: -1, ratingCount: -1 })
    .limit(limit);

  if (related.length < limit) {
    const excludeIds = [id, ...related.map((b) => String(b._id))];
    const fallback = await Book.find({ _id: { $nin: excludeIds } })
      .sort({ ratingAverage: -1, ratingCount: -1 })
      .limit(limit - related.length);

    related = [...related, ...fallback];
  }

  return related;
};

export const getBookStores = (id: string): Promise<BookStore[]> => getStoresForBook(id);

export const getBookById = (id: string): Promise<IBook | null> => Book.findById(id);

export const createBook = (input: Required<CreateBookInput>): Promise<IBook> =>
  Book.create(input);

export const updateBook = async (
  id: string,
  input: CreateBookInput
): Promise<IBook | null> => {
  const book = await Book.findById(id);
  if (!book) return null;

  if (input.title !== undefined) book.title = input.title;
  if (input.author !== undefined) book.author = input.author;
  if (input.description !== undefined) book.description = input.description;
  if (input.price !== undefined) book.price = input.price;
  if (input.category !== undefined) book.category = input.category;
  if (input.image !== undefined) book.image = input.image;
  if (input.stock !== undefined) book.stock = input.stock;

  return book.save();
};

export const deleteBook = (id: string): Promise<IBook | null> =>
  Book.findByIdAndDelete(id);
