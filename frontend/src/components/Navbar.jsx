import React from 'react';
import { ShoppingCart, LogOut, Home, Package, Settings, BarChart3 } from 'lucide-react';

export default function Navbar({ isAdmin, cartCount, currentPage, onNavigate, onLogout }) {
  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center flex-wrap gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">Baito</h1>
            {isAdmin && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                Admin
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Products Button */}
            <button
              onClick={() => onNavigate('products')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                currentPage === 'products'
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home size={18} /> Products
            </button>

            {/* My Orders Button */}
            <button
              onClick={() => onNavigate('my-orders')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                currentPage === 'my-orders'
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package size={18} /> Orders
            </button>

            {/* Admin Buttons - Only visible if user is admin */}
            {isAdmin && (
              <>
                <button
                  onClick={() => onNavigate('admin-products')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                    currentPage === 'admin-products'
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={18} /> Manage Products
                </button>

                <button
                  onClick={() => onNavigate('admin-orders')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm ${
                    currentPage === 'admin-orders'
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 size={18} /> All Orders
                </button>
              </>
            )}

            {/* Cart Button with Badge */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative px-3 py-2 rounded-lg transition flex items-center gap-2 text-sm ${
                currentPage === 'cart'
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
              Cart
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}