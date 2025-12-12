import { fetchAPI } from './api';

export const productService = {
  getAllProducts: async () => {
    return fetchAPI('/product', { method: 'GET' });
  },

  getProduct: async (productId) => {
    return fetchAPI(`/product/${productId}`, { method: 'GET' });
  },

  createProduct: async (name, description, price, imgUrl, isAvailable) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('imgUrl', imgUrl);
    formData.append('isAvailable', isAvailable);

    const token = localStorage.getItem('token');
    const response = await fetch(
      'http://localhost:8080/api/v1/product',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },

  updateProduct: async (productId, name, description, price, imgUrl, isAvailable) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('imgUrl', imgUrl);
    formData.append('isAvailable', isAvailable);

    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/api/v1/product/${productId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  },

  deleteProduct: async (productId) => {
    return fetchAPI(`/product/${productId}`, { method: 'DELETE' });
  },
};

export default productService;