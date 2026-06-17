import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchLog extends Document {
  query: string;
  normalizedQuery: string;
  resultCount: number;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const searchLogSchema = new Schema<ISearchLog>(
  {
    query: { type: String, required: true, trim: true },
    normalizedQuery: { type: String, required: true, trim: true, lowercase: true },
    resultCount: { type: Number, required: true, min: 0 },
    userId: {
      type: String, // Firebase UID — optional, not an ObjectId
      default: null,
    },
  },
  { timestamps: true }
);

// Index for fast analytics grouping
searchLogSchema.index({ normalizedQuery: 1 });
searchLogSchema.index({ createdAt: -1 });

export const SearchLog = mongoose.model<ISearchLog>('SearchLog', searchLogSchema);
export default SearchLog;
