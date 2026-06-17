import mongoose, { Document, Schema, Types } from 'mongoose';

// Ensure the Store model is registered so populate('store') works
// even when nothing else in the request path requires it directly.
import './store.model';

export interface IInventory extends Document {
  store: Types.ObjectId;
  book: Types.ObjectId;
  stock: number;
}

const inventorySchema = new Schema<IInventory>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

// A given book has at most one inventory record per store.
inventorySchema.index({ store: 1, book: 1 }, { unique: true });

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
export default Inventory;
