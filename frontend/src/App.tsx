import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Shop } from './components/Shop';
import { ProductCustomizer } from './components/ProductCustomizer';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { Cart } from './components/Cart';
import { LoginModal } from './components/LoginModal';
import { Sparkles, Heart, MapPin, ShieldCheck, Instagram, Twitter, Facebook } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shop' | 'customizer' | 'buyer' | 'seller'>('shop');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Dynamic View rendering based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'shop' && (
          <>
            <Hero
              onStartCustomizing={() => setActiveTab('customizer')}
              onExploreShop={() => {
                const shopElem = document.getElementById('shop-catalog-section');
                if (shopElem) shopElem.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <div id="shop-catalog-section">
              <Shop onCustomizeClick={() => setActiveTab('customizer')} />
            </div>
          </>
        )}

        {activeTab === 'customizer' && <ProductCustomizer />}

        {activeTab === 'buyer' && <BuyerDashboard />}

        {activeTab === 'seller' && <SellerDashboard />}
      </main>

      {/* Slide-over Shopping Cart */}
      <Cart />

      {/* User Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-stone-800/80 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg glaze-terracotta flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-100" />
                </div>
                <span className="text-xl font-serif font-bold text-stone-100">LocalMart</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct artisan pottery marketplace empowering local craftsmen with custom 3D design studio capabilities.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>
                  <button onClick={() => setActiveTab('shop')} className="hover:text-amber-400 transition-colors">
                    Artisan Catalog
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('customizer')} className="hover:text-amber-400 transition-colors">
                    3D Pottery Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('buyer')} className="hover:text-amber-400 transition-colors">
                    Customer Orders
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('seller')} className="hover:text-amber-400 transition-colors">
                    Artisan Seller Portal
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Artisan Crafting</h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> 100% Non-Toxic Mineral Glazes
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" /> Hand-Thrown in Jaipur, India
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-500" /> Direct Fair-Trade Proceeds
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Connect Studio</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="p-2.5 rounded-xl bg-stone-900 text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2.5 rounded-xl bg-stone-900 text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2.5 rounded-xl bg-stone-900 text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/80 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Local Mart Artisan Marketplace. All rights reserved.</p>
            <p className="font-mono text-[11px]">React + Java Spring Boot Architecture</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </AuthProvider>
  );
}
