import { useMemo, useState, useCallback, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import type { Book } from '../types/book';
import { CartContext, type CartItem } from './cartContext';

export type { CartContextType } from './cartContext';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const STORAGE_KEY = 'inkspire.cart';

const [cartItems, setCartItems] = useState<CartItem[]>(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

useEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // ignore quota / private-mode errors
  }
}, [cartItems]);


  const addToCart = useCallback((book: Book, quantity = 1) => {
    setCartItems((prev) => {
      const maxQty = Math.max(book.availableStock, 0);
      const existing = prev.find((item) => item.id === book.id);

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, maxQty);
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: nextQuantity, availableStock: book.availableStock }
            : item
        );
      }

      const nextQuantity = Math.min(Math.max(quantity, 1), maxQty);
      if (nextQuantity < 1) return prev;

      return [
        ...prev,
        {
          id: book.id,
          cover: book.cover,
          title: book.title,
          author: book.author,
          price: book.price,
          availableStock: book.availableStock,
          quantity: nextQuantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== bookId);
      }
      return prev.map((item) =>
        item.id === bookId
          ? { ...item, quantity: Math.min(quantity, Math.max(item.availableStock, 0)) }
          : item
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
