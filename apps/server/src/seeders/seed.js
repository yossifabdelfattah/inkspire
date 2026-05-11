const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");

const Book = require("../models/Book");
const books = require("../data/books");

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // clear existing books
    await Book.deleteMany();

    console.log(books);

    // insert sample books
    await Book.insertMany(books);

    console.log("Books seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();