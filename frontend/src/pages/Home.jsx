import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🏠 My Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* User Avatar & Greeting */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {user?.name}! 👋
            </h2>
            <p className="text-gray-600">Here's your profile information</p>
          </div>

          {/* User Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">👤</div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Full Name</p>
                  <p className="text-xl font-bold text-gray-800">{user?.name}</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">📧</div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email Address</p>
                  <p className="text-xl font-bold text-gray-800 break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">📱</div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Contact Number</p>
                  <p className="text-xl font-bold text-gray-800">{user?.contact}</p>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">🏠</div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Address</p>
                  <p className="text-xl font-bold text-gray-800">{user?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-2">🎉 Account Status: Active</h3>
            <p className="opacity-90">
              Your account is verified and ready to use!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};