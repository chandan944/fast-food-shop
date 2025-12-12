// ============================================
// FILE: src/App.jsx
// Path: ecommerce-frontend/src/App.jsx
// ============================================

import React, { useState, useEffect } from 'react';


import LoginPage from './pages/Login';
import authService from './services/authService';
import SignupPage from './pages/SignUp';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

export default function App() {
  // ==================== STATE MANAGEMENT ====================
  
  // Current page to display
  const [currentPage, setCurrentPage] = useState('login');
  
  // User information (email, name, token)
  const [user, setUser] = useState(null);
  
  // Is current user admin?
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Shopping cart items
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ==================== INITIALIZATION ====================
  
  // Check if user is already logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAdmin(authService.isAdmin(userData.email));
        setCurrentPage('products');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ==================== CART PERSISTENCE ====================
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ==================== AUTHENTICATION HANDLERS ====================

  /**
   * Handle user login
   * @param {Object} userData - User data from login response
   */
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAdmin(userData.isAdmin);
    setCurrentPage('products');
  };

  /**
   * Handle user signup
   * @param {Object} userData - User data from signup response
   */
  const handleSignup = (userData) => {
    setUser(userData);
    setIsAdmin(userData.isAdmin);
    setCurrentPage('products');
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
    setCart([]);
    setCurrentPage('login');
  };

  // ==================== CART HANDLERS ====================

  /**
   * Add product to cart
   * If product already in cart, increase quantity
   * Otherwise, add new item
   * @param {Object} product - Product to add
   */
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Product already in cart - increase quantity
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // New product - add to cart
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }]);
    }
  };

  /**
   * Remove product from cart
   * @param {number} productId - ID of product to remove
   */
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  /**
   * Update product quantity in cart
   * If quantity becomes 0 or less, remove from cart
   * @param {number} productId - ID of product
   * @param {number} quantity - New quantity
   */
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      ));
    }
  };

  /**
   * Clear entire cart (after checkout)
   */
  const clearCart = () => {
    setCart([]);
  };

  // ==================== RENDER LOGIC ====================

  // Show login/signup pages if user not authenticated
  if (!user) {
    return (
      <>
        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLogin} 
            onNavigate={setCurrentPage} 
          />
        )}
        {currentPage === 'signup' && (
          <SignupPage
            onSignup={handleSignup} 
            onNavigate={setCurrentPage} 
          />
        )}
      </>
    );
  }

  // Show authenticated app layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar
        isAdmin={isAdmin}
        cartCount={cart.length}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Products Page */}
        {currentPage === 'products' && (
          <ProductsPage onAddToCart={addToCart} />
        )}

        {/* Shopping Cart Page */}
        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            onClearCart={clearCart}
            onNavigate={setCurrentPage}
          />
        )}

        {/* User's Orders Page */}
        {currentPage === 'my-orders' && (
          <MyOrdersPage />
        )}

        {/* Admin: Manage Products Page */}
        {currentPage === 'admin-products' && isAdmin && (
          <AdminProductsPage />
        )}

        {/* Admin: Manage Orders Page */}
        {currentPage === 'admin-orders' && isAdmin && (
          <AdminOrdersPage />
        )}
      </div>
    </div>
  );
}