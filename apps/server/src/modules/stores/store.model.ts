import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Store = mongoose.model<IStore>('Store', storeSchema);
export default Store;
