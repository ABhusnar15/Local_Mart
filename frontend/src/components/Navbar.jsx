import React from 'react';
import { ShoppingBag, Palette, Store, User as UserIcon, LogOut, PackageCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Navbar Component
 * Renders the brand logo, navigation tabs (Shop, 3D Studio, My Orders, Seller Portal),
 * shopping cart counter badge, and user authentication state.
 */
export const Navbar = ({ activeTab, setActiveTab, openLoginModal }) => {
  const { user, isAuthenticated, logout, isSeller } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Studio Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('shop')}
        >
          <div className="w-11 h-11 rounded-xl glaze-terracotta flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
            <Palette className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-100 group-hover:text-amber-500 transition-colors">
              Local<span className="text-amber-500 font-sans font-light">Mart</span>
            </h1>
            <p className="text-[10px] tracking-widest uppercase text-stone-400 font-medium">Artisan Studio & Marketplace</p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 bg-stone-900/80 p-1.5 rounded-full border border-stone-800">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow-md'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <Store className="w-4 h-4" />
            Artisan Shop
          </button>

          <button
            onClick={() => setActiveTab('customizer')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'customizer'
                ? 'bg-amber-600 text-stone-950 font-semibold shadow-md'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            3D Pottery Studio
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'buyer'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow-md'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              My Orders
            </button>
          )}

          {isSeller && (
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'seller'
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow-md'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Seller Portal
            </button>
          )}
        </nav>

        {/* Right Controls: Cart Drawer & User Auth Toggle */}
        <div className="flex items-center gap-3">
          {/* Cart Icon Button with Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-amber-400 transition-colors border border-stone-700/50"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authentication State Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-stone-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-stone-200">{user?.name}</p>
                <span className="text-[10px] text-amber-500 uppercase tracking-wider">{user?.role}</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 rounded-full text-stone-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-semibold text-sm hover:from-amber-500 hover:to-amber-600 transition-all shadow-md shadow-amber-900/20"
            >
              <UserIcon className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
