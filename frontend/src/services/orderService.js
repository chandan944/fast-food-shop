import { fetchAPI } from './api';

export const orderService = {
  // Create order with items
  createOrder: async (username, phone, address, items) => {
    return fetchAPI('/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        username,
        phone,
        address,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });
  },

  // Get user's orders
  getMyOrders: async () => {
    return fetchAPI('/orders/my', { method: 'GET' });
  },

  // Get all orders (admin)
  getAllOrders: async (filter = null) => {
    const url = filter ? `/orders/all?filter=${filter}` : '/orders/all';
    return fetchAPI(url, { method: 'GET' });
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId, status) => {
    return fetchAPI(`/orders/${orderId}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  // Increase product quantity
  increaseQuantity: async (orderId, productId, quantity) => {
    return fetchAPI(
      `/orders/${orderId}/product/${productId}/increase?quantity=${quantity}`,
      { method: 'PUT' }
    );
  },

  // Decrease product quantity
  decreaseQuantity: async (orderId, productId, quantity) => {
    return fetchAPI(
      `/orders/${orderId}/product/${productId}/decrease?quantity=${quantity}`,
      { method: 'PUT' }
    );
  },
};

export default orderService;