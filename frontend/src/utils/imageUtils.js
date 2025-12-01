// Utility functions for handling club images

/**
 * Save a base64 image data to session storage with a unique key
 * @param {string} filename - The filename to use as a key
 * @param {string} base64Data - The base64 image data
 */
export const saveImageToSession = (filename, base64Data, folder = 'clubs') => {
  try {
    // store with folder-specific key to support multiple image types
    sessionStorage.setItem(`${folder}-image-${filename}`, base64Data);
    return true;
  } catch (error) {
    console.error('Error saving image to session:', error);
    return false;
  }
};

/**
 * Retrieve a base64 image data from session storage
 * @param {string} filename - The filename to use as a key
 * @returns {string|null} - The base64 image data or null if not found
 */
export const getImageFromSession = (filename, folder = 'clubs') => {
  try {
    // try folder-specific key first, then fallback to club-specific key for backwards compatibility
    const folderKey = sessionStorage.getItem(`${folder}-image-${filename}`);
    if (folderKey) return folderKey;
    return sessionStorage.getItem(`club-image-${filename}`);
  } catch (error) {
    console.error('Error retrieving image from session:', error);
    return null;
  }
};

/**
 * Remove an image from session storage
 * @param {string} filename - The filename to use as a key
 */
export const removeImageFromSession = (filename, folder = 'clubs') => {
  try {
    sessionStorage.removeItem(`${folder}-image-${filename}`);
    // also attempt to remove old club key for compatibility
    try { sessionStorage.removeItem(`club-image-${filename}`); } catch (e) {}
    return true;
  } catch (error) {
    console.error('Error removing image from session:', error);
    return false;
  }
};

/**
 * Get the image URL for display - checks session storage first, then falls back to public folder
 * @param {string} filename - The image filename
 * @returns {string} - The image URL to use in src attribute
 */
/**
 * Generic image resolver. Supports full URLs/paths, session-stored previews, and public folder paths.
 * @param {string} filename - filename or path
 * @param {string} folder - public images subfolder (e.g., 'clubs', 'careers', 'venues')
 * @returns {string}
 */
export const getImageUrl = (filename, folder = 'clubs') => {
  // Backend origin used for uploaded images
  const API_ORIGIN = 'http://localhost:5000';

  // Use the project's existing placeholder image if no filename provided
  if (!filename) return `/images/${folder}/club-image.jpg`;

  // If filename already looks like a data URL, return as-is
  if (typeof filename === 'string' && filename.startsWith('data:')) return filename;

  // If it's an absolute URL, return as-is
  if (typeof filename === 'string' && (filename.startsWith('http://') || filename.startsWith('https://'))) return filename;

  // Check session storage for a preview (folder-specific key or legacy club key)
  const sessionImage = getImageFromSession(filename, folder);
  if (sessionImage) return sessionImage;

  // If it starts with a leading slash and points to the frontend public images folder, return as-is
  if (typeof filename === 'string' && filename.startsWith('/images/')) return filename;

  // If it starts with a leading slash, assume it's a backend-served path (uploads, etc.) and prefix origin
  if (typeof filename === 'string' && filename.startsWith('/')) return `${API_ORIGIN}${filename}`;

  // If it looks like a path (contains '/') assume it's relative to backend (e.g., 'uploads/..') and prefix origin
  if (typeof filename === 'string' && filename.includes('/')) return `${API_ORIGIN}/${filename}`;

  // Otherwise assume it's just a filename stored in uploads
  // Use folder-specific uploads path (e.g., /uploads/club-photos/<filename>)
  return `${API_ORIGIN}/uploads/${folder}-photos/${filename}`;
};

// Backwards-compatible helper
// Use singular `club` so uploads path becomes `/uploads/club-photos/<filename>`
export const getClubImageUrl = (filename) => getImageUrl(filename, 'club');

export const getCareerImageUrl = (filename) => getImageUrl(filename, 'careers');
export const getVenueImageUrl = (filename) => getImageUrl(filename, 'venues');

/**
 * Create a placeholder/default club image
 * @param {string} clubName - The name of the club to create initials from
 * @returns {string} - A data URL for a generated placeholder image
 */
export const createPlaceholderImage = (clubName) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 200;
  canvas.height = 200;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 200, 200);
  gradient.addColorStop(0, '#4F46E5');
  gradient.addColorStop(1, '#7C3AED');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 200, 200);
  
  // Text (initials)
  const initials = clubName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, 100, 100);
  
  return canvas.toDataURL('image/png');
};