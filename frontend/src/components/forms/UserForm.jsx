import { useState, useEffect } from 'react';

const UserForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  mode = 'add' // 'add' or 'edit'
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '' // Don't populate password for editing
      });
    } else {
      resetForm();
    }
  }, [initialData, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For edit mode, only send password if it's provided
      const submitData = { ...formData };
      if (mode === 'edit' && !submitData.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
      resetForm();
      onClose();
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} user:`, error);
      alert(`Error ${mode === 'add' ? 'creating' : 'updating'} user. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-200 rounded-2xl p-8 max-w-md w-full shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              {mode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>
            <p className="text-sm text-yellow-300 mt-1">
              {mode === 'add' ? 'Create a new user account' : 'Update user information'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-2"
          >
            <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter user's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password {mode === 'add' ? '*' : ''}
              </label>
              <input
                type="password"
                required={mode === 'add'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder={mode === 'add' ? 'Enter password' : 'Leave blank to keep current password'}
              />
              {mode === 'edit' && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep the current password
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/40 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"></path>
                </svg>
              )}
              {mode === 'add' ? 'Create User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;