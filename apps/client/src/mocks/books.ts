import type { Book } from '../types/product';

export const SAMPLE_BOOKS: Book[] = [
  { id: '1', cover: 'https://covers.openlibrary.org/b/id/10523338-L.jpg', title: 'Atomic Habits', author: 'James Clear', price: 18.99, rating: 4.7, inStock: true },
  { id: '2', cover: 'https://covers.openlibrary.org/b/id/11153213-L.jpg', title: 'The Midnight Library', author: 'Matt Haig', price: 15.49, rating: 4.3, inStock: true },
  { id: '3', cover: 'https://covers.openlibrary.org/b/id/10958339-L.jpg', title: 'Project Hail Mary', author: 'Andy Weir', price: 22.99, rating: 4.8, inStock: false },
  { id: '4', cover: 'https://covers.openlibrary.org/b/id/10449159-L.jpg', title: 'The Silent Patient', author: 'Alex Michaelides', price: 14.99, rating: 4.1, inStock: true },
  { id: '5', cover: 'https://covers.openlibrary.org/b/id/10523339-L.jpg', title: 'The Great Novel', author: 'A. Author', price: 12.99, rating: 4.0, inStock: true },
];

export default SAMPLE_BOOKS;
