import React, { useState, useEffect } from "react";
import { Package, Plus } from "lucide-react";
import { productAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";
import { ProductForm } from "../components/ProductForm";

export const Home = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // ⭐ Popup state
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleView = (product) => {
    setSelectedProduct(product); // open popup
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await productAPI.createProduct(productData);
      setShowForm(false);
      loadProducts();
      alert("✅ Product created successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await productAPI.updateProduct(editProduct.id, productData);
      setEditProduct(null);
      setShowForm(false);
      loadProducts();
      alert("✅ Product updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productAPI.deleteProduct(id);
      loadProducts();
      alert("✅ Product deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Navbar />

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8">
            {!showForm ? (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditProduct(null);
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Product
              </button>
            ) : (
              <ProductForm
                product={editProduct}
                onSubmit={editProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={() => {
                  setShowForm(false);
                  setEditProduct(null);
                }}
              />
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No products available</p>
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Create First Product
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 🔥 Blur all background when popup is open */}
            <div className={selectedProduct ? "pointer-events-none blur-sm" : ""}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={handleView} // popup open
                    onEdit={handleEdit}
                    onDelete={handleDeleteProduct}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>

            {/* 🔥 POPUP CARD */}
            {selectedProduct && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">
                <div className="w-96 bg-white rounded-2xl shadow-2xl p-6">
                  <img
                    src={selectedProduct.imgUrl}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <h2 className="text-2xl font-bold mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {selectedProduct.description}
                  </p>

                  <p className="text-purple-600 text-3xl font-bold mb-4">
                    ${selectedProduct.price}
                  </p>

                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg w-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
