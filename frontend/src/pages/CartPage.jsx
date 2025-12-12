import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import orderService from '../services/orderService';

export default function CartPage({ cart, onRemoveFromCart, onUpdateQuantity, onClearCart, onNavigate }) {
  const [checkoutForm, setCheckoutForm] = useState({ username: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await orderService.createOrder(
        checkoutForm.username,
        checkoutForm.phone,
        checkoutForm.address,
        cart
      );
      onClearCart();
      setCheckoutForm({ username: '', phone: '', address: '' });
      alert('Order placed successfully!');
      onNavigate('my-orders');
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
        <button
          onClick={() => onNavigate('products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          {cart.map(item => (
            <div key={item.productId} className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  −
                </button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => onRemoveFromCart(item.productId)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg shadow p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6 border-b pb-3">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold text-blue-600">₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={checkoutForm.username}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={checkoutForm.phone}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={checkoutForm.address}
              onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}