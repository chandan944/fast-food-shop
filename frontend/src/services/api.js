// 🔧 Axios setup for API calls with proper error handling
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8080/api/v1/authentication';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
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

// ⭐ GLOBAL ERROR HANDLER ⭐
// Handles duplicate entries, SQL errors, login errors, etc.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "❌ Something went wrong.";
    let extracted = null;

    // When backend sends response
    if (error.response) {
      const { data, status } = error.response;

      // 1️⃣ Main backend message
      if (data?.message) {
        errorMessage = data.message;
      }

      // 2️⃣ Extract (+91xxxx...) from SQL detail
      if (data?.details) {
        const match = data.details.match(/\((.*?)\)/);  
        if (match && match[1]) {
          extracted = `${match[1]} already exists ❌`;
        }
      }

      // Prefer extracted phone/email → fallback to backend message
      errorMessage = extracted || errorMessage;

      // 3️⃣ Status-based error overrides
      if (status === 401) errorMessage = "❌ Invalid credentials.";
      if (status === 403) errorMessage = "❌ Access denied.";
      if (status === 404) errorMessage = "❌ Resource not found.";
      if (status >= 500) errorMessage = "❌ Server error. Try later.";
    }

    // Server unreachable
    else if (error.request) {
      errorMessage = "❌ Cannot reach server. Check your internet.";
    }

    // Unknown error
    else {
      errorMessage = error.message || "❌ Unexpected error.";
    }

    // Attach readable message
    error.userMessage = errorMessage;

    return Promise.reject(error);
  }
);

// API functions
export const api = {
  // 🔐 Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      return response.data;
    } catch (error) {
      toast.error(error.userMessage);
      throw error;
    }
  },

  // 🆕 Signup
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/signin', userData);
      return response.data;
    } catch (error) {
      toast.error(error.userMessage);
      throw error;
    }
  },

  // 🙋 Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      toast.error(error.userMessage);
      throw error;
    }
  },
};
