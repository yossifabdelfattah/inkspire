import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
