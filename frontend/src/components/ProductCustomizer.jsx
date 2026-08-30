import React, { useState } from 'react';
import { Palette, Sparkles, ShoppingBag, RotateCw, Type, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

/**
 * 3D Pottery Studio Customizer Component
 * Provides interactive visual controls for customizing pottery shapes (Classic, Tapered, Fluted),
 * size scale, glaze mineral colors, and hand-engraved text preview.
 */
export const ProductCustomizer = () => {
  const [shape, setShape] = useState('Classic');
  const [size, setSize] = useState('M');
  const [glazeColor, setGlazeColor] = useState('Cobalt Blue');
  const [engraving, setEngraving] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const { addToCart } = useCart();

  // Color options for mineral glazes
  const glazeOptions = [
    { name: 'Terracotta', hex: '#ea580c', bgClass: 'glaze-terracotta' },
    { name: 'Cobalt Blue', hex: '#2563eb', bgClass: 'glaze-cobalt' },
    { name: 'Sage Green', hex: '#65a30d', bgClass: 'glaze-sage' },
    { name: 'Golden Ochre', hex: '#d97706', bgClass: 'glaze-amber' },
    { name: 'Charcoal Black', hex: '#374151', bgClass: 'glaze-charcoal' },
  ];

  /**
   * Dynamic price calculation algorithm based on shape, size, and engraving options.
   */
  const calculatePrice = () => {
    let base = 40.0;
    if (shape === 'Tapered') base += 10.0;
    if (shape === 'Fluted') base += 15.0;

    if (size === 'M') base += 10.0;
    if (size === 'L') base += 25.0;

    if (engraving.trim().length > 0) base += 5.0;

    return base;
  };

  const totalPrice = calculatePrice();

  /**
   * Add customized pottery creation to shopping cart.
   */
  const handleAddToCart = () => {
    addToCart({
      name: `Custom ${shape} Pottery (${size})`,
      price: totalPrice,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
      quantity: 1,
      isCustom: true,
      shape,
      size,
      glazeColor,
      engraving,
    });
  };

  /**
   * Submit direct custom order request to backend API.
   */
  const handleDirectOrder = async () => {
    try {
      setIsOrdering(true);
      const userStr = localStorage.getItem('localmart_user');
      const user = userStr ? JSON.parse(userStr) : null;

      const orderPayload = {
        userId: user ? user.id : 1,
        customerName: user ? user.name : 'Guest Customer',
        email: user ? user.email : 'guest@localmart.com',
        phone: user ? user.phone : '+91 9876543210',
        shippingAddress: user ? user.address : '123 Artisan Way',
        shape,
        size,
        glazeColor,
        engraving,
        totalPrice,
        status: 'PENDING',
        items: [
          {
            productName: `Custom Crafted ${shape} Pottery`,
            quantity: 1,
            unitPrice: totalPrice,
            customShape: shape,
            customSize: size,
            customGlazeColor: glazeColor,
            customEngraving: engraving,
          },
        ],
      };

      const res = await api.post('/orders', orderPayload);
      setOrderSuccess(`Order #${res.data.id} submitted! Our master artisan will begin crafting your custom pottery item.`);
    } catch (err) {
      console.error('Order creation error', err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4" />
          3D Interactive Studio
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">Design Custom Pottery</h2>
        <p className="text-stone-400 text-sm mt-2">Customize shape contour, scale size, glaze mineral color, and hand-carved text engraving.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 3D Canvas Visualizer */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col items-center justify-between min-h-[520px] relative overflow-hidden">
          
          {/* Controls Bar */}
          <div className="w-full flex items-center justify-between text-xs text-stone-400 z-10">
            <span className="flex items-center gap-2 font-mono uppercase tracking-wider bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-800">
              <RotateCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              Live 3D Renderer
            </span>
            <button
              onClick={() => setRotation((prev) => prev + 45)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate View ({rotation}°)
            </button>
          </div>

          {/* Interactive SVG Rendering */}
          <div className="my-auto py-8 relative flex items-center justify-center w-full transition-all duration-500">
            
            {/* Pedestal Shadow */}
            <div className="absolute bottom-4 w-48 h-8 bg-stone-950/80 rounded-full blur-xl pointer-events-none" />

            <div
              style={{ transform: `rotateY(${rotation}deg)` }}
              className="transition-transform duration-500 relative flex flex-col items-center"
            >
              <svg
                width={size === 'S' ? '180' : size === 'M' ? '230' : '280'}
                height={size === 'S' ? '220' : size === 'M' ? '280' : '340'}
                viewBox="0 0 200 250"
                className="drop-shadow-2xl transition-all duration-500 filter"
              >
                <defs>
                  {/* Dynamic Radial Gradient matching Glaze Selection */}
                  <radialGradient id="potteryGlaze" cx="35%" cy="30%" r="70%">
                    <stop
                      offset="0%"
                      stopColor={
                        glazeColor === 'Terracotta'
                          ? '#fb923c'
                          : glazeColor === 'Cobalt Blue'
                          ? '#60a5fa'
                          : glazeColor === 'Sage Green'
                          ? '#a3e635'
                          : glazeColor === 'Golden Ochre'
                          ? '#fbbf24'
                          : '#6b7280'
                      }
                    />
                    <stop
                      offset="60%"
                      stopColor={
                        glazeColor === 'Terracotta'
                          ? '#c2410c'
                          : glazeColor === 'Cobalt Blue'
                          ? '#1d4ed8'
                          : glazeColor === 'Sage Green'
                          ? '#4d7c0f'
                          : glazeColor === 'Golden Ochre'
                          ? '#b45309'
                          : '#1f2937'
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        glazeColor === 'Terracotta'
                          ? '#451a03'
                          : glazeColor === 'Cobalt Blue'
                          ? '#0f172a'
                          : glazeColor === 'Sage Green'
                          ? '#052e16'
                          : glazeColor === 'Golden Ochre'
                          ? '#451a03'
                          : '#030712'
                      }
                    />
                  </radialGradient>
                </defs>

                {/* Dynamic SVG Contour Paths */}
                {shape === 'Classic' && (
                  <path
                    d="M 60 40 Q 100 25 140 40 L 145 60 C 175 110 170 180 140 210 Q 100 225 60 210 C 30 180 25 110 55 60 Z"
                    fill="url(#potteryGlaze)"
                    stroke="#1c1917"
                    strokeWidth="3"
                  />
                )}

                {shape === 'Tapered' && (
                  <path
                    d="M 50 35 L 150 35 L 175 140 C 180 190 140 215 130 220 L 70 220 C 60 215 20 190 25 140 Z"
                    fill="url(#potteryGlaze)"
                    stroke="#1c1917"
                    strokeWidth="3"
                  />
                )}

                {shape === 'Fluted' && (
                  <path
                    d="M 40 30 Q 70 45 100 30 Q 130 45 160 30 L 150 90 C 180 140 160 200 135 220 L 65 220 C 40 200 20 140 50 90 Z"
                    fill="url(#potteryGlaze)"
                    stroke="#1c1917"
                    strokeWidth="3"
                  />
                )}

                {/* Rim Highlight */}
                <ellipse cx="100" cy="38" rx="40" ry="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

                {/* Live Custom Text Engraving */}
                {engraving && (
                  <text
                    x="100"
                    y="140"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.85)"
                    fontSize="13"
                    fontFamily="serif"
                    fontWeight="bold"
                    letterSpacing="2"
                    className="select-none shadow-md"
                  >
                    {engraving.toUpperCase()}
                  </text>
                )}
              </svg>
            </div>
          </div>

          {/* Bottom Specifications Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800 text-xs text-stone-300">
            <div className="flex items-center gap-4">
              <span>Shape: <strong className="text-amber-400">{shape}</strong></span>
              <span>Size: <strong className="text-amber-400">{size}</strong></span>
              <span>Glaze: <strong className="text-amber-400">{glazeColor}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Kiln Fired at 1200°C</span>
            </div>
          </div>

        </div>

        {/* Right Controls Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            
            {/* 1. Shape Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                1. Select Pottery Shape
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Classic', 'Tapered', 'Fluted'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`py-3 px-3 rounded-2xl text-xs font-semibold text-center transition-all border ${
                      shape === s
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Size Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                2. Select Size
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'S', label: 'Small (6")', price: '+$0' },
                  { key: 'M', label: 'Medium (9")', price: '+$10' },
                  { key: 'L', label: 'Large (12")', price: '+$25' },
                ].map((sz) => (
                  <button
                    key={sz.key}
                    onClick={() => setSize(sz.key)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-semibold text-center transition-all border flex flex-col items-center justify-center ${
                      size === sz.key
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <span>{sz.label}</span>
                    <span className="text-[10px] text-stone-400">{sz.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Glaze Mineral Color Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                3. Glaze Mineral Color
              </label>
              <div className="grid grid-cols-5 gap-2.5">
                {glazeOptions.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => setGlazeColor(g.name)}
                    title={g.name}
                    className={`h-11 rounded-xl transition-all relative flex items-center justify-center border-2 ${g.bgClass} ${
                      glazeColor === g.name
                        ? 'border-amber-400 scale-105 shadow-lg shadow-amber-900/40'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    {glazeColor === g.name && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 mt-2 text-center">
                Selected Glaze: <span className="text-stone-200 font-semibold">{glazeColor}</span>
              </p>
            </div>

            {/* 4. Text Engraving Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" /> Hand-Engraved Text
                </span>
                <span className="text-[10px] text-stone-400">+$5.00</span>
              </label>
              <input
                type="text"
                maxLength={16}
                placeholder="e.g. ARIA 2026"
                value={engraving}
                onChange={(e) => setEngraving(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-900/90 border border-stone-700/60 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 transition-colors uppercase tracking-widest"
              />
            </div>

            {/* Price Summary & Action Buttons */}
            <div className="pt-4 border-t border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block">Total Custom Price</span>
                  <span className="text-3xl font-bold font-serif text-amber-400">${totalPrice.toFixed(2)}</span>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                  Free Crafting Shipping
                </span>
              </div>

              {orderSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{orderSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-stone-700"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>

                <button
                  onClick={handleDirectOrder}
                  disabled={isOrdering}
                  className="py-3 px-4 rounded-xl glaze-terracotta text-stone-950 font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-900/20"
                >
                  <Sparkles className="w-4 h-4 text-amber-100" />
                  {isOrdering ? 'Submitting...' : 'Order Direct'}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
