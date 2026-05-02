const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const response = await fetch('https://openlibrary.org/search.json?q=books&limit=20&lang=ger');
  const data = await response.json();

  const products = data.docs.map((book) => ({
    name: book.title,
    description: book.first_sentence?.[0] ?? 'No description available',
    price: parseFloat((Math.random() * 20 + 5).toFixed(2)), // Open Library has no prices
    imageUrl: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : '',
    countInStock: Math.floor(Math.random() * 50 + 1),
    category: book.subject?.[0] ?? 'Books',
  }));

  await Product.deleteMany();
  await Product.insertMany(products);

  console.log(`${products.length} books seeded`);
  mongoose.disconnect();
};

seed();