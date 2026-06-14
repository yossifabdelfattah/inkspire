const dotenv = require("dotenv");

const connectDB = require("../config/db");

const Book = require("../models/Book");
const books = require("../data/books");

dotenv.config();

// Modes:
//   (no flag)   - seed only if the books collection is empty (same as --if-empty)
//   --if-empty  - only seed when the books collection is empty
//   --fresh     - delete existing books, then reseed
const args = process.argv.slice(2);
const fresh = args.includes("--fresh");

const importData = async () => {
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
