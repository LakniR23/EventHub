// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function (similar to the one in api.js)
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

// Base API URL for clubs
const CLUBS_API_BASE = '/clubs';

// Get all clubs
export const getClubs = async () => {
  try {
    const response = await apiCall(CLUBS_API_BASE);
    return response;
  } catch (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }
};

// Get a single club by ID
export const getClub = async (id) => {
  try {
    const response = await apiCall(`${CLUBS_API_BASE}/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching club:', error);
    throw error;
  }
};

// Create a new club
export const createClub = async (clubData) => {
  try {
    const response = await apiCall(CLUBS_API_BASE, {
      method: 'POST',
      body: JSON.stringify(clubData),
    });
    return response;
  } catch (error) {
    console.error('Error creating club:', error);
    throw error;
  }
};

// Update an existing club
export const updateClub = async (id, clubData) => {
  try {
    const response = await apiCall(`${CLUBS_API_BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clubData),
    });
    return response;
  } catch (error) {
    console.error('Error updating club:', error);
    throw error;
  }
};

// Delete a club
export const deleteClub = async (id) => {
  try {
    const response = await apiCall(`${CLUBS_API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
};