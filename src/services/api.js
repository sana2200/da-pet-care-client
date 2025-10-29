// API configuration and utilities for connecting to backend
// Vite exposes env variables on import.meta.env
const API_BASE_URL = (import.meta?.env?.VITE_API_URL || 'http://localhost:3000') + '/api';

// Create API client with authentication
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper to get auth token from Firebase
  async getAuthToken() {
     const { auth } = await import('../components/firebase');
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP method shortcuts
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      ...options,
    });
  }

  put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// API service functions
export const api = {
  // Services
  services: {
    getAll: () => apiClient.get('/services'),
    getById: (id) => apiClient.get(`/services/${id}`),
    getAvailability: (id, date) => apiClient.get(`/services/${id}/availability/${date}`),
  },

  // Bookings
  bookings: {
    create: (bookingData) => apiClient.post('/bookings', bookingData),
    getAll: () => apiClient.get('/bookings'),
    getById: (id) => apiClient.get(`/bookings/${id}`),
    updateStatus: (id, status) => apiClient.put(`/bookings/${id}/status`, { status }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return apiClient.get(`/products?${searchParams}`);
    },
    getById: (id) => apiClient.get(`/products/${id}`),
    addReview: (id, review) => apiClient.post(`/products/${id}/reviews`, review),
    getReviews: (id) => apiClient.get(`/products/${id}/reviews`),
  },

  // Orders
  orders: {
    create: (orderData) => apiClient.post('/orders', orderData),
    getAll: () => apiClient.get('/orders'),
    getById: (id) => apiClient.get(`/orders/${id}`),
    cancel: (id) => apiClient.put(`/orders/${id}/cancel`),
  },

  // Contact
  contact: {
    submit: (contactData) => apiClient.post('/contact', contactData),
    getFAQs: () => apiClient.get('/contact/faq'),
  },

  // User profile (sync with backend)
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (profileData) => apiClient.put('/users/profile', profileData),
    getBookings: () => apiClient.get('/users/bookings'),
    getOrders: () => apiClient.get('/users/orders'),
  },
};

export default apiClient;