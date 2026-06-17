import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || '5000',
  MONGO_URI: process.env.MONGO_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  GOOGLE_BOOKS_API_KEY: process.env.GOOGLE_BOOKS_API_KEY,
};
