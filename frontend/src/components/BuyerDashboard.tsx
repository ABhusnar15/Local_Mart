import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, Hammer, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  customShape?: string;
  customSize?: string;
  customGlazeColor?: string;
  customEngraving?: string;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  shape?: string;
  size?: string;
  glazeColor?: string;
  engraving?: string;
  totalPrice: number;
  status: 'PENDING' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED';
  orderDate: string;
  items: OrderItem[];
}

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const email = user?.email || 'buyer@localmart.com';
      const res = await api.get(`/orders/email/${email}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load buyer orders', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-amber-950/80 text-amber-400 border border-amber-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Order Pending
          </span>
        );
      case 'IN_PRODUCTION':
        return (
          <span className="px-3 py-1 bg-indigo-950/80 text-indigo-400 border border-indigo-800 text-xs font-semibold rounded-full flex items-center gap-1.5 animate-pulse">
            <Hammer className="w-3.5 h-3.5" /> In Kiln Production
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-3 py-1 bg-sky-950/80 text-sky-400 border border-sky-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Dispatched & Shipped
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-stone-800 text-stone-300 text-xs font-semibold rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-10">
        <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Customer Portal</span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 mt-1">My Artisan Orders</h2>
        <p className="text-stone-400 text-sm mt-2">Track real-time crafting status, glaze firing, and delivery of your order history.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-44 animate-pulse bg-stone-800/40" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl max-w-md mx-auto my-8">
          <Package className="w-12 h-12 text-stone-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-200 font-serif">No Active Orders</h3>
          <p className="text-stone-400 text-sm mt-2">You haven't placed any orders yet. Visit our shop or custom design a 3D pottery piece!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel rounded-2xl p-6 border border-stone-800 space-y-6"
            >
              {/* Order Top Line */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div>
                  <span className="text-xs text-stone-400">Order #{order.id}</span>
                  <p className="text-xs font-medium text-stone-300 mt-0.5">
                    Placed on {new Date(order.orderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <span className="text-xl font-bold font-serif text-amber-400">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="grid grid-cols-4 gap-2 text-center py-2">
                {[
                  { key: 'PENDING', label: 'Order Received' },
                  { key: 'IN_PRODUCTION', label: 'Kiln Production' },
                  { key: 'SHIPPED', label: 'Dispatched' },
                  { key: 'DELIVERED', label: 'Delivered' },
                ].map((step, idx) => {
                  const stepIndexMap: Record<string, number> = { PENDING: 1, IN_PRODUCTION: 2, SHIPPED: 3, DELIVERED: 4 };
                  const currentStepIdx = stepIndexMap[order.status] || 1;
                  const isCompleted = idx + 1 <= currentStepIdx;

                  return (
                    <div key={step.key} className="space-y-2">
                      <div
                        className={`h-2 rounded-full transition-colors ${
                          isCompleted ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm' : 'bg-stone-800'
                        }`}
                      />
                      <span className={`text-[11px] font-semibold block ${isCompleted ? 'text-amber-400' : 'text-stone-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Items Detail List */}
              <div className="bg-stone-950/60 p-4 rounded-xl space-y-3 border border-stone-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Order Items & Custom Specifications</h4>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm py-1">
                      <div>
                        <span className="font-semibold text-stone-200">{item.productName}</span>
                        {item.customShape && (
                          <p className="text-xs text-amber-400 font-mono mt-0.5">
                            Custom Spec: {item.customShape} • Size {item.customSize} • Glaze: {item.customGlazeColor}
                            {item.customEngraving ? ` • Engraving: "${item.customEngraving}"` : ''}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-stone-300">Qty: {item.quantity}</span>
                        <span className="text-stone-400 text-xs block">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-stone-300">
                    <span className="font-semibold">Custom Pottery Creation</span>
                    {order.shape && (
                      <p className="text-xs text-amber-400 font-mono mt-0.5">
                        {order.shape} • Size {order.size} • Glaze: {order.glazeColor} {order.engraving ? `• Engraving: "${order.engraving}"` : ''}
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
