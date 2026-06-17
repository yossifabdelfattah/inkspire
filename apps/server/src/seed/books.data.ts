export interface SeedBook {
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export const books: SeedBook[] = [
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description:
      'Transform your life one small habit at a time. Clear reveals how tiny changes can lead to remarkable results through the power of incremental improvement.',
    price: 19.99,
    category: 'Self-help',
    image: 'https://covers.openlibrary.org/b/id/8418753-L.jpg',
    stock: 15,
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description:
      'A handbook of agile software craftsmanship. Learn how to write code that is readable, maintainable, and efficient.',
    price: 29.99,
    category: 'Programming',
    image: 'https://covers.openlibrary.org/b/id/345991-L.jpg',
    stock: 10,
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description:
      'A dazzling novel about all the choices that go into a life well lived. Discover the infinite possibilities that exist within every choice we make.',
    price: 16.99,
    category: 'Fiction',
    image: 'https://covers.openlibrary.org/b/id/11153213-L.jpg',
    stock: 22,
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description:
      'Stranded on a spacecraft far from Earth, an astronaut must use his ingenuity to survive in this thrilling science fiction adventure.',
    price: 22.99,
    category: 'Science Fiction',
    image: 'https://covers.openlibrary.org/b/id/10958339-L.jpg',
    stock: 18,
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description:
      'A woman shoots her husband five times and then never speaks again. A psychotherapist becomes obsessed with uncovering her motive.',
    price: 15.99,
    category: 'Mystery',
    image: 'https://covers.openlibrary.org/b/id/10449159-L.jpg',
    stock: 20,
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description:
      'A sweeping history of humankind from the Stone Age to modern times. Explore how Homo sapiens conquered the world.',
    price: 21.99,
    category: 'History',
    image: 'https://covers.openlibrary.org/b/id/8438109-L.jpg',
    stock: 25,
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    description:
      'Follow Kvothe, a legendary figure, as he recounts his rise from humble beginnings to becoming the most notorious wizard of his age.',
    price: 18.99,
    category: 'Fantasy',
    image: 'https://covers.openlibrary.org/b/id/7718261-L.jpg',
    stock: 16,
  },
  {
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    description:
      "Deep dive into JavaScript's core mechanisms. Understand how JavaScript really works under the hood.",
    price: 24.99,
    category: 'Programming',
    image: 'https://covers.openlibrary.org/b/id/8968832-L.jpg',
    stock: 12,
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    description:
      'A memoir about a woman who leaves her survivalist family and pursues education, ultimately earning a PhD from Cambridge University.',
    price: 20.99,
    category: 'Biography',
    image: 'https://covers.openlibrary.org/b/id/10195143-L.jpg',
    stock: 28,
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    description:
      'A reclusive Hollywood icon finally tells her story spanning decades of glamour, scandal, and passion in Golden Age Hollywood.',
    price: 17.99,
    category: 'Fiction',
    image: 'https://covers.openlibrary.org/b/id/9874521-L.jpg',
    stock: 24,
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description:
      'Join Bilbo Baggins on an unexpected adventure with dwarves and a wizard in search of dragon gold and the thrill of discovery.',
    price: 18.99,
    category: 'Fantasy',
    image: 'https://covers.openlibrary.org/b/id/145871-L.jpg',
    stock: 30,
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description:
      'Explore the two systems of thought that drive the way we think. Discover biases and heuristics that influence our decisions.',
    price: 23.99,
    category: 'Self-help',
    image: 'https://covers.openlibrary.org/b/id/8351829-L.jpg',
    stock: 14,
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    description:
      'A gripping mystery involving a journalist and a hacker as they uncover a dark family secret spanning decades.',
    price: 19.99,
    category: 'Mystery',
    image: 'https://covers.openlibrary.org/b/id/7952121-L.jpg',
    stock: 19,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description:
      'Epic science fiction on a desert planet where politics, religion, and ecology intertwine in a struggle for power.',
    price: 20.99,
    category: 'Science Fiction',
    image: 'https://covers.openlibrary.org/b/id/384801-L.jpg',
    stock: 17,
  },
  {
    title: 'The Code Breaker',
    author: 'Walter Isaacson',
    description:
      'The life story of Jennifer Doudna, who co-developed CRISPR gene editing technology and changed the course of biology forever.',
    price: 21.99,
    category: 'Biography',
    image: 'https://covers.openlibrary.org/b/id/10215285-L.jpg',
    stock: 21,
  },
  {
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    description:
      'Retirement community residents solve cold cases and uncover mysteries in their neighborhood in this charming and witty novel.',
    price: 18.99,
    category: 'Mystery',
    image: 'https://covers.openlibrary.org/b/id/10189481-L.jpg',
    stock: 26,
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description:
      "From the Big Bang to black holes, Hawking explains the universe's greatest mysteries in accessible language.",
    price: 18.99,
    category: 'Science Fiction',
    image: 'https://covers.openlibrary.org/b/id/376903-L.jpg',
    stock: 13,
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    description:
      "A reimagining of the Greek mythology goddess Circe's story of isolation, power, and defiance on her enchanted island.",
    price: 17.99,
    category: 'Fantasy',
    image: 'https://covers.openlibrary.org/b/id/10062819-L.jpg',
    stock: 23,
  },
  {
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    description:
      'Master technical interview questions and learn strategies used by top tech companies to assess engineering candidates.',
    price: 26.99,
    category: 'Programming',
    image: 'https://covers.openlibrary.org/b/id/6887313-L.jpg',
    stock: 11,
  },
];

export default books;
