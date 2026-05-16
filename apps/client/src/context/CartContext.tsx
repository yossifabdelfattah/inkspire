import { useMemo, useState, useCallback } from 'react';
import type { ReactNode, FC } from 'react';
import type { Book } from '../types/product';
import { CartContext, type CartItem } from './cartContext';

export type { CartContextType } from './cartContext';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id);

      if (existing) {
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...book, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== bookId);
      }
      return prev.map((item) =>
        item.id === bookId ? { ...item, quantity } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice
    }),
    [cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
