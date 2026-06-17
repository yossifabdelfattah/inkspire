import { BookRequest, IBookRequest } from './bookRequest.model';
import { env } from '../../config/env';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

const normalize = (value: string): string => value.trim().toLowerCase();

const calculatePriorityScore = (requestCount: number): number => requestCount * 10;

export interface BookCandidate {
  title: string;
  author: string;
  description: string;
  category: string;
  image: string;
}

const toHttps = (url: string): string => (url ? url.replace(/^http:\/\//, 'https://') : url);

interface GoogleVolume {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
}

const normalizeVolume = (volume: GoogleVolume): BookCandidate => {
  const info = volume.volumeInfo ?? {};
  return {
    title: info.title ?? '',
    author: (info.authors ?? []).join(', '),
    description: info.description ?? '',
    category: info.categories?.[0] ?? '',
    image: toHttps(info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? ''),
  };
};

// Returns up to `limit` normalized candidates for the given title/author.
export const searchBookCandidates = async (
  title: string,
  author: string,
  limit = 5
): Promise<BookCandidate[]> => {
  const query = [title ? `intitle:${title}` : '', author ? `inauthor:${author}` : '']
    .filter(Boolean)
    .join('+');

  if (!query) return [];

  const params = new URLSearchParams({ q: query, maxResults: String(limit) });
  if (env.GOOGLE_BOOKS_API_KEY) {
    params.set('key', env.GOOGLE_BOOKS_API_KEY);
  }

  const url = `${GOOGLE_BOOKS_URL}?${params.toString()}`;

  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) {
    throw new Error(`Google Books API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { items?: GoogleVolume[] };
  return (data.items ?? []).map(normalizeVolume).filter((candidate) => candidate.title);
};

export interface CreateBookRequestResult {
  message: string;
  request: IBookRequest;
  status: number;
}

export const createBookRequest = async (
  title: string,
  author: string,
  note: string | undefined,
  uid: string | null
): Promise<CreateBookRequestResult> => {
  const normalizedTitle = normalize(title);
  const normalizedAuthor = normalize(author);

  const existing = await BookRequest.findOne({ normalizedTitle, normalizedAuthor });

  if (existing) {
    if (uid && existing.requesters.includes(uid)) {
      return { message: 'You have already requested this book', request: existing, status: 200 };
    }

    existing.requestCount += 1;
    existing.priorityScore = calculatePriorityScore(existing.requestCount);
    if (uid) existing.requesters.push(uid);
    await existing.save();
    return {
      message: 'Request already exists — vote count increased',
      request: existing,
      status: 200,
    };
  }

  const newRequest = await BookRequest.create({
    title: title.trim(),
    author: author.trim(),
    normalizedTitle,
    normalizedAuthor,
    note: note?.trim() || '',
    requestedBy: uid,
    requesters: uid ? [uid] : [],
    requestCount: 1,
    priorityScore: calculatePriorityScore(1),
  });

  return { message: 'Book request created', request: newRequest, status: 201 };
};

export const getBookRequests = (status?: string): Promise<IBookRequest[]> => {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  return BookRequest.find(filter).sort({ priorityScore: -1, createdAt: -1 });
};

export const updateBookRequestStatus = (
  id: string,
  status: string
): Promise<IBookRequest | null> =>
  BookRequest.findByIdAndUpdate(id, { status }, { new: true });

export const findBookRequestById = (id: string): Promise<IBookRequest | null> =>
  BookRequest.findById(id);
