import { createContext } from 'react';
import type { Book } from '../types/book';

export interface CartItem extends Pick<Book, 'id' | 'cover' | 'title' | 'author' | 'price' | 'availableStock'> {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Book, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);
