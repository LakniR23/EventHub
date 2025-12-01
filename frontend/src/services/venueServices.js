import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const API_URL = `${API_BASE}/venues`;

const handleResponse = (res) => res.data;
const handleError = (err) => {
  console.error('Venue service error:', err?.response?.status, err?.response?.data || err.message);
  throw err;
};

export const getVenues = async () => {
  try {
    const res = await axios.get(API_URL);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const getVenueById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const createVenue = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const updateVenue = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const deleteVenue = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export default { getVenues, getVenueById, createVenue, updateVenue, deleteVenue };
