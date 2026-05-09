import type { Product } from '../types/product';
import { Button as MantineButton } from '@mantine/core';
import { useCart } from '../context/CartContext';

interface CartItem extends Product {
  quantity: number;
}

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart() as {
    cartItems: CartItem[];
    updateQuantity: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    totalPrice: number;
  };

  return (
    <div>
      <h1>Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              <label>
                Quantity:{' '}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                />
              </label>
              <div style={{ marginTop: '0.75rem' }}>
                <MantineButton color="red" size="sm" onClick={() => removeFromCart(item._id)}>
                  Remove
                </MantineButton>
              </div>
            </div>
          ))}

          <h2>Total: ${totalPrice.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
}

export default Cart;
