import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useAuth();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      const itemsPayload = cart.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        customShape: item.shape,
        customSize: item.size,
        customGlazeColor: item.glazeColor,
        customEngraving: item.engraving,
      }));

      const orderPayload = {
        userId: user ? user.id : 1,
        customerName: user ? user.name : 'Guest Customer',
        email: user ? user.email : 'buyer@localmart.com',
        phone: user ? user.phone : '+91 9123456789',
        shippingAddress: user ? user.address : '42 Blossom Heights, Bangalore',
        totalPrice: cartSubtotal,
        status: 'PENDING',
        items: itemsPayload,
      };

      const res = await api.post('/orders', orderPayload);

      setCheckoutSuccess(`Order #${res.data.id} placed successfully!`);
      clearCart();
      setTimeout(() => {
        setCheckoutSuccess(null);
        setIsCartOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-serif text-stone-100">Your Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content / List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutSuccess ? (
              <div className="p-8 text-center glass-panel rounded-2xl space-y-4 my-auto">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold font-serif text-stone-100">Order Confirmed!</h3>
                <p className="text-stone-300 text-sm">{checkoutSuccess}</p>
                <p className="text-stone-400 text-xs">Our master artisans have received your order details.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-stone-600 mx-auto stroke-1" />
                <p className="text-stone-400 text-sm">Your cart is currently empty.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-4 rounded-xl flex items-center gap-4 border border-stone-800"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-stone-950 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-100 truncate">{item.name}</h4>
                    
                    {item.isCustom ? (
                      <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                        {item.shape} • {item.size} • {item.glazeColor} {item.engraving ? `• "${item.engraving}"` : ''}
                      </p>
                    ) : (
                      <p className="text-[11px] text-stone-400 mt-0.5">Standard Pottery Item</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-amber-400">${(item.price * item.quantity).toFixed(2)}</span>

                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-stone-400 hover:text-stone-100 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold text-stone-200 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-stone-400 hover:text-stone-100 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-500 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Bar */}
          {cart.length > 0 && !checkoutSuccess && (
            <div className="p-6 border-t border-stone-800 glass-panel space-y-4">
              <div className="flex items-center justify-between text-sm text-stone-300">
                <span>Subtotal</span>
                <span className="text-2xl font-bold font-serif text-amber-400">${cartSubtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-xl glaze-terracotta text-stone-950 font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
              >
                <span>{isCheckingOut ? 'Processing Order...' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
