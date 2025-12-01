import React, { useEffect, useState } from 'react';
import SearchInput from '../../components/SearchInput';
import { getPhotos, deletePhoto } from '../../services/photoServices';
import CustomAlert from '../../components/CustomAlert';
import ConfirmAlert from '../../components/ConfirmAlert';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import { useConfirmAlert } from '../../hooks/useConfirmAlert';

const PhotographsTab = ({ events, setShowAddPhotosModal, photosReloadKey, setEditingPhoto }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = filterEvent !== 'all' ? await getPhotos(filterEvent, null) : await getPhotos();
      setPhotos(Array.isArray(q) ? q : []);
    } catch (err) {
      console.error('Failed to load photos', err);
      setError(err?.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (photosReloadKey !== undefined) {
      fetchPhotos();
    }
  }, [photosReloadKey, filterEvent]);

  useEffect(() => {
    // initial load
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { alert, showSuccess, showError, hideAlert } = useCustomAlert();
  const { confirm, hideConfirm, confirmDelete } = useConfirmAlert();

  const handleEdit = (photo) => {
    if (setEditingPhoto) {
      setEditingPhoto(photo);
      setShowAddPhotosModal(true);
    }
  };

  const handleDelete = (id, filename) => {
    confirmDelete(filename || `#${id}`, async () => {
      try {
        await deletePhoto(id);
        await fetchPhotos();
        showSuccess('Deleted', 'Photo deleted successfully');
      } catch (err) {
        console.error('Delete failed:', err);
        showError('Error', 'Delete failed: ' + (err?.message || ''));
      }
    });
  };

  const filtered = photos.filter(p => {
    if (searchQuery && !p.filename.toLowerCase().includes(searchQuery.toLowerCase()) && !(p.photographer || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search photos or photographer..." />

            <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="all">All Events</option>
              {Array.isArray(events) && events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => { setShowAddPhotosModal(true); }} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-medium">Add Photos</button>
          </div>
        </div>
      </div>

      <CustomAlert
        isOpen={alert?.isOpen}
        onClose={hideAlert}
        title={alert?.title}
        message={alert?.message}
        type={alert?.type}
      />

      <ConfirmAlert
        isOpen={confirm?.isOpen}
        onClose={hideConfirm}
        onConfirm={confirm?.onConfirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmText={confirm?.confirmText}
        cancelText={confirm?.cancelText}
        type={confirm?.type}
      />

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Photographer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                      <span className="text-gray-300">Loading photos...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-red-400">{error}</td>
                </tr>
              )}

              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-300">No photos found.</td>
                </tr>
              )}

              {!loading && !error && filtered.map(photo => (
                <tr key={photo.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-24 h-16 object-cover rounded block"
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{(events.find(ev => ev.id === photo.eventId) || {}).title || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{photo.clubName || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{photo.photographer || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(photo.uploadedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <a href={photo.url} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-yellow-300">View</a>
                      <button onClick={() => handleEdit(photo)} className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDelete(photo.id, photo.filename)} className="text-red-500 hover:text-red-400">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhotographsTab;

