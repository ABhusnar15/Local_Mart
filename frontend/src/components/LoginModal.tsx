import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Store, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const payload = {
          name,
          email,
          password,
          role,
          phone,
          address,
          shopName: role === 'SELLER' ? shopName : undefined,
        };
        const res = await api.post('/auth/register', payload);
        login(res.data.token, {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          shopName: res.data.shopName,
        });
        onClose();
      } else {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.token, {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          shopName: res.data.shopName,
        });
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoBuyer = () => {
    setEmail('buyer@localmart.com');
    setPassword('buyer123');
    setIsSignUp(false);
  };

  const handleQuickDemoSeller = () => {
    setEmail('artisan@localmart.com');
    setPassword('artisan123');
    setIsSignUp(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl z-10 shadow-2xl border border-stone-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-serif text-stone-100">
            {isSignUp ? 'Join Local Mart' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {isSignUp ? 'Create a buyer or artisan seller account' : 'Sign in to manage orders & custom studio designs'}
          </p>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-stone-950/80 p-3 rounded-2xl mb-6 text-center border border-stone-800 space-y-2">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">⚡ One-Click Demo Credentials</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoBuyer}
              className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
            >
              Demo Buyer
            </button>
            <button
              type="button"
              onClick={handleQuickDemoSeller}
              className="py-1.5 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-xs font-medium transition-colors border border-amber-800/40"
            >
              Demo Artisan Seller
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <>
              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-900 rounded-xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`py-2 rounded-lg font-semibold transition-all ${
                    role === 'BUYER' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  Customer / Buyer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`py-2 rounded-lg font-semibold transition-all ${
                    role === 'SELLER' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  Artisan Seller
                </button>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aria Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500"
                  />
                </div>
              </div>

              {role === 'SELLER' && (
                <div>
                  <label className="block text-stone-300 mb-1">Artisan Shop Name</label>
                  <div className="relative">
                    <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Jaipur Royal Clayware"
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-stone-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@localmart.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-700/80 rounded-xl text-stone-100 placeholder-stone-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl glaze-terracotta text-stone-950 font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-amber-900/20 mt-2"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stone-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-amber-400 font-semibold hover:underline ml-1"
          >
            {isSignUp ? 'Sign In' : 'Register Now'}
          </button>
        </div>

      </div>
    </div>
  );
};
