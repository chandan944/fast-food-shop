import { fetchAPI } from './api';

export const authService = {
  login: async (email, password) => {
    const response = await fetchAPI('/authentication/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({ email, token: response.token }));
    }
    return response;
  },

  signup: async (name, email, password, contact, address) => {
    const response = await fetchAPI('/authentication/signin', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, contact, address }),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({ email, name, token: response.token }));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAdmin: (email) => {
    return ['max@gmail.com', 'chandan@gmail.com'].includes(email);
  },
};

export default authService;