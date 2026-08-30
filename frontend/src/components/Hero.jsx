import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Heart } from 'lucide-react';

/**
 * Hero Section Component
 * Displays the main banner showcase with call-to-action buttons for the 3D studio and shop catalog.
 */
export const Hero = ({ onStartCustomizing, onExploreShop }) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Background Radial Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Direct From Master Artisans
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-100 leading-tight">
              Crafted by Hand, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                Designed by You.
              </span>
            </h1>

            <p className="text-lg text-stone-300 max-w-2xl font-light leading-relaxed">
              Explore authentic terracotta and glaze stoneware pottery from local craftsmen, or use our 3D Studio to custom design shape, size, glaze colors, and personalized text.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onStartCustomizing}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 font-bold text-base hover:shadow-xl hover:shadow-amber-600/20 hover:scale-[1.02] transition-all flex items-center gap-3"
              >
                Launch 3D Customizer
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreShop}
                className="px-8 py-4 rounded-full glass-card text-stone-200 font-semibold text-base hover:bg-stone-800 transition-colors"
              >
                Browse Shop Catalog
              </button>
            </div>

            {/* Feature Guarantee Pills */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-800/80 max-w-lg">
              <div className="flex flex-col items-center lg:items-start">
                <Flame className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs font-semibold text-stone-200">Kiln Fired</span>
                <span className="text-[11px] text-stone-400">1200°C Stoneware</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <ShieldCheck className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs font-semibold text-stone-200">100% Food Safe</span>
                <span className="text-[11px] text-stone-400">Non-toxic glazes</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Heart className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs font-semibold text-stone-200">Empower Local</span>
                <span className="text-[11px] text-stone-400">Fair trade compensation</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden glass-panel p-4 shadow-2xl border border-amber-600/20 group">
              <img
                src="https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800"
                alt="Artisan Pottery Showcase"
                className="w-full h-[400px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-8 left-8 right-8 text-left space-y-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-md backdrop-blur-md border border-amber-500/30">
                  Featured Creation
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-100">Classic Terracotta Amphora</h3>
                <p className="text-sm text-stone-300">Hand-thrown by Master Artisan Raj • Jaipur, Rajasthan</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-amber-400">$49.99</span>
                  <span className="text-xs text-stone-400">In Stock (15 Available)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
