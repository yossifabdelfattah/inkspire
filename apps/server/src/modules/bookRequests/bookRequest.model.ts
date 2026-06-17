import mongoose, { Document, Schema } from 'mongoose';

export interface IBookRequest extends Document {
  title: string;
  author: string;
  normalizedTitle: string;
  normalizedAuthor: string;
  note: string;
  requestedBy?: string | null;
  requesters: string[];
  requestCount: number;
  status: 'pending' | 'approved' | 'rejected';
  priorityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookRequestSchema = new Schema<IBookRequest>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    normalizedTitle: { type: String, required: true, trim: true, lowercase: true },
    normalizedAuthor: { type: String, required: true, trim: true, lowercase: true },
    note: { type: String, trim: true, default: '' },
    requestedBy: {
      type: String, // Firebase UID — optional, not an ObjectId
      default: null,
    },
    requesters: {
      type: [String], // Firebase UIDs that have voted for this request
      default: [],
    },
    requestCount: { type: Number, default: 1, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    priorityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookRequestSchema.index({ normalizedTitle: 1, normalizedAuthor: 1 });

export const BookRequest = mongoose.model<IBookRequest>('BookRequest', bookRequestSchema);
export default BookRequest;
