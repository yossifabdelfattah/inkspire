import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  title?: string;
  quantity: number;
  price: number;
}

export interface IShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postal: string;
  country: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingInfo: IShippingInfo;
  paymentMethod: 'card' | 'paypal' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  mockTransactionId: string;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  deliveryEstimate: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        title: String,
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    shippingInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postal: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['card', 'paypal', 'cod'], default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    mockTransactionId: { type: String, default: '' },
    deliveryMethod: { type: String, enum: ['standard', 'express', 'pickup'], default: 'standard' },
    deliveryEstimate: { type: String, default: '' },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

// Speeds up getMyOrders / getRecommendations (Order.find({ user })).
orderSchema.index({ user: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
