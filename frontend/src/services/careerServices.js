const API_BASE_URL = 'http://localhost:5000/api';

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
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json') ? await response.json() : { message: await response.text() };

    if (!response.ok) throw new Error(data.message || `HTTP error ${response.status}`);
    return data;
  } catch (err) {
    console.error('Career API error:', err);
    throw err;
  }
};

export const getCareers = async () => {
  const res = await apiCall('/careers');
  return Array.isArray(res) ? res : (res.data || []);
};

export const getCareerById = async (id) => {
  const res = await apiCall(`/careers/${id}`);
  return res.data || res;
};

export const createCareer = async (payload) => {
  const res = await apiCall('/careers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data || res;
};

export const updateCareer = async (id, payload) => {
  const res = await apiCall(`/careers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data || res;
};

export const deleteCareer = async (id) => {
  const res = await apiCall(`/careers/${id}`, {
    method: 'DELETE'
  });
  return res;
};

export default { getCareers, getCareerById, createCareer, updateCareer, deleteCareer };