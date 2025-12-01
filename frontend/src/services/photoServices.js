let API_BASE = 'http://localhost:5000/api';
try {
  // When running with Vite, `import.meta.env.VITE_API_BASE` can override the API base URL.
  if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) {
    API_BASE = import.meta.env.VITE_API_BASE;
  }
} catch (e) {
  // ignore (e.g. import.meta not supported in some environments)
}
const PHOTOS_URL = `${API_BASE}/photos`;
const ADMIN_PHOTOS_URL = `${API_BASE}/admin/photos`;
// derive server origin (remove trailing /api if present)
const API_ORIGIN = API_BASE.replace(/\/api$/, '');

export const uploadEventPhotos = async (formData) => {
  // formData should be a FormData with keys: eventId, photographerName, photos[]
  const res = await fetch(ADMIN_PHOTOS_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Upload failed');
  }

  return res.json();
};

export const getPhotos = async (eventId = null, clubId = null) => {
  let url = PHOTOS_URL;
  const params = new URLSearchParams();
  
  if (eventId) params.append('eventId', eventId);
  if (clubId) params.append('clubId', clubId);
  
  if (params.toString()) {
    url += '?' + params.toString();
  }
  
  const res = await fetch(url);
  if (!res.ok) {
    let body = '';
    try {
      body = await res.text();
    } catch (e) {
      body = res.statusText || '';
    }
    throw new Error(`Failed to fetch photos: ${res.status} ${body}`);
  }
  const data = await res.json();
  // normalize photo URLs to be fully qualified so <img src=...> loads from backend
  if (Array.isArray(data)) {
    return data.map(p => ({
      ...p,
      url: (p.url && p.url.startsWith('/')) ? `${API_ORIGIN}${p.url}` : p.url
    }));
  }
  return data;
};

export const getClubPhotos = async (clubId) => {
  return getPhotos(null, clubId);
};

export const updatePhoto = async (id, updateData) => {
  const res = await fetch(`${PHOTOS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    let txt = '';
    try { txt = await res.text(); } catch (e) { txt = res.statusText || ''; }
    throw new Error(`Failed to update photo: ${res.status} ${txt}`);
  }
  return res.json();
};

export const deletePhoto = async (id) => {
  const res = await fetch(`${PHOTOS_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    let txt = '';
    try { txt = await res.text(); } catch (e) { txt = res.statusText || ''; }
    throw new Error(`Failed to delete photo: ${res.status} ${txt}`);
  }
  return res.json();
};

export default { uploadEventPhotos, getPhotos, getClubPhotos, updatePhoto, deletePhoto };
