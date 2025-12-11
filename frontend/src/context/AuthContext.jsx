import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // 🔄 Check authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        try {
          // Verify token by fetching user data
          const userData = await api.getCurrentUser();
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          // Token is invalid, clear it
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // 🔐 Login function
  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Fetch user data
      const userData = await api.getCurrentUser();
      setUser(userData);
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // 🆕 Signup function
  const signup = async (userData) => {
    try {
      const data = await api.signup(userData);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Fetch user data
      const user = await api.getCurrentUser();
      setUser(user);
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  // 🚪 Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};