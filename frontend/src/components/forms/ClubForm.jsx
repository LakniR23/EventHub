import { useState, useEffect } from 'react';

const ClubForm = ({ isOpen, onClose, onSubmit, initialData, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    memberCount: '',
    establishedYear: '',
    category: '',
    faculty: '',
    status: 'Active',
    mission: '',
    keyActivities: '',
    achievements: '',
    eventsCount: '',
    studentSatisfaction: '',
    awards: '',
    digitalInitiatives: '',
    joinUrl: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Category options for clubs
  const categoryOptions = [
    { value: 'Academic', label: 'Academic' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Social Service', label: 'Social Service' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Special Interest', label: 'Special Interest' },
    { value: 'Leadership', label: 'Leadership' }
  ];

  // Faculty options
  const facultyOptions = [
    { value: 'Faculty of Computing', label: 'Faculty of Computing' },
    { value: 'Faculty of Engineering', label: 'Faculty of Engineering' },
    { value: 'Faculty of Business', label: 'Faculty of Business' },
    { value: 'Faculty of Humanities & Sciences', label: 'Faculty of Humanities & Sciences' },
    { value: 'SLIIT Business School', label: 'SLIIT Business School' },
    { value: 'All Faculties', label: 'All Faculties' }
  ];

  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Under Review', label: 'Under Review' }
  ];

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        memberCount: initialData.memberCount?.toString() || '',
        establishedYear: initialData.establishedYear?.toString() || '',
        category: initialData.category || '',
        faculty: initialData.faculty || '',
        status: initialData.status || 'Active',
        mission: initialData.mission || '',
        keyActivities: initialData.keyActivities || '',
        achievements: initialData.achievements || '',
        eventsCount: initialData.eventsCount?.toString() || '',
        studentSatisfaction: initialData.studentSatisfaction?.toString() || '',
        awards: initialData.awards || '',
        digitalInitiatives: initialData.digitalInitiatives || '',
        joinUrl: initialData.joinUrl || '',
        // Try to parse structured contact information if possible
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        memberCount: '',
        establishedYear: '',
        category: '',
        faculty: '',
        status: 'Active',
        mission: '',
        keyActivities: '',
        achievements: '',
        eventsCount: '',
        studentSatisfaction: '',
        awards: '',
        digitalInitiatives: '',
        joinUrl: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
    }
  }, [mode, initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Attempt to extract name, email and phone from a legacy contactInfo string
  useEffect(() => {
    if (mode === 'edit' && initialData && initialData.contactInfo) {
      const text = initialData.contactInfo;
      // simple email regex
      const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const phoneMatch = text.match(/\+?\d[\d\s\-()]{6,}\d/);
      // Heuristic: name is first line or before first comma
      const firstLine = String(text).split('\n')[0] || '';
      const nameGuess = firstLine.split(',')[0].trim();

      setFormData(prev => ({
        ...prev,
        contactName: nameGuess || prev.contactName,
        contactEmail: emailMatch ? emailMatch[0] : prev.contactEmail,
        contactPhone: phoneMatch ? phoneMatch[0] : prev.contactPhone
      }));
    }
  }, [mode, initialData]);



  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Club name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Number validations
    if (formData.memberCount && (isNaN(formData.memberCount) || parseInt(formData.memberCount) < 0)) {
      newErrors.memberCount = 'Member count must be a valid positive number';
    }
    
    if (formData.establishedYear && (isNaN(formData.establishedYear) || parseInt(formData.establishedYear) < 1950 || parseInt(formData.establishedYear) > new Date().getFullYear())) {
      newErrors.establishedYear = 'Please enter a valid year';
    }
    
    if (formData.eventsCount && (isNaN(formData.eventsCount) || parseInt(formData.eventsCount) < 0)) {
      newErrors.eventsCount = 'Events count must be a valid positive number';
    }
    
    if (formData.studentSatisfaction && (isNaN(formData.studentSatisfaction) || parseFloat(formData.studentSatisfaction) < 0 || parseFloat(formData.studentSatisfaction) > 5)) {
      newErrors.studentSatisfaction = 'Student satisfaction must be between 0 and 5';
    }
    
    // URL validation
    if (formData.joinUrl && formData.joinUrl.trim()) {
      try {
        new URL(formData.joinUrl);
      } catch {
        newErrors.joinUrl = 'Please enter a valid URL';
      }
    }

    // Contact email validation (if provided)
    if (formData.contactEmail && formData.contactEmail.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(formData.contactEmail.trim())) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }

    // Contact phone basic validation (if provided)
    if (formData.contactPhone && formData.contactPhone.trim()) {
      const phoneRe = /\+?\d[\d\s\-()]{6,}\d/;
      if (!phoneRe.test(formData.contactPhone.trim())) {
        newErrors.contactPhone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert string numbers to integers/floats where needed
      // Combine contact fields into a single contactInfo string for backend compatibility
      const contactCombined = [
        formData.contactName ? `Name: ${formData.contactName}` : null,
        formData.contactEmail ? `Email: ${formData.contactEmail}` : null,
        formData.contactPhone ? `Phone: ${formData.contactPhone}` : null
      ].filter(Boolean).join(' | ');

      const { contactName, contactEmail, contactPhone, ...rest } = formData;

      const submitData = {
        ...rest,
        contactInfo: contactCombined || null,
        memberCount: formData.memberCount ? parseInt(formData.memberCount) : null,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        eventsCount: formData.eventsCount ? parseInt(formData.eventsCount) : null,
        studentSatisfaction: formData.studentSatisfaction ? parseFloat(formData.studentSatisfaction) : null
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is done by parent component
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-200 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">
            {mode === 'edit' ? 'Edit Club' : 'Add New Club'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-2"
            type="button"
          >
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Club Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Enter club name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Faculty</label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select Faculty</option>
                  {facultyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Enter club description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Club Details */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Club Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Member Count</label>
                <input
                  type="number"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.memberCount ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="0"
                />
                {errors.memberCount && <p className="text-red-500 text-sm mt-1">{errors.memberCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  min="1950"
                  max={new Date().getFullYear()}
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.establishedYear ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder={new Date().getFullYear().toString()}
                />
                {errors.establishedYear && <p className="text-red-500 text-sm mt-1">{errors.establishedYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Events Count</label>
                <input
                  type="number"
                  name="eventsCount"
                  value={formData.eventsCount}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.eventsCount ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="0"
                />
                {errors.eventsCount && <p className="text-red-500 text-sm mt-1">{errors.eventsCount}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">Student Satisfaction (0-5)</label>
              <input
                type="number"
                name="studentSatisfaction"
                value={formData.studentSatisfaction}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  errors.studentSatisfaction ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="4.5"
              />
              {errors.studentSatisfaction && <p className="text-red-500 text-sm mt-1">{errors.studentSatisfaction}</p>}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Mission</label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter club mission statement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Key Activities</label>
                <textarea
                  name="keyActivities"
                  value={formData.keyActivities}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Describe main activities of the club"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Achievements</label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="List major achievements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Awards</label>
                <textarea
                  name="awards"
                  value={formData.awards}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="List awards and recognitions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Digital Initiatives</label>
                <textarea
                  name="digitalInitiatives"
                  value={formData.digitalInitiatives}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Describe digital initiatives and online presence"
                />
              </div>
            </div>
          </div>

          {/* Contact Information & Image */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Contact & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Join URL</label>
                <input
                  type="url"
                  name="joinUrl"
                  value={formData.joinUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.joinUrl ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="https://example.com/join"
                />
                {errors.joinUrl && <p className="text-red-500 text-sm mt-1">{errors.joinUrl}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-200 mb-2">Contact Information</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="sr-only">Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <label className="sr-only">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.contactEmail ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="Contact email"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                </div>
                <div>
                  <label className="sr-only">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800 text-gray-200 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.contactPhone ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="Contact phone"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/40 focus:ring-2 focus:ring-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {mode === 'edit' ? 'Update Club' : 'Create Club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubForm;