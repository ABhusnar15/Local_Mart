import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, SlidersHorizontal, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

/**
 * Shop Component
 * Displays available handcrafted pottery products with category filters, search input, and instant cart additions.
 */
export const Shop = ({ onCustomizeClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addedNotice, setAddedNotice] = useState(null);

  const { addToCart } = useCart();

  const categories = ['ALL', 'Vases', 'Tableware', 'Planters', 'Cups', 'Bowls'];

  // Fetch products whenever selected category or search query changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  /**
   * Fetch products from backend REST API endpoint /api/products
   */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/products';
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add selected product to cart with visual confirmation badge.
   */
  const handleAddToCart = (product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1,
      shape: product.shape,
      size: product.size,
      glazeColor: product.glazeColor,
      isCustom: false,
    });

    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header & Customizer CTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Handcrafted Catalog</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 mt-1">Artisan Creations</h2>
          <p className="text-stone-400 text-sm mt-2">Explore handcrafted pottery items directly from verified master craftsmen.</p>
        </div>

        {/* 3D Pottery Studio Banner CTA */}
        <button
          onClick={onCustomizeClick}
          className="flex items-center gap-3 px-6 py-3.5 rounded-2xl glaze-terracotta text-stone-100 font-bold hover:opacity-95 transition-all shadow-lg shadow-amber-900/30"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <span>Need Something Custom? Open 3D Studio</span>
        </button>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="glass-panel p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search pottery by name, glaze, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-stone-900/90 border border-stone-700/60 rounded-xl text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-stone-100'
              }`}
            >
              {cat === 'ALL' ? 'All Products' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-4 h-96 animate-pulse bg-stone-800/40" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl max-w-md mx-auto my-12">
          <SlidersHorizontal className="w-12 h-12 text-stone-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-200 font-serif">No Pottery Found</h3>
          <p className="text-stone-400 text-sm mt-2">Try clearing search filters or custom design your own pottery piece in our 3D Studio!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Product Image Showcase */}
              <div className="relative h-64 overflow-hidden bg-stone-900">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-stone-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold rounded-lg border border-stone-800">
                  {product.category}
                </span>
                
                {product.glazeColor && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-stone-950/80 backdrop-blur-md text-stone-300 text-[10px] font-semibold rounded-lg border border-stone-800">
                    Glaze: {product.glazeColor}
                  </span>
                )}
              </div>

              {/* Product Info & Actions */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-100 font-serif group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {product.sellerName && (
                    <p className="text-[11px] text-amber-500/80 font-medium mt-2">
                      Artisan: {product.sellerName}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 block">Price</span>
                    <span className="text-xl font-bold text-amber-400">${product.price.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
                      addedNotice === product.id
                        ? 'bg-emerald-600 text-stone-100'
                        : 'bg-amber-600 text-stone-950 hover:bg-amber-500 shadow-md shadow-amber-900/20'
                    }`}
                  >
                    {addedNotice === product.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Added!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};
