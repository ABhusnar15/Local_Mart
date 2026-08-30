import React, { useState, useEffect } from 'react';
import { Package, Plus, DollarSign, Hammer, CheckCircle2, Truck, RefreshCw, Trash2, Edit3, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product } from './Shop';
import { Order } from './BuyerDashboard';

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('45.00');
  const [newProductCategory, setNewProductCategory] = useState('Vases');
  const [newProductShape, setNewProductShape] = useState('Classic');
  const [newProductSize, setNewProductSize] = useState('M');
  const [newProductGlaze, setNewProductGlaze] = useState('Cobalt Blue');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800');
  const [newProductStock, setNewProductStock] = useState('10');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.data);

      const productsRes = await api.get('/products');
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to load seller data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProductName,
        description: newProductDesc,
        price: parseFloat(newProductPrice),
        category: newProductCategory,
        shape: newProductShape,
        size: newProductSize,
        glazeColor: newProductGlaze,
        imageUrl: newProductImage,
        stockQuantity: parseInt(newProductStock, 10),
        inStock: parseInt(newProductStock, 10) > 0,
        sellerId: user ? user.id : 1,
        sellerName: user ? (user.shopName || user.name) : 'Jaipur Royal Clayware',
      };

      await api.post('/products', payload);
      setShowAddProductModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to add product', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product from your shop?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'IN_PRODUCTION').length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Artisan Control Portal</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 mt-1">
            {user?.shopName || 'Master Artisan Dashboard'}
          </h2>
          <p className="text-stone-400 text-sm mt-2">Manage incoming kiln production orders, track revenue, and publish pottery inventory.</p>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl glaze-terracotta text-stone-950 font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-amber-900/20"
        >
          <Plus className="w-5 h-5" />
          Add New Pottery Item
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-600/20 text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Total Shop Sales</span>
            <span className="text-2xl font-bold font-serif text-amber-400">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Active Production Orders</span>
            <span className="text-2xl font-bold font-serif text-stone-100">{pendingOrdersCount}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-600/20 text-emerald-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">Published Pottery Products</span>
            <span className="text-2xl font-bold font-serif text-stone-100">{products.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-stone-800 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'products'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Inventory Catalog ({products.length})
        </button>
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl">
              <p className="text-stone-400 text-sm">No incoming customer orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-stone-100">
                      Order #{order.id} — {order.customerName}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">Email: {order.email} • Phone: {order.phone || 'N/A'}</p>
                    <p className="text-xs text-stone-400">Ship To: {order.shippingAddress || 'Jaipur Studio Pickup'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-amber-400 font-serif">${order.totalPrice.toFixed(2)}</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="bg-stone-900 border border-stone-700 text-stone-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PRODUCTION">IN PRODUCTION</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-stone-950/60 p-4 rounded-xl space-y-2 border border-stone-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Order Specifications</span>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="text-xs text-stone-300 flex items-center justify-between">
                        <span>• {item.productName} (x{item.quantity})</span>
                        {item.customShape && (
                          <span className="text-amber-400 font-mono">
                            Shape: {item.customShape} | Size: {item.customSize} | Glaze: {item.customGlazeColor} {item.customEngraving ? `| Text: "${item.customEngraving}"` : ''}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-stone-300">
                      <span>• Custom Pottery Item</span>
                      {order.shape && (
                        <p className="text-amber-400 font-mono mt-0.5">
                          Shape: {order.shape} | Size: {order.size} | Glaze: {order.glazeColor} {order.engraving ? `| Text: "${order.engraving}"` : ''}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl overflow-hidden p-4 flex flex-col justify-between">
              <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="absolute top-2 right-2 p-2 bg-red-950/80 text-red-400 rounded-lg hover:bg-red-900 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-stone-100 font-serif">{p.name}</h4>
                <p className="text-xs text-stone-400 line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-stone-800">
                <span className="text-lg font-bold text-amber-400">${p.price.toFixed(2)}</span>
                <span className="text-xs text-stone-400">Stock: {p.stockQuantity}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-stone-100">Add New Pottery Product</h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Royal Terracotta Pitcher"
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Description</label>
                <textarea
                  required
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  >
                    <option value="Vases">Vases</option>
                    <option value="Tableware">Tableware</option>
                    <option value="Planters">Planters</option>
                    <option value="Cups">Cups</option>
                    <option value="Bowls">Bowls</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Glaze Color</label>
                  <input
                    type="text"
                    value={newProductGlaze}
                    onChange={(e) => setNewProductGlaze(e.target.value)}
                    className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-xl text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 glaze-terracotta text-stone-950 font-bold rounded-xl"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
