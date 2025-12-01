import { useState, useEffect } from 'react';

const defaultCategories = [
  'AUDITORIUM',
  'LECTURE_HALL',
  'LABORATORY',
  'SPORTS_FACILITY',
  'OUTDOOR_VENUE',
  'CONFERENCE_ROOM',
  'COMPUTER_LAB',
  'SEMINAR_HALL',
  'MULTIPURPOSE_HALL',
  'WORKSHOP_SPACE'
];

const VenueForm = ({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) => {
  const [form, setForm] = useState({
    name: '',
    category: 'AUDITORIUM',
    capacity: '',
    location: '',
    description: '',
    bookingContact: '',
    isActive: true,
    availability: 'AVAILABLE',
    directionsFromMainGate: '',
    directionsFromParking: '',
    bookingInstructions: '',
    specialRequirements: '',
    floor: '',
    building: '',
    roomNumber: '',
    hourlyRate: '',
    dailyRate: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [tags, setTags] = useState({ facilities: [], landmarks: [], nearbyFacilities: [], suitableEvents: [], accessibilityFeatures: [] });
  const [tagInputs, setTagInputs] = useState({ facilities: '', landmarks: '', nearbyFacilities: '', suitableEvents: '', accessibilityFeatures: '' });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        category: initialData.category || 'AUDITORIUM',
        capacity: initialData.capacity ? String(initialData.capacity) : '',
        location: initialData.location || '',
        description: initialData.description || '',
        bookingContact: initialData.bookingContact || '',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        availability: initialData.availability || 'AVAILABLE',
        directionsFromMainGate: initialData.directionsFromMainGate || '',
        directionsFromParking: initialData.directionsFromParking || '',
        bookingInstructions: initialData.bookingInstructions || '',
        specialRequirements: initialData.specialRequirements || '',
        floor: initialData.floor || '',
        building: initialData.building || '',
        roomNumber: initialData.roomNumber || '',
        hourlyRate: initialData.hourlyRate ? String(initialData.hourlyRate) : '',
        dailyRate: initialData.dailyRate ? String(initialData.dailyRate) : ''
      });

      setTags(prev => ({
        facilities: parseToArray(initialData.facilities || initialData.facilitiesRaw || initialData.facilityList),
        landmarks: parseToArray(initialData.landmarks || initialData.landmarksRaw),
        nearbyFacilities: parseToArray(initialData.nearbyFacilities || initialData.nearby_facilities),
        suitableEvents: parseToArray(initialData.suitableEvents || initialData.suitable_events || initialData.events),
        accessibilityFeatures: parseToArray(initialData.accessibilityFeatures || initialData.accessibility_features)
      }));

      if (initialData.image) setPreviewUrl(initialData.image);
      else setPreviewUrl('');
    } else {
      setForm({ name: '', category: 'AUDITORIUM', capacity: '', location: '', description: '', bookingContact: '', isActive: true, availability: 'AVAILABLE', directionsFromMainGate: '', directionsFromParking: '', bookingInstructions: '', specialRequirements: '', floor: '', building: '', roomNumber: '', hourlyRate: '', dailyRate: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      setTags({ facilities: [], landmarks: [], nearbyFacilities: [], suitableEvents: [], accessibilityFeatures: [] });
      setTagInputs({ facilities: '', landmarks: '', nearbyFacilities: '', suitableEvents: '', accessibilityFeatures: '' });
    }
  }, [initialData, isOpen]);

  const formatSentenceCase = (value) => {
    if (!value && value !== 0) return '';
    try {
      const str = String(value).replace(/_/g, ' ').toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (err) {
      return String(value);
    }
  };

  const parseToArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      const s = val.trim();
      try {
        if (s.startsWith('[') || s.startsWith('{')) {
          const parsed = JSON.parse(s);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        // fallthrough to CSV/newline parsing
      }
      return s.split(/\r?\n|,/).map(p => p.trim()).filter(Boolean);
    }
    return [];
  };

  const parseTechnicalSpecsInput = (val) => {
    if (!val) return undefined;
    if (typeof val === 'object') return val;
    const s = String(val).trim();
    if (!s) return undefined;
    try {
      if (s.startsWith('{') || s.startsWith('[')) return JSON.parse(s);
    } catch (e) {
      // ignore
    }
    // parse key:value lines into object
    const obj = {};
    s.split(/\r?\n/).map(l => l.trim()).filter(Boolean).forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        obj[key] = val;
      }
    });
    return Object.keys(obj).length ? obj : undefined;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const addTag = (key) => {
    const value = (tagInputs[key] || '').trim();
    if (!value) return;
    setTags(prev => ({ ...prev, [key]: [...new Set([...prev[key], value])] }));
    setTagInputs(prev => ({ ...prev, [key]: '' }));
  };

  const removeTag = (key, t) => setTags(prev => ({ ...prev, [key]: prev[key].filter(x => x !== t) }));

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const parseListField = (value) => {
    if (!value) return null;
    if (Array.isArray(value)) return JSON.stringify(value);
    const s = String(value).trim();
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) return s;
    const parts = s.split(/\r?\n|,/).map(p => p.trim()).filter(Boolean);
    if (parts.length <= 1) return s;
    return JSON.stringify(parts);
  };

  const validate = () => {
    const next = {};
    if (!form.name || !form.name.trim()) next.name = 'Name is required.';
    if (!form.bookingContact || !form.bookingContact.trim()) next.bookingContact = 'Booking contact is required.';
    if (form.capacity && Number(form.capacity) < 0) next.capacity = 'Capacity must be positive.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Build payload using arrays/objects (not JSON strings). Use undefined for omitted fields so JSON.stringify drops them.
    const payload = {
      name: form.name,
      category: form.category,
      capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
      location: form.location || undefined,
      description: form.description || undefined,
      bookingContact: form.bookingContact,
      isActive: form.isActive,
      availability: form.availability || undefined,
      directionsFromMainGate: form.directionsFromMainGate || undefined,
      directionsFromParking: form.directionsFromParking || undefined,
      bookingInstructions: form.bookingInstructions || undefined,
      specialRequirements: form.specialRequirements || undefined,
      floor: form.floor || undefined,
      building: form.building || undefined,
      roomNumber: form.roomNumber || undefined,
      hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : undefined,
      dailyRate: form.dailyRate ? parseFloat(form.dailyRate) : undefined,
      facilities: tags.facilities && tags.facilities.length ? tags.facilities : undefined,
      landmarks: tags.landmarks && tags.landmarks.length ? tags.landmarks : undefined,
      nearbyFacilities: tags.nearbyFacilities && tags.nearbyFacilities.length ? tags.nearbyFacilities : undefined,
      suitableEvents: tags.suitableEvents && tags.suitableEvents.length ? tags.suitableEvents : undefined,
      accessibilityFeatures: tags.accessibilityFeatures && tags.accessibilityFeatures.length ? tags.accessibilityFeatures : undefined,
      technicalSpecs: parseTechnicalSpecsInput(form.technicalSpecs)
    };

    if (selectedFile) {
      try {
        const dataUrl = await fileToDataUrl(selectedFile);
        payload.image = dataUrl;
      } catch (err) {
        console.error('Failed to read image file:', err);
      }
    }

    // Remove undefined keys (JSON.stringify will drop them, but ensure payload doesn't contain explicit null)
    Object.keys(payload).forEach(k => {
      if (payload[k] === undefined) delete payload[k];
    });

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-200 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">{mode === 'edit' ? 'Edit Venue' : 'Add Venue'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-2">
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Name *</label>
            <input type="text" value={form.name} onChange={handleChange('name')} required className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={form.category} onChange={handleChange('category')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                {defaultCategories.map(cat => <option key={cat} value={cat}>{formatSentenceCase(cat)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
              <input type="number" min={0} value={form.capacity} onChange={handleChange('capacity')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
              {errors.capacity && <p className="text-xs text-red-400 mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select value={form.availability} onChange={handleChange('availability')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="WEATHER_DEPENDENT">Weather Dependent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Location</label>
            <input type="text" value={form.location} onChange={handleChange('location')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
            <textarea value={form.description} onChange={handleChange('description')} rows={3} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Booking Contact *</label>
            <input type="text" value={form.bookingContact} onChange={handleChange('bookingContact')} required className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            {errors.bookingContact && <p className="text-xs text-red-400 mt-1">{errors.bookingContact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Image</label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800/20 hover:bg-gray-800/30">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <svg className="w-7 h-7 mb-1 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB (optional)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              {previewUrl && (
                <div className="relative">
                  <img src={previewUrl} alt="Venue preview" className="w-full h-40 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setSelectedFile(null); setPreviewUrl(''); const fileInputs = document.querySelectorAll('input[type="file"][accept="image/*"]'); fileInputs.forEach(input => input.value = ''); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
            </div>
            <p id="image-desc" className="mt-2 text-sm text-gray-400">Upload an optional representative image for this venue.</p>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setAdvancedOpen(s => !s)} className="text-sm text-yellow-400">{advancedOpen ? 'Hide Advanced' : 'Show Advanced Options'}</button>
            <div className="flex items-center gap-4">
              <input id="isActive" type="checkbox" checked={form.isActive} onChange={handleChange('isActive')} className="accent-yellow-500" />
              <label htmlFor="isActive" className="text-sm text-gray-200">Active</label>
            </div>
          </div>

          {advancedOpen && (
            <div className="space-y-4 border-t border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Directions From Main Gate</label>
                  <input type="text" value={form.directionsFromMainGate} onChange={handleChange('directionsFromMainGate')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Directions From Parking</label>
                  <input type="text" value={form.directionsFromParking} onChange={handleChange('directionsFromParking')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Facilities (add and press Add)</label>
                <div className="flex gap-2">
                  <input value={tagInputs.facilities} onChange={(e) => setTagInputs(prev => ({ ...prev, facilities: e.target.value }))} placeholder="e.g., Projector" className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                  <button type="button" onClick={() => addTag('facilities')} className="px-3 py-2 bg-yellow-500 text-black rounded-lg">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">{tags.facilities.map(t => <span key={t} className="bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center gap-2"><small>{t}</small><button type="button" onClick={() => removeTag('facilities', t)} className="text-xs text-red-300">✕</button></span>)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Nearby Facilities</label>
                  <div className="flex gap-2">
                    <input value={tagInputs.nearbyFacilities} onChange={(e) => setTagInputs(prev => ({ ...prev, nearbyFacilities: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                    <button type="button" onClick={() => addTag('nearbyFacilities')} className="px-3 py-2 bg-yellow-500 text-black rounded-lg">Add</button>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">{tags.nearbyFacilities.map(t => <span key={t} className="bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center gap-2"><small>{t}</small><button type="button" onClick={() => removeTag('nearbyFacilities', t)} className="text-xs text-red-300">✕</button></span>)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Landmarks</label>
                  <div className="flex gap-2">
                    <input value={tagInputs.landmarks} onChange={(e) => setTagInputs(prev => ({ ...prev, landmarks: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                    <button type="button" onClick={() => addTag('landmarks')} className="px-3 py-2 bg-yellow-500 text-black rounded-lg">Add</button>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">{tags.landmarks.map(t => <span key={t} className="bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center gap-2"><small>{t}</small><button type="button" onClick={() => removeTag('landmarks', t)} className="text-xs text-red-300">✕</button></span>)}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Suitable Events (tags)</label>
                <div className="flex gap-2">
                  <input value={tagInputs.suitableEvents} onChange={(e) => setTagInputs(prev => ({ ...prev, suitableEvents: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                  <button type="button" onClick={() => addTag('suitableEvents')} className="px-3 py-2 bg-yellow-500 text-black rounded-lg">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">{tags.suitableEvents.map(t => <span key={t} className="bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center gap-2"><small>{t}</small><button type="button" onClick={() => removeTag('suitableEvents', t)} className="text-xs text-red-300">✕</button></span>)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Accessibility Features (tags)</label>
                <div className="flex gap-2">
                  <input value={tagInputs.accessibilityFeatures} onChange={(e) => setTagInputs(prev => ({ ...prev, accessibilityFeatures: e.target.value }))} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                  <button type="button" onClick={() => addTag('accessibilityFeatures')} className="px-3 py-2 bg-yellow-500 text-black rounded-lg">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">{tags.accessibilityFeatures.map(t => <span key={t} className="bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center gap-2"><small>{t}</small><button type="button" onClick={() => removeTag('accessibilityFeatures', t)} className="text-xs text-red-300">✕</button></span>)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Hourly Rate</label>
                  <input type="number" step="0.01" value={form.hourlyRate} onChange={handleChange('hourlyRate')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Daily Rate</label>
                  <input type="number" step="0.01" value={form.dailyRate} onChange={handleChange('dailyRate')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Room / Floor</label>
                  <input type="text" value={form.floor} onChange={handleChange('floor')} placeholder="e.g., Ground Floor" className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Building</label>
                  <input type="text" value={form.building} onChange={handleChange('building')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Room Number</label>
                  <input type="text" value={form.roomNumber} onChange={handleChange('roomNumber')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
                </div>
                <div />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Technical Specs (JSON or one-per-line key:value)</label>
                <textarea value={form.technicalSpecs || ''} onChange={(e) => setForm(prev => ({ ...prev, technicalSpecs: e.target.value }))} rows={4} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Booking Instructions</label>
                <textarea value={form.bookingInstructions} onChange={handleChange('bookingInstructions')} rows={2} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Special Requirements</label>
                <textarea value={form.specialRequirements} onChange={handleChange('specialRequirements')} rows={2} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/40">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600">{mode === 'edit' ? 'Save Changes' : 'Create Venue'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenueForm;
