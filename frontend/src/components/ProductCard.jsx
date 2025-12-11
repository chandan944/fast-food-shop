import React from 'react';
import { Camera, Edit, Trash2 } from 'lucide-react';

export const ProductCard = ({ product, onView, onEdit, onDelete, isAdmin }) => {
    console.log(product);
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        {product.imgUrl ? (
          <img 
            src={product.imgUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <Camera className="w-16 h-16 text-gray-400" />
        )}
        
        {/* Availability Badge */}
        {product.isAvailable ? (
          <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✅ Available
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ❌ Out of Stock
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-purple-600">
            ${product.price}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(product)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            View Details
          </button>
          
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(product)}
                className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
                title="Edit Product"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                title="Delete Product"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};