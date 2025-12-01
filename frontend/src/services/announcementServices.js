import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const API_URL = `${API_BASE}/announcements`;

const handleResponse = (res) => {
  // axios returns data directly
  return res.data;
};

const handleError = (err) => {
  console.error('Announcement service error:', err?.response?.status, err?.response?.data || err.message);
  throw err;
};

export const getAnnouncements = async () => {
  try {
    const res = await axios.get(API_URL);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const getAnnouncementById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const createAnnouncement = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};
