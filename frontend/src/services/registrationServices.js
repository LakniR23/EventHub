// Use relative base so dev proxy or same-origin deployments work without hard-coded host
const API_BASE_URL = '/api';

// Generic API call function with better error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const normalizedEndpoint = endpoint && endpoint.startsWith('/') ? endpoint : `/${endpoint || ''}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}`;

    // If caller passed FormData as body, don't set Content-Type (browser will set multipart boundary)
    const isFormData = options.body instanceof FormData;

    const config = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    // Try to parse JSON, but if the server returned HTML (e.g. dev server index) include a helpful snippet
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { __raw: text };
    }

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || data.__raw || `HTTP error ${response.status}`;
      const err = new Error(typeof message === 'string' ? message : JSON.stringify(message));
      err.status = response.status;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const getRegistrations = async () => {
  try {
    const res = await apiCall('/registrations');
    // apiCall returns either parsed JSON or object with .data or raw
    if (Array.isArray(res)) return res;
    if (res.data) return res.data;
    // If server returned raw HTML (dev server), throw a clearer error
    if (res.__raw) throw new Error(res.__raw.slice(0, 100));
    return [];
  } catch (err) {
    console.error('Error fetching registrations:', err);
    throw err;
  }
};

export const getRegistrationById = async (id) => {
  try {
    const res = await apiCall(`/registrations/${id}`);
    if (res.data) return res.data;
    if (res.__raw) throw new Error(res.__raw.slice(0, 200));
    return res;
  } catch (err) {
    console.error(`Error fetching registration ${id}:`, err);
    throw err;
  }
};

export const createRegistration = async (payload) => {
  try {
    const body = payload instanceof FormData ? payload : JSON.stringify(payload);
    const res = await apiCall('/registrations', {
      method: 'POST',
      body,
    });
    return res.data || res;
  } catch (err) {
    console.error('Error creating registration:', err);
    throw err;
  }
};

export const deleteRegistration = async (id) => {
  try {
    const res = await apiCall(`/registrations/${id}`, { method: 'DELETE' });
    return res;
  } catch (err) {
    console.error(`Error deleting registration ${id}:`, err);
    throw err;
  }
};

export default {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  deleteRegistration,
};
