const dotenv = require('dotenv');
const connectDB = require('../config/db');

const Book = require('../models/Book');
const Store = require('../models/Store');
const Inventory = require('../models/Inventory');
const stores = require('../data/stores');

dotenv.config();

connectDB();

// Per-store stock for the first N books (by insertion order). Books beyond
// this list simply have no inventory records, so they show the "no stores"
// empty state — keeps the seed data simple, no complex logistics.
const STOCK_PATTERN = [
  [3, 0, 5, 0], // book 1: Downtown + Brooklyn
  [0, 2, 0, 4], // book 2: Uptown + Boston
  [1, 1, 1, 0], // book 3: Downtown + Uptown + Brooklyn
  [0, 0, 0, 0], // book 4: out of stock everywhere (empty state)
  [6, 3, 0, 2], // book 5
];

const importData = async () => {
  try {
    await Store.deleteMany();
    await Inventory.deleteMany();

    const createdStores = await Store.insertMany(stores);
    console.log(`Seeded ${createdStores.length} stores`);

    const books = await Book.find().sort({ createdAt: 1 }).limit(STOCK_PATTERN.length);

    const inventoryDocs = [];
    books.forEach((book, bookIndex) => {
      const pattern = STOCK_PATTERN[bookIndex] ?? [];
      pattern.forEach((stock, storeIndex) => {
        if (stock > 0) {
          inventoryDocs.push({
            store: createdStores[storeIndex]._id,
            book: book._id,
            stock,
          });
        }
      });
    });

    await Inventory.insertMany(inventoryDocs);
    console.log(`Seeded ${inventoryDocs.length} inventory records`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
