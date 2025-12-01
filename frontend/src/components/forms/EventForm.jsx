import { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

const EventForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  mode = 'add' // 'add' or 'edit'
}) => {
  // Backend origin used to resolve relative image paths stored by the server
  const API_ORIGIN = 'http://localhost:5000';

  const resolveImageUrl = (url) => {
    if (!url) return '';
    // already a data URL
    if (typeof url === 'string' && url.startsWith('data:')) return url;
    // absolute http(s) URL
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) return url;
    // relative path served from backend (may start with /uploads or uploads)
    if (typeof url === 'string' && url.startsWith('/')) return `${API_ORIGIN}${url}`;
    // fallback: prefix with origin
    if (typeof url === 'string') return `${API_ORIGIN}/${url}`;
    return '';
  };
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    faculty: 'COMPUTING',
    category: 'WORKSHOPS_CREATIVE',
    organizer: '',
    maxParticipants: '',
    price: 'Free',
    featured: false,
    hasRegistration: true,
    tags: [],
    requirements: [],
    agenda: [],
    speakers: [],
    contact: {
      email: '',
      phone: '',
      coordinator: ''
    },
    // Career-specific fields
    company: '',
    industry: '',
    jobOpportunities: '',
    internshipOpportunities: '',
    skillsRequired: '',
    dresscode: '',
    image: '',
    prizes: []
  });

  // Dynamic form sections
  const [agendaItems, setAgendaItems] = useState([]);
  const [speakerItems, setSpeakerItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image handling state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [speakerImageFiles, setSpeakerImageFiles] = useState({});
  const [speakerImagePreviews, setSpeakerImagePreviews] = useState({});
  
  // Track the current event ID to prevent cross-event image contamination
  const [currentEventId, setCurrentEventId] = useState(null);

  // Form options
  const categories = [
    { value: 'CONCERTS', label: 'Concerts' },
    { value: 'MUSICAL', label: 'Musical' },
    { value: 'THEATRE_DRAMA', label: 'Theatre/Drama' },
    { value: 'DANCE_PERFORMANCES', label: 'Dance Performances' },
    { value: 'ART_EXHIBITIONS', label: 'Art Exhibitions' },
    { value: 'FILM_SCREENINGS', label: 'Film Screenings' },
    { value: 'COMEDY_SHOWS', label: 'Comedy Shows' },
    { value: 'FESTIVALS', label: 'Festivals' },
    { value: 'CHARITY_DEDICATION', label: 'Charity/Dedication Campaigns' },
    { value: 'DONATION_DRIVES', label: 'Donation Drives' },
    { value: 'COMMUNITY_GATHERINGS', label: 'Community Gatherings' },
    { value: 'CULTURAL_FAIRS', label: 'Cultural Fairs' },
    { value: 'OPEN_MIC_NIGHTS', label: 'Open Mic Nights' },
    { value: 'TALENT_SHOWS', label: 'Talent Shows' },
    { value: 'BOOK_READINGS', label: 'Book Readings/Signings' },
    { value: 'FOOD_FESTIVALS', label: 'Food Festivals' },
    { value: 'FASHION_SHOWS', label: 'Fashion Shows' },
    { value: 'FUNDRAISING_EVENTS', label: 'Fundraising Events' },
    { value: 'WORKSHOPS_CREATIVE', label: 'Workshops (Creative, Art, Music)' },
    { value: 'SPORTS_EVENTS', label: 'Sports Events (Friendly Matches, Tournaments)' }
  ];

  const faculties = [
    { value: 'COMPUTING', label: 'Faculty of Computing' },
    { value: 'ENGINEERING', label: 'Faculty of Engineering' },
    { value: 'BUSINESS', label: 'Faculty of Business' },
    { value: 'HUMANITIES', label: 'Faculty of Humanities' },
    { value: 'SCIENCE', label: 'Faculty of Science' },
    { value: 'SLIIT_BUSINESS_SCHOOL', label: 'SLIIT Business School' },
    { value: 'ALL_FACULTIES', label: 'All Faculties' }
  ];

  const priceOptions = [
    { value: 'Free', label: 'Free' },
    { value: 'Paid', label: 'Paid' }
  ];

  // Career-related categories
  const careerCategories = [
    'CAREER', 'JOB_FAIR', 'CAREER_WORKSHOP', 'INTERVIEW_PREPARATION',
    'NETWORKING_EVENT', 'PROFESSIONAL_DEVELOPMENT', 'INTERNSHIP_PROGRAM'
  ];

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      const newEventId = initialData?.id || null;
      
      // If we're switching to a different event, completely reset everything
      if (currentEventId !== newEventId) {
        console.log('Switching events from', currentEventId, 'to', newEventId);
        setCurrentEventId(newEventId);
        
        // Completely clear all image states when switching events
        setImageFile(null);
        setImagePreview('');
        setSpeakerImageFiles({});
        setSpeakerImagePreviews({});
        
        // Clear any file inputs
        setTimeout(() => {
          const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
          imageInputs.forEach(input => {
            input.value = '';
          });
        }, 100);
      }
      
      if (initialData && mode === 'edit') {
        // Prefer explicit startTime/endTime fields when available (set by parent),
        // otherwise parse the combined `time` string (e.g. '09:00 - 11:00').
        const parsedStart = initialData.startTime || (initialData.time && typeof initialData.time === 'string' && initialData.time.includes(' - ') ? initialData.time.split(' - ')[0] : (initialData.time || ''));
        const parsedEnd = initialData.endTime || (initialData.time && typeof initialData.time === 'string' && initialData.time.includes(' - ') ? initialData.time.split(' - ')[1] : '');

        setFormData({
          ...initialData,
          startTime: parsedStart,
          endTime: parsedEnd,
          tags: Array.isArray(initialData.tags) ? initialData.tags : [],
          requirements: Array.isArray(initialData.requirements) ? initialData.requirements : [],
          prizes: Array.isArray(initialData.prizes) ? initialData.prizes : [],
          contact: initialData.contact || { email: '', phone: '', coordinator: '' },
          // Ensure image is properly handled - set to empty string if null/undefined
          image: initialData.image || ''
        });
        
        // Set dynamic sections
        setAgendaItems(Array.isArray(initialData.agenda) ? initialData.agenda : []);
        setSpeakerItems(Array.isArray(initialData.speakers) ? initialData.speakers : []);
        
        // Use centralized resolver to build an absolute URL for the preview
        setTimeout(() => {
          if (initialData.image && typeof initialData.image === 'string' && initialData.image.trim() !== '') {
            console.log('Setting image preview for event', newEventId);
            setImagePreview(getImageUrl(initialData.image));
          }
        }, 150);
        
        // Set speaker image previews for this specific event
        if (Array.isArray(initialData.speakers)) {
          const speakerPreviews = {};
          initialData.speakers.forEach((speaker, index) => {
            if (speaker.image && typeof speaker.image === 'string' && speaker.image.trim() !== '') {
              speakerPreviews[index] = getImageUrl(speaker.image);
            }
          });
          setTimeout(() => {
            setSpeakerImagePreviews(speakerPreviews);
          }, 150);
        }
      } else {
        resetForm();
        setCurrentEventId(null);
      }
    } else {
      // Clear everything when modal closes
      setCurrentEventId(null);
    }
  }, [initialData, mode, isOpen]);

  // Separate effect to handle event ID changes and prevent image contamination
  useEffect(() => {
    if (isOpen && initialData && mode === 'edit') {
      const newEventId = initialData.id;
      if (currentEventId !== null && currentEventId !== newEventId) {
        console.log('Event changed: clearing image states', currentEventId, '->', newEventId);
        // Clear image states when switching events
        setImageFile(null);
        setImagePreview('');
        setSpeakerImageFiles({});
        setSpeakerImagePreviews({});
      }
    }
  }, [initialData?.id, isOpen, mode, currentEventId]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      date: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      faculty: 'COMPUTING',
      category: 'WORKSHOP',
      organizer: '',
      maxParticipants: '',
      price: 'Free',
      featured: false,
      hasRegistration: true,
      tags: [],
      requirements: [],
      agenda: [],
      speakers: [],
      contact: {
        email: '',
        phone: '',
        coordinator: ''
      },
      company: '',
      industry: '',
      jobOpportunities: '',
      internshipOpportunities: '',
      skillsRequired: '',
      dresscode: '',
      image: '',
      prizes: []
    });
    setAgendaItems([]);
    setSpeakerItems([]);
    
    // Completely clear all image-related states
    setImageFile(null);
    setImagePreview('');
    setSpeakerImageFiles({});
    setSpeakerImagePreviews({});
    
    // Clear any file inputs
    setTimeout(() => {
      const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
      imageInputs.forEach(input => {
        input.value = '';
      });
    }, 100);
    
    // Clear any file inputs
    const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
    imageInputs.forEach(input => {
      input.value = '';
    });
  };

  // Helper functions for dynamic sections
  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { time: '', activity: '' }]);
  };

  const removeAgendaItem = (index) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index, field, value) => {
    const updated = agendaItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setAgendaItems(updated);
  };

  const addSpeakerItem = () => {
    setSpeakerItems([...speakerItems, { name: '', title: '', bio: '', image: '' }]);
  };

  const removeSpeakerItem = (index) => {
    setSpeakerItems(speakerItems.filter((_, i) => i !== index));
  };

  const updateSpeakerItem = (index, field, value) => {
    const updated = speakerItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setSpeakerItems(updated);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format data for submission
      const submitData = {
        ...formData,
        time: formData.endTime ? `${formData.startTime} - ${formData.endTime}` : formData.startTime,
        date: new Date(formData.date).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        tags: Array.isArray(formData.tags) ? formData.tags : 
              typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        requirements: Array.isArray(formData.requirements) ? formData.requirements : 
                     typeof formData.requirements === 'string' ? formData.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
        prizes: Array.isArray(formData.prizes) ? formData.prizes : 
               typeof formData.prizes === 'string' ? formData.prizes.split(',').map(p => p.trim()).filter(p => p) : [],
        agenda: agendaItems.length > 0 ? agendaItems : undefined,
        speakers: speakerItems.length > 0 ? speakerItems : undefined,
        contact: formData.contact && Object.keys(formData.contact).some(key => formData.contact[key]) ? formData.contact : undefined,
        // Properly handle image - send null if empty, or the base64 string
        image: formData.image && formData.image.trim() !== '' ? formData.image : null
      };

      console.log(`${mode === 'add' ? 'Creating' : 'Updating'} event with data:`, submitData);
      
      await onSubmit(submitData);
      resetForm();
      onClose();
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} event:`, error);
      alert(`Error ${mode === 'add' ? 'creating' : 'updating'} event. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to compress images
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Image handling functions
  const handleEventImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit for original, will be compressed)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, JPEG)');
        e.target.value = ''; // Clear the input
        return;
      }

      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        
        // Create preview from compressed image
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          console.log('Image uploaded successfully, size:', result.length, 'chars');
          setImagePreview(result);
          handleInputChange('image', result);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          alert('Error reading image file. Please try again.');
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error processing image. Please try again with a different image.');
        e.target.value = ''; // Clear the input
      }
    }
  };

  const removeEventImage = () => {
    setImageFile(null);
    setImagePreview('');
    handleInputChange('image', '');
    // Also clear the file input
    const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
    if (imageInput) {
      imageInput.value = '';
    }
  };

  const handleSpeakerImageUpload = async (speakerIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit for original, will be compressed)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        setSpeakerImageFiles(prev => ({
          ...prev,
          [speakerIndex]: compressedFile
        }));
        
        // Create preview from compressed image
        const reader = new FileReader();
        reader.onload = (e) => {
          setSpeakerImagePreviews(prev => ({
            ...prev,
            [speakerIndex]: e.target.result
          }));
          updateSpeakerItem(speakerIndex, 'image', e.target.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing speaker image:', error);
        alert('Error processing image. Please try again.');
      }
    }
  };

  const removeSpeakerImage = (speakerIndex) => {
    setSpeakerImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[speakerIndex];
      return newFiles;
    });
    
    setSpeakerImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[speakerIndex];
      return newPreviews;
    });
    
    updateSpeakerItem(speakerIndex, 'image', '');
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-gray-900/30 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 text-gray-200 rounded-2xl p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              {mode === 'add' ? 'Add New Event' : 'Edit Event'}
            </h2>
            <p className="text-sm text-yellow-300 mt-1">
              
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Faculty *</label>
                <select
                  value={formData.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {faculties.map(faculty => (
                    <option key={faculty.value} value={faculty.value}>{faculty.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Organizer *</label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">Short Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Brief description for event cards and listings"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">Full Description</label>
              <textarea
                rows={5}
                value={formData.fullDescription || ''}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Detailed description for event details page"
              />
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Date, Time & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Start Time *</label>
                <input
                  type="time"
                  required
                  value={formData.startTime || ''}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Registration & Pricing */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Registration & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Price</label>
                <select
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  {priceOptions.map(price => (
                    <option key={price.value} value={price.value}>{price.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-6 pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasRegistration}
                    onChange={(e) => handleInputChange('hasRegistration', e.target.checked)}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-200">Has Registration</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-200">Featured Event</span>
                </label>
              </div>
            </div>
          </div>

          {/* Career-Specific Fields */}
          {careerCategories.includes(formData.category) && (
            <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Career Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Job Opportunities</label>
                  <textarea
                    rows={3}
                    value={formData.jobOpportunities}
                    onChange={(e) => handleInputChange('jobOpportunities', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Internship Opportunities</label>
                  <textarea
                    rows={3}
                    value={formData.internshipOpportunities}
                    onChange={(e) => handleInputChange('internshipOpportunities', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Skills Required</label>
                  <textarea
                    rows={3}
                    value={formData.skillsRequired}
                    onChange={(e) => handleInputChange('skillsRequired', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Dress Code</label>
                  <input
                    type="text"
                    value={formData.dresscode}
                    onChange={(e) => handleInputChange('dresscode', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Business Formal, Smart Casual"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
            <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Comma-separated tags (e.g., coding, competition, prizes)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Requirements</label>
                <input
                  type="text"
                  value={Array.isArray(formData.requirements) ? formData.requirements.join(', ') : formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value.split(',').map(r => r.trim()).filter(r => r))}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Comma-separated requirements (e.g., laptop, student ID)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Prizes</label>
                <input
                  type="text"
                  value={Array.isArray(formData.prizes) ? formData.prizes.join(', ') : formData.prizes}
                  onChange={(e) => handleInputChange('prizes', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Comma-separated prizes (e.g., Cash Prize, Certificate, Trophy)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Event Image</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800/20 hover:bg-gray-800/30">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 10MB (auto-compressed)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleEventImageUpload}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeEventImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Agenda Section */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Event Agenda</h3>
              <button
                type="button"
                onClick={addAgendaItem}
                className="text-yellow-300 hover:text-yellow-400 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Agenda Item
              </button>
            </div>
            
              {agendaItems.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No agenda items added yet. Click "Add Agenda Item" to get started.</p>
            ) : (
              <div className="space-y-4">
                {agendaItems.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Agenda Item {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Activity</label>
                        <input
                          type="text"
                          value={item.activity}
                          onChange={(e) => updateAgendaItem(index, 'activity', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="e.g., Opening Ceremony, Keynote Speech, Networking Session"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Speakers Section */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Event Speakers</h3>
              <button
                type="button"
                onClick={addSpeakerItem}
                className="text-yellow-300 hover:text-yellow-400 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Speaker
              </button>
            </div>
            
                {speakerItems.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No speakers added yet. Click "Add Speaker" to get started.</p>
            ) : (
              <div className="space-y-4">
                {speakerItems.map((speaker, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Speaker {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeSpeakerItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => updateSpeakerItem(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Speaker's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title/Position</label>
                        <input
                          type="text"
                          value={speaker.title}
                          onChange={(e) => updateSpeakerItem(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="e.g., CEO, Software Engineer, Professor"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                        <textarea
                          rows={2}
                          value={speaker.bio}
                          onChange={(e) => updateSpeakerItem(index, 'bio', e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          placeholder="Brief biography or background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Profile Image</label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800/20 hover:bg-gray-800/30">
                              <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                <svg className="w-6 h-6 mb-1 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-xs text-gray-400">Upload photo</p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleSpeakerImageUpload(index, e)}
                              />
                            </label>
                          </div>
                          {speakerImagePreviews[index] && (
                            <div className="relative">
                              <img
                                src={speakerImagePreviews[index]}
                                alt="Speaker preview"
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeSpeakerImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg className="w-3 h-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Coordinator</label>
                <input
                  type="text"
                  value={formData.contact.coordinator}
                  onChange={(e) => handleInputChange('contact.coordinator', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
              {mode === 'add' ? 'Create Event' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;