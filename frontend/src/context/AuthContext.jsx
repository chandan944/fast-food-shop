import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Admin emails list
const ADMIN_EMAILS = ['max@gmail.com', 'chandan@gmail.com'];

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      
      return { success: true, message: data.message };
    } catch (error) {
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await authAPI.signup(userData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      const user = await authAPI.getCurrentUser();
      setUser(user);
      
      return { success: true, message: data.message };
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};