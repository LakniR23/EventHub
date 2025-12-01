import { useState, useEffect } from 'react';

const AnnouncementForm = ({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: '',
    priority: 'Medium',
    faculty: 'General',
    expiryDate: '',
    targetAudience: 'All Students',
    contact: { name: '', email: '', phone: '' }
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        content: initialData.description || initialData.content || '',
        type: initialData.category || initialData.type || '',
        priority: initialData.priority || 'Medium',
        faculty: initialData.faculty || 'General',
        expiryDate: initialData.expiryDate ? (new Date(initialData.expiryDate)).toISOString().split('T')[0] : (initialData.expiresAt ? (new Date(initialData.expiresAt)).toISOString().split('T')[0] : ''),
        targetAudience: initialData.targetAudience || 'All Students',
        contact: {
          name: initialData.contactPerson || initialData.contact?.name || '',
          email: initialData.contactEmail || initialData.contact?.email || '',
          phone: initialData.contactPhone || initialData.contact?.phone || ''
        }
      });
    } else {
      // reset when switching to add mode
      setForm({
        title: '',
        content: '',
        type: '',
        priority: '',
        faculty: '',
        expiryDate: '',
        targetAudience: '',
        contact: { name: '', email: '', phone: '' }
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (path) => (e) => {
    const value = e.target.value;
    if (path.startsWith('contact.')) {
      const key = path.split('.')[1];
      setForm(prev => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [path]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // map to API fields expected by backend
    const payload = {
      title: form.title,
      description: form.content,
      category: form.type,
      priority: form.priority,
      faculty: form.faculty,
      targetAudience: form.targetAudience,
      expiresAt: form.expiryDate || null,
      contactPerson: form.contact.name || '',
      contactEmail: form.contact.email || '',
      contactPhone: form.contact.phone || ''
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-200 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">{mode === 'edit' ? 'Edit Announcement' : 'Add New Announcement'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 p-2">
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              value={form.content}
              onChange={handleChange('content')}
              rows="6"
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input type="text" value={form.type} onChange={handleChange('type')} placeholder="e.g. Event Update, Registration" className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select value={form.priority} onChange={handleChange('priority')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
              <select value={form.faculty} onChange={handleChange('faculty')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                <option value="General">General</option>
                <option value="Faculty of Computing">Faculty of Computing</option>
                <option value="Faculty of Engineering">Faculty of Engineering</option>
                <option value="SLIIT Business School">SLIIT Business School</option>
                <option value="Faculty of Humanities & Sciences">Faculty of Humanities & Sciences</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select value={form.targetAudience} onChange={handleChange('targetAudience')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                <option value="All Students">All Students</option>
                <option value="Students and Staff">Students and Staff</option>
                <option value="Final Year Students">Final Year Students</option>
                <option value="First Year Students">First Year Students</option>
                <option value="Staff Only">Staff Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input type="date" value={form.expiryDate} onChange={handleChange('expiryDate')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                <input type="text" value={form.contact.name} onChange={handleChange('contact.name')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={form.contact.email} onChange={handleChange('contact.email')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" value={form.contact.phone} onChange={handleChange('contact.phone')} className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/40">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600">{mode === 'edit' ? 'Save Changes' : 'Create Announcement'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
