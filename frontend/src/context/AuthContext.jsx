import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Authentication Context for Local Mart
 * Manages user login state, JWT token persistence, and role-based access controls.
 */
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage cache if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('localmart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize JWT token from localStorage cache
  const [token, setToken] = useState(() => {
    return localStorage.getItem('localmart_token');
  });

  /**
   * Log in user and cache JWT token + profile details in localStorage.
   */
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('localmart_token', newToken);
    localStorage.setItem('localmart_user', JSON.stringify(userData));
  };

  /**
   * Log out user and clear token cache.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('localmart_token');
    localStorage.removeItem('localmart_user');
  };

  // Re-verify current authenticated user details from backend API on mount
  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('localmart_user', JSON.stringify(res.data));
        })
        .catch(() => logout());
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isSeller: user?.role === 'SELLER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: Access authentication state and actions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
