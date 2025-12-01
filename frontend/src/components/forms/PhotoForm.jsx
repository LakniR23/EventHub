import React, { useState, useEffect } from 'react';
import { uploadEventPhotos, updatePhoto } from '../../services/photoServices';
import { getClubs } from '../../services/clubServices';

const PhotoForm = ({ isOpen, onClose, events, onUploaded, editingPhoto }) => {
  const [eventId, setEventId] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [clubId, setClubId] = useState('');
  const [caption, setCaption] = useState('');
  const [clubs, setClubs] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const isEditMode = Boolean(editingPhoto);

  useEffect(() => {
    const fetchClubs = async () => {
      if (isOpen) {
        try {
          const clubsData = await getClubs();
          setClubs(Array.isArray(clubsData) ? clubsData : []);
        } catch (err) {
          console.error('Failed to fetch clubs:', err);
          setClubs([]);
        }
      }
    };
    fetchClubs();
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (editingPhoto && isOpen) {
      setEventId(editingPhoto.eventId?.toString() || '');
      setClubId(editingPhoto.clubId?.toString() || '');
      setPhotographer(editingPhoto.photographer || '');
      setCaption(editingPhoto.caption || '');
      setFiles([]);
      setPreviews([]);
    } else if (!editingPhoto && isOpen) {
      // Reset form for add mode
      setEventId('');
      setClubId('');
      setPhotographer('');
      setCaption('');
      setFiles([]);
      setPreviews([]);
    }
  }, [editingPhoto, isOpen]);

  if (!isOpen) return null;

  const handleFiles = (e) => {
    const f = Array.from(e.target.files || []);
    if (f.length > 100) {
      setError('You can upload up to 100 photos at once.');
      return;
    }
    setError('');
    setFiles(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const f = Array.from(e.dataTransfer.files || []);
    if (f.length > 100) {
      setError('You can upload up to 100 photos at once.');
      return;
    }
    setError('');
    setFiles(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!eventId && !clubId) {
      return setError('Please select either an event or a club');
    }
    
    if (isEditMode) {
      // Update existing photo metadata
      try {
        setLoading(true);
        const updateData = {
          eventId: eventId || null,
          clubId: clubId || null,
          photographer: photographer || null,
          caption: caption || null,
        };
        await updatePhoto(editingPhoto.id, updateData);
        if (onUploaded) onUploaded();
        onClose();
      } catch (err) {
        console.error('Update failed', err);
        setError(err.message || 'Update failed');
      } finally {
        setLoading(false);
      }
    } else {
      // Upload new photos
      if (!files.length) return setError('Please select files to upload');

      const formData = new FormData();
      if (eventId) formData.append('eventId', eventId);
      if (clubId) formData.append('clubId', clubId);
      formData.append('photographerName', photographer);
      files.forEach(f => formData.append('photos', f));

      try {
        setLoading(true);
        const res = await uploadEventPhotos(formData);
        if (onUploaded) onUploaded(res);
        setFiles([]);
        setPhotographer('');
        setEventId('');
        setClubId('');
        setCaption('');
        onClose();
      } catch (err) {
        console.error('Upload failed', err);
        setError(err.message || 'Upload failed');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);

    return () => {
      urls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [files]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">
          {isEditMode ? 'Edit Photo' : 'Add Photos'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Event (optional - can be left blank for club-only photos)</label>
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-800 text-gray-100">
              <option value="">-- Select event --</option>
              {Array.isArray(events) && events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Club (optional - can be left blank for event-only photos)</label>
            <select value={clubId} onChange={(e) => setClubId(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-800 text-gray-100">
              <option value="">-- Select club --</option>
              {Array.isArray(clubs) && clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Photographer (optional)</label>
            <input value={photographer} onChange={(e) => setPhotographer(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-800 text-gray-100" />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Caption (optional)</label>
            <textarea 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
              rows="2"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-800 text-gray-100"
              placeholder="Add a caption for this photo..."
            />
          </div>

          {!isEditMode && (
          <div>
            <label className="block text-sm text-gray-300 mb-1">Photos</label>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`w-full flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-colors duration-150 ${isDragActive ? 'border-yellow-400 bg-yellow-600/5' : 'border-dashed border-gray-700 bg-black/40'}`}>
              <input id="photo-files-input" type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"/></svg>
              <div className="text-center">
                <label htmlFor="photo-files-input" className="cursor-pointer font-medium text-gray-200 hover:text-yellow-300">Click to select photos</label>
                <p className="text-xs text-gray-400 mt-1">or drag & drop images here (Up to 100 images)</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">Max file size per file enforced by server.</p>

            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-6 gap-2">
                {previews.map((src, idx) => (
                  <div key={idx} className="w-full h-20 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                    <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {isEditMode && editingPhoto && (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Current Photo:</h4>
              <img 
                src={editingPhoto.url} 
                alt={editingPhoto.filename} 
                className="w-32 h-24 object-cover rounded border border-gray-600"
              />
              <p className="text-xs text-gray-400 mt-2">{editingPhoto.filename}</p>
            </div>
          )}

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 text-white">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-semibold">
              {loading ? (isEditMode ? 'Updating...' : 'Uploading...') : (isEditMode ? 'Update Photo' : 'Upload Photos')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoForm;
