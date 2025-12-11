// 🔧 Complete API Service for Products & Auth
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred';

    if (error.response) {
      const { data } = error.response;
      
      if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }

      // Handle specific errors
      if (errorMessage.includes('duplicate') || errorMessage.includes('already exists') || errorMessage.includes('users_email_key')) {
        errorMessage = '❌ This email is already registered. Please use a different email or login.';
      }
      
      // Handle authorization errors
      if (error.response.status === 403) {
        errorMessage = '❌ You do not have permission to perform this action. Only admin users can create/edit/delete products.';
      }
    } else if (error.request) {
      errorMessage = '❌ Cannot connect to server. Please check your connection.';
    }

    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

// ============================================
// 🔐 AUTHENTICATION APIs
// ============================================
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/authentication/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.userMessage || 'Login failed');
    }
  },

  signup: async (userData) => {
    try {
      const response = await apiClient.post('/authentication/signin', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.userMessage || 'Signup failed');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/authentication/users/me');
      return response.data;
    } catch (error) {
      throw new Error(error.userMessage || 'Failed to fetch user');
    }
  },
};

// ============================================
// 📦 PRODUCT APIs - USING FORM-DATA
// ============================================
export const productAPI = {
  // Get all products (public)
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/product');
      return response.data;
    } catch (error) {
      throw new Error(error.userMessage || 'Failed to fetch products');
    }
  },

  // Get single product (public)
  getProduct: async (productId) => {
    try {
      const response = await apiClient.get(`/product/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.userMessage || 'Failed to fetch product');
    }
  },

  // Create product (admin only) - USING FORM-DATA
  createProduct: async (productData) => {
    try {
      // 🔥 Create FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('imgUrl', productData.imgUrl || '');
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('isAvailable', productData.isAvailable.toString());

      console.log('📤 Sending product data:', {
        name: productData.name,
        imgUrl: productData.imgUrl,
        description: productData.description,
        price: productData.price,
        isAvailable: productData.isAvailable
      });

      const response = await apiClient.post('/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Product created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create product error:', error);
      throw new Error(error.userMessage || 'Failed to create product');
    }
  },

  // Update product (admin only) - USING FORM-DATA
  updateProduct: async (productId, productData) => {
    try {
      // 🔥 Create FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('imgUrl', productData.imgUrl || '');
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('isAvailable', productData.isAvailable.toString());

      console.log('📤 Updating product:', productId, productData);

      const response = await apiClient.put(`/product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Product updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update product error:', error);
      throw new Error(error.userMessage || 'Failed to update product');
    }
  },

  // Delete product (admin only)
  deleteProduct: async (productId) => {
    try {
      console.log('🗑️ Deleting product:', productId);
      const response = await apiClient.delete(`/product/${productId}`);
      console.log('✅ Product deleted');
      return response.data;
    } catch (error) {
      console.error('❌ Delete product error:', error);
      throw new Error(error.userMessage || 'Failed to delete product');
    }
  },
};