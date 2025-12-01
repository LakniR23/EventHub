import { useState, useEffect, useRef } from 'react';

const CareerForm = ({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) => {
  const empty = {
    title: '',
    category: '',
    type: '',
    description: '',
    about: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    company: '',
    participants: '',
    maxParticipants: '',
    price: '',
    dressCode: '',
    availableSpots: '',
    registerUrl: '',
    contactEmail: '',
    contactPhone: '',
    contactPerson: '',
    imageFilename: ''
  };

  const [form, setForm] = useState(empty);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const tagInputRef = useRef(null);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setForm(prev => ({ ...prev,
        title: initialData.title || '',
        category: initialData.category || '',
        type: initialData.type || '',
        description: initialData.description || '',
        about: initialData.about || '',
        date: initialData.date ? new Date(initialData.date).toISOString().substring(0,10) : '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        location: initialData.location || '',
        company: initialData.company || '',
        participants: initialData.participants ?? '',
        maxParticipants: initialData.maxParticipants ?? '',
        price: initialData.price || '',
        dressCode: initialData.dressCode || '',
        availableSpots: initialData.availableSpots ?? '',
        registerUrl: initialData.registerUrl || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        contactPerson: initialData.contactPerson || '',
        imageFilename: initialData.imageFilename || ''
      }));

      // load tags if stored as JSON string
      try {
        const t = initialData.tags ? JSON.parse(initialData.tags) : null;
        if (Array.isArray(t)) setTags(t);
      } catch (e) {
        if (initialData.tags) setTags([initialData.tags]);
      }

      // handle image preview (data URL, absolute, or stored filename)
      const v = initialData.imageFilename;
      if (v) {
        const s = String(v || '');
        if (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/')) {
          setImagePreview(s);
        } else {
          try {
            const found = sessionStorage.getItem(`career-image-${s}`) || sessionStorage.getItem(s);
            if (found) setImagePreview(found);
            else if (/^[A-Za-z0-9+/=\r\n\s]+$/.test(s) && s.length > 100) setImagePreview(`data:image/*;base64,${s}`);
            else setImagePreview(`/images/careers/${s}`);
          } catch (err) {
            setImagePreview(`/images/careers/${s}`);
          }
        }
      } else {
        setImagePreview('');
      }
    } else if (!isOpen) {
      setForm(empty);
      setTags([]);
      setTagInput('');
      setImagePreview('');
      setImageFile(null);
      setErrors({});
    }
  }, [initialData, isOpen, mode]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setForm(prev => ({ ...prev, imageFilename: '' }));
    }
  };

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const addTag = (t) => {
    const tag = String(t || '').trim();
    if (!tag) return;
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
    setTagInput('');
    if (tagInputRef.current) tagInputRef.current.focus();
  };

  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));

  const parseListField = (value) => {
    if (!value) return null;
    // if it looks like JSON already leave it
    const s = value.trim();
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) return s;
    // split by newlines or commas
    const parts = s.split(/\r?\n|,/).map(p => p.trim()).filter(Boolean);
    if (parts.length <= 1) return s;
    return JSON.stringify(parts);
  };

  const validate = () => {
    const next = {};
    if (!form.title || !form.title.trim()) next.title = 'Title is required.';
    if (form.startTime && form.endTime) {
      if (form.startTime > form.endTime) next.time = 'Start time must be before end time.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      // convert numeric fields
      if (form.participants !== '') payload.participants = form.participants === '' ? null : Number(form.participants);
      if (form.maxParticipants !== '') payload.maxParticipants = form.maxParticipants === '' ? null : Number(form.maxParticipants);
      if (form.availableSpots !== '') payload.availableSpots = form.availableSpots === '' ? null : Number(form.availableSpots);

      // convert tag array to JSON string if present
      payload.tags = tags.length ? JSON.stringify(tags) : null;

      // convert the fields that backend stores as JSON-like strings
      payload.jobOpportunities = parseListField(form.jobOpportunities || '');
      payload.agenda = parseListField(form.agenda || '');
      payload.speakers = parseListField(form.speakers || '');
      payload.requirements = parseListField(form.requirements || '');

      // image handling
      if (imageFile) {
        const dataUrl = await fileToDataUrl(imageFile);
        payload.imageFilename = dataUrl;
      } else if (form.imageFilename) {
        payload.imageFilename = form.imageFilename;
      } else {
        payload.imageFilename = null;
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error('Career form submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-200 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-100">{mode === 'edit' ? 'Edit Career Event' : 'Create Career Event'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-200 p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Title *</label>
            <input type="text" required value={form.title} onChange={handleChange('title')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500" />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Company</label>
              <input type="text" value={form.company} onChange={handleChange('company')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
              <input type="text" value={form.category} onChange={handleChange('category')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" placeholder="e.g., Career, Recruitment" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Type</label>
              <select value={form.type} onChange={handleChange('type')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg">
                <option value="">Select type</option>
                <option value="JOB_FAIR">Job Fair</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="COMPANY_VISIT">Company Visit</option>
                <option value="GUEST_LECTURE">Guest Lecture</option>
                <option value="RECRUITMENT_DRIVE">Recruitment Drive</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Date</label>
              <input type="date" value={form.date} onChange={handleChange('date')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Start Time</label>
              <input type="time" value={form.startTime} onChange={handleChange('startTime')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">End Time</label>
              <input type="time" value={form.endTime} onChange={handleChange('endTime')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
          </div>
          {errors.time && <p className="text-xs text-red-400">{errors.time}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Location</label>
            <input type="text" value={form.location} onChange={handleChange('location')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Short Description</label>
            <textarea value={form.description} onChange={handleChange('description')} rows={2} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">About / Long Description</label>
            <textarea value={form.about} onChange={handleChange('about')} rows={4} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Participants</label>
              <input type="number" min={0} value={form.participants} onChange={handleChange('participants')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Max Participants</label>
              <input type="number" min={0} value={form.maxParticipants} onChange={handleChange('maxParticipants')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Available Spots</label>
              <input type="number" min={0} value={form.availableSpots} onChange={handleChange('availableSpots')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Price</label>
              <input type="text" value={form.price} onChange={handleChange('price')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" placeholder="Free or numeric" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Register URL</label>
              <input type="url" value={form.registerUrl} onChange={handleChange('registerUrl')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Dress Code</label>
              <input type="text" value={form.dressCode} onChange={handleChange('dressCode')} className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Job Opportunities (one per line or CSV)</label>
            <textarea name="jobOpportunities" defaultValue={''} onChange={(e) => setForm(prev => ({ ...prev, jobOpportunities: e.target.value }))} rows={2} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
          </div>
 

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Agenda (one item per line)</label>
            <textarea name="agenda" defaultValue={''} onChange={(e) => setForm(prev => ({ ...prev, agenda: e.target.value }))} rows={3} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Speakers (one per line)</label>
            <textarea name="speakers" defaultValue={''} onChange={(e) => setForm(prev => ({ ...prev, speakers: e.target.value }))} rows={2} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Requirements (one per line)</label>
            <textarea name="requirements" defaultValue={''} onChange={(e) => setForm(prev => ({ ...prev, requirements: e.target.value }))} rows={2} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Tags</label>
            <div className="flex gap-2 flex-wrap">
              {tags.map(t => (
                <span key={t} className="bg-gray-700 text-gray-200 px-2 py-1 rounded flex items-center gap-2">
                  <small>{t}</small>
                  <button type="button" onClick={() => removeTag(t)} className="text-xs text-red-300">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input ref={tagInputRef} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }} placeholder="Add tag and press Enter" className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg" />
              <button type="button" onClick={() => addTag(tagInput)} className="px-3 py-2 bg-yellow-500 text-black rounded-lg">Add</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700" />
            {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-48 h-28 object-cover rounded" />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <input id="featured" type="checkbox" checked={!!form.featured} onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))} className="accent-yellow-500" />
              <label htmlFor="featured" className="text-sm text-gray-200">Featured</label>
            </div>
            <div />
            <div />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-600 rounded-lg text-gray-200">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-yellow-500 text-black rounded-lg">{loading ? 'Saving...' : (mode === 'edit' ? 'Save' : 'Create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
