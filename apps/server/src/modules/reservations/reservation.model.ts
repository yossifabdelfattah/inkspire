import mongoose, { Document, Schema, Types, Model } from 'mongoose';

export const RESERVATION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface IReservationItem {
  book: Types.ObjectId;
  title?: string;
  quantity: number;
  price: number;
}

export interface IInventoryReservation extends Document {
  userId?: Types.ObjectId | null;
  items: IReservationItem[];
  status: 'active' | 'completed' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IInventoryReservationModel extends Model<IInventoryReservation> {
  RESERVATION_DURATION_MS: number;
}

const reservationItemSchema = new Schema<IReservationItem>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    title: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const inventoryReservationSchema = new Schema<IInventoryReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    items: {
      type: [reservationItemSchema],
      required: true,
      validate: (items: unknown) => Array.isArray(items) && items.length > 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active',
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Reservations are never auto-deleted — expired reservations are kept for
// audit/history and marked status: 'expired' by the cleanup service.
inventoryReservationSchema.index({ status: 1, expiresAt: 1 });

export const InventoryReservation = mongoose.model<
  IInventoryReservation,
  IInventoryReservationModel
>('InventoryReservation', inventoryReservationSchema);

InventoryReservation.RESERVATION_DURATION_MS = RESERVATION_DURATION_MS;

export default InventoryReservation;
