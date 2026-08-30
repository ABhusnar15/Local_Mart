import React, { createContext, useContext, useState } from 'react';

/**
 * Shopping Cart Context for Local Mart
 * Manages cart items (both catalog products and 3D custom pottery creations), quantities, and checkout state.
 */
const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /**
   * Add an item to the shopping cart.
   * Standard shop products increment quantity if already present; custom items create unique entries.
   */
  const addToCart = (item) => {
    const newItemId = `${item.productId || 'custom'}-${item.shape || ''}-${item.size || ''}-${item.glazeColor || ''}-${Date.now()}`;
    setCart((prev) => {
      // Check if standard product already exists in cart
      if (!item.isCustom && item.productId) {
        const existingIndex = prev.findIndex((i) => i.productId === item.productId && !i.isCustom);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity;
          return updated;
        }
      }
      return [...prev, { ...item, id: newItemId }];
    });
    setIsCartOpen(true);
  };

  /**
   * Remove item from cart by item ID.
   */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Increment or decrement item quantity in cart.
   */
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  /**
   * Reset/clear cart after order completion.
   */
  const clearCart = () => setCart([]);

  // Calculate total item count and subtotal price
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom Hook: Access cart state and actions.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
