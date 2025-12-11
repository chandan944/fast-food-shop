import React, { useState } from 'react';

export const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    imgUrl: '',
    price: '',
    isAvailable: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price to number
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };
    
    onSubmit(productData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {product ? '✏️ Edit Product' : '➕ Create New Product'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="iPhone 15 Pro"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Amazing product with great features..."
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="999.99"
          />
        </div>

        {/* Availability */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="w-5 h-5 text-purple-600 rounded"
          />
          <label className="ml-3 text-sm font-medium text-gray-700">
            Product is available for sale
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            {product ? '💾 Update Product' : '➕ Create Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};