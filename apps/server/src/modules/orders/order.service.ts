import mongoose from 'mongoose';
import { Order, IOrder, IOrderItem } from './order.model';
import { Book } from '../books/book.model';
import { getShippingPrice } from '../../config/shipping';
import { withOptionalTransaction } from '../../utils/transaction';
import { ApiError } from '../../utils/ApiError';
import { CreateOrderInput, requiredShippingFields } from './order.types';
import { AuthUser } from '../auth/user.types';

export const createOrder = async (
  input: CreateOrderInput,
  user: AuthUser
): Promise<IOrder> => {
  const { cartItems, shippingInfo, paymentMethod } = input;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new ApiError(400, 'Cart is empty');
  }

  if (!shippingInfo || requiredShippingFields.some((field) => !shippingInfo[field]?.trim())) {
    throw new ApiError(400, 'Complete shipping information is required');
  }

  // Validate cart items against the database — never trust client-supplied prices/stock
  const orderItems: IOrderItem[] = [];
  let itemsPrice = 0;

  for (const item of cartItems) {
    if (!mongoose.Types.ObjectId.isValid(item.id)) {
      throw new ApiError(400, `Invalid book id: ${item.id}`);
    }

    const book = await Book.findById(item.id);
    if (!book) {
      throw new ApiError(404, `Book not found: ${item.id}`);
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ApiError(400, `Invalid quantity for ${book.title}`);
    }

    if (book.stock < quantity) {
      throw new ApiError(400, `Not enough stock for "${book.title}" (only ${book.stock} left)`);
    }

    orderItems.push({
      product: book._id as mongoose.Types.ObjectId,
      title: book.title,
      quantity,
      price: book.price,
    });

    itemsPrice += book.price * quantity;
  }

  const shippingPrice = getShippingPrice('standard', itemsPrice);
  const totalPrice = itemsPrice + shippingPrice;

  const order = await withOptionalTransaction(async (session) => {
    // Atomically decrement stock for each ordered book, guarding against
    // concurrent orders depleting stock between the validation above and now.
    for (const item of orderItems) {
      const updated = await Book.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );

      if (!updated) {
        throw new ApiError(409, `Not enough stock for "${item.title}"`);
      }
    }

    const [created] = await Order.create(
      [
        {
          user: user.mongoId,
          orderItems,
          shippingInfo: {
            fullName: shippingInfo.fullName.trim(),
            email: shippingInfo.email.trim(),
            address: shippingInfo.address.trim(),
            city: shippingInfo.city.trim(),
            postal: shippingInfo.postal.trim(),
            country: shippingInfo.country.trim(),
          },
          paymentMethod: paymentMethod || 'card',
          itemsPrice,
          shippingPrice,
          totalPrice,
        },
      ],
      { session: session ?? undefined }
    );

    return created;
  });

  return order;
};

export const getMyOrders = (user: AuthUser): Promise<IOrder[]> =>
  Order.find({ user: user.mongoId }).sort({ createdAt: -1 });
