import connectDB from '../config/db';
import { Book } from '../modules/books/book.model';
import { books } from './books.data';

// Modes:
//   (no flag)   - seed only if the books collection is empty (same as --if-empty)
//   --if-empty  - only seed when the books collection is empty
//   --fresh     - delete existing books, then reseed
if (process.env.NODE_ENV === 'production') {
  console.error('Seed scripts must not run against a production database.');
  process.exit(1);
}

const args = process.argv.slice(2);
const fresh = args.includes('--fresh');

const importData = async (): Promise<void> => {
  try {
    await connectDB();

    if (fresh) {
      await Book.deleteMany();
      await Book.insertMany(books);
      console.log(`Books reseeded successfully (${books.length} books)`);
    } else {
      const existingCount = await Book.countDocuments();

      if (existingCount > 0) {
        console.log(`Books collection already has ${existingCount} document(s); skipping seed.`);
      } else {
        await Book.insertMany(books);
        console.log(`Books seeded successfully (${books.length} books)`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
