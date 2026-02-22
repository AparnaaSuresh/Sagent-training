import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // localCart stores {productId, name, price, quantity, categoryId} for UI display
  // backend cart uses cartAPI calls separately
  const [localCart, setLocalCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setLocalCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setLocalCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setLocalCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setLocalCart([]);

  const subtotal = localCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = subtotal > 200 ? 25 : 0;
  const total = subtotal - discount;
  const itemCount = localCart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ localCart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, discount, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
