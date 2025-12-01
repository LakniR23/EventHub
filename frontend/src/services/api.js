// API configuration and utility functions
import { eventServices } from './eventServices';

const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Export event services for backward compatibility
export const eventsAPI = {
  getAll: (filters) => eventServices.getAll(filters),
  getById: (id) => eventServices.getById(id),
  create: (eventData) => eventServices.create(eventData),
  update: (id, eventData) => eventServices.update(id, eventData),
  delete: (id) => eventServices.delete(id),
  getByCategory: (category) => eventServices.getByCategory(category),
  getByFaculty: (faculty) => eventServices.getByFaculty(faculty),
  search: (query) => eventServices.search(query),
  getFeatured: () => eventServices.getFeatured(),
  getStats: () => eventServices.getStats()
};

// Users API functions (if needed)
export const usersAPI = {
  getAll: async () => {
    const response = await apiCall('/users');
    return response.data;
  },

  create: async (userData) => {
    const response = await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await apiCall('/health');
    return response;
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export default { eventsAPI, usersAPI, healthCheck };