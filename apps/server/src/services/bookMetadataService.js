// Looks up candidate book metadata from the Google Books API based on a
// title/author search, so admins can prefill the "Add Book" form when
// approving a book request instead of typing everything by hand.

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

const toHttps = (url) => (url ? url.replace(/^http:\/\//, 'https://') : url);

const normalizeVolume = (volume) => {
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
async function searchBookCandidates(title, author, limit = 5) {
  const query = [title ? `intitle:${title}` : '', author ? `inauthor:${author}` : '']
    .filter(Boolean)
    .join('+');

  if (!query) return [];

  const params = new URLSearchParams({ q: query, maxResults: String(limit) });
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.set('key', process.env.GOOGLE_BOOKS_API_KEY);
  }

  const url = `${GOOGLE_BOOKS_URL}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Books API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return (data.items ?? [])
    .map(normalizeVolume)
    .filter((candidate) => candidate.title);
}

module.exports = { searchBookCandidates };
