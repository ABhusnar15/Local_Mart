import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string; // unique cart item id
  productId?: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isCustom?: boolean;
  shape?: string;
  size?: string;
  glazeColor?: string;
  engraving?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItemId = `${item.productId || 'custom'}-${item.shape || ''}-${item.size || ''}-${item.glazeColor || ''}-${Date.now()}`;
    setCart((prev) => {
      // Check if exact standard product exists
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

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
