import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/home" className="flex items-center gap-3 hover:opacity-80 transition">
          <ShoppingBag className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Product Store</h1>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
            {isAdmin && (
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                Admin
              </span>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};