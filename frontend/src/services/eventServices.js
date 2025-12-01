// Event Services - Dedicated service for event operations
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function with better error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Transform frontend event data to backend format
const transformEventForBackend = (eventData) => {
  const transformed = {};
  
  // Only add defined fields to avoid sending unnecessary data
  if (eventData.title !== undefined) transformed.title = eventData.title;
  if (eventData.description !== undefined) transformed.description = eventData.description;
  if (eventData.fullDescription !== undefined) transformed.fullDescription = eventData.fullDescription;
  if (eventData.date !== undefined) transformed.date = new Date(eventData.date).toISOString();
  if (eventData.endDate !== undefined) transformed.endDate = eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined;
  if (eventData.time !== undefined) transformed.time = eventData.time;
  if (eventData.location !== undefined) transformed.location = eventData.location;
  if (eventData.faculty !== undefined) transformed.faculty = eventData.faculty;
  if (eventData.category !== undefined) transformed.category = eventData.category;
  if (eventData.organizer !== undefined) transformed.organizer = eventData.organizer;
  if (eventData.maxParticipants !== undefined) transformed.maxParticipants = eventData.maxParticipants ? parseInt(eventData.maxParticipants) : undefined;
  if (eventData.registeredCount !== undefined) transformed.registeredCount = eventData.registeredCount;
  if (eventData.price !== undefined) transformed.price = eventData.price;
  if (eventData.featured !== undefined) transformed.featured = eventData.featured;
  if (eventData.hasRegistration !== undefined) transformed.hasRegistration = eventData.hasRegistration;
  if (eventData.status !== undefined) transformed.status = eventData.status;
  if (eventData.tags !== undefined) transformed.tags = eventData.tags;
  if (eventData.requirements !== undefined) transformed.requirements = eventData.requirements;
  if (eventData.agenda !== undefined) transformed.agenda = eventData.agenda || undefined;
  if (eventData.speakers !== undefined) transformed.speakers = eventData.speakers || undefined;
  if (eventData.contact !== undefined) transformed.contact = eventData.contact || undefined;
  if (eventData.company !== undefined) transformed.company = eventData.company || undefined;
  if (eventData.industry !== undefined) transformed.industry = eventData.industry || undefined;
  if (eventData.jobOpportunities !== undefined) transformed.jobOpportunities = eventData.jobOpportunities || undefined;
  if (eventData.internshipOpportunities !== undefined) transformed.internshipOpportunities = eventData.internshipOpportunities || undefined;
  if (eventData.skillsRequired !== undefined) transformed.skillsRequired = eventData.skillsRequired || undefined;
  if (eventData.dresscode !== undefined) transformed.dresscode = eventData.dresscode || undefined;
  if (eventData.prizes !== undefined) transformed.prizes = eventData.prizes;
  
  // Handle image properly - send null if empty string, undefined, or null
  if (eventData.image !== undefined) {
    transformed.image = (eventData.image && eventData.image.trim() !== '') ? eventData.image : null;
  }
  
  return transformed;
};

// Transform backend event data to frontend format
const transformEventFromBackend = (eventData) => {
  if (!eventData) return null;
  
  try {
    return {
      ...eventData,
      date: eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : '',
      endDate: eventData.endDate ? new Date(eventData.endDate).toISOString().split('T')[0] : '',
      // Extract start and end times from time field if needed
      startTime: eventData.time && eventData.time.includes(' - ') ? eventData.time.split(' - ')[0] : eventData.time || '',
      endTime: eventData.time && eventData.time.includes(' - ') ? eventData.time.split(' - ')[1] : '',
      // Ensure arrays are always arrays
      tags: Array.isArray(eventData.tags) ? eventData.tags : [],
      requirements: Array.isArray(eventData.requirements) ? eventData.requirements : [],
      prizes: Array.isArray(eventData.prizes) ? eventData.prizes : [],
      // Handle JSON fields safely
      agenda: eventData.agenda && typeof eventData.agenda === 'string' ? 
        (eventData.agenda.trim() ? JSON.parse(eventData.agenda) : null) : eventData.agenda,
      speakers: eventData.speakers && typeof eventData.speakers === 'string' ? 
        (eventData.speakers.trim() ? JSON.parse(eventData.speakers) : null) : eventData.speakers,
      contact: eventData.contact && typeof eventData.contact === 'string' ? 
        (eventData.contact.trim() ? JSON.parse(eventData.contact) : null) : eventData.contact,
    };
  } catch (error) {
    console.error('Error transforming event from backend:', error);
    return eventData; // Return original data if transformation fails
  }
};

export const eventServices = {
  // Get all events
  getAll: async (filters = {}) => {
    try {
      let endpoint = '/events';
      const queryParams = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.faculty && filters.faculty !== 'all') {
        queryParams.append('faculty', filters.faculty);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.featured) {
        queryParams.append('featured', 'true');
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      
      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
      
      const response = await apiCall(endpoint);
      const events = Array.isArray(response) ? response : (response.data || []);
      return events.map(transformEventFromBackend);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get single event by ID
  getById: async (id) => {
    try {
      const response = await apiCall(`/events/${id}`);
      const event = response.data || response;
      return transformEventFromBackend(event);
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  // Create new event
  create: async (eventData) => {
    try {
      const transformedData = transformEventForBackend(eventData);
      console.log('Creating event with transformed data:', {
        ...transformedData,
        image: transformedData.image ? `[Base64 image ${transformedData.image.length} chars]` : 'No image'
      });
      
      const response = await apiCall('/events', {
        method: 'POST',
        body: JSON.stringify(transformedData),
      });
      const event = response.data || response;
      console.log('Event created successfully:', event.id);
      return transformEventFromBackend(event);
    } catch (error) {
      console.error('Error creating event:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Image must be a valid base64')) {
        throw new Error('Invalid image format. Please upload a valid PNG, JPG, or JPEG image.');
      } else if (error.message.includes('too large')) {
        throw new Error('Image is too large. Please compress your image or choose a smaller file.');
      } else if (error.message.includes('Validation failed')) {
        throw new Error('Please check all required fields and try again.');
      }
      
      throw error;
    }
  },

  // Update existing event
  update: async (id, eventData) => {
    try {
      const transformedData = transformEventForBackend(eventData);
      console.log('Updating event with transformed data:', {
        ...transformedData,
        image: transformedData.image ? `[Base64 image ${transformedData.image.length} chars]` : 'No image'
      });
      
      const response = await apiCall(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transformedData),
      });
      const event = response.data || response;
      console.log('Event updated successfully:', event.id);
      return transformEventFromBackend(event);
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      
      // Provide more specific error messages
      if (error.message.includes('Image must be a valid base64')) {
        throw new Error('Invalid image format. Please upload a valid PNG, JPG, or JPEG image.');
      } else if (error.message.includes('too large')) {
        throw new Error('Image is too large. Please compress your image or choose a smaller file.');
      } else if (error.message.includes('Event not found')) {
        throw new Error('Event not found. It may have been deleted.');
      }
      
      throw error;
    }
  },

  // Delete event
  delete: async (id) => {
    try {
      const response = await apiCall(`/events/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw error;
    }
  },

  // Get events by category
  getByCategory: async (category) => {
    return eventServices.getAll({ category });
  },

  // Get events by faculty
  getByFaculty: async (faculty) => {
    return eventServices.getAll({ faculty });
  },

  // Search events
  search: async (query) => {
    return eventServices.getAll({ search: query });
  },

  // Get featured events
  getFeatured: async () => {
    return eventServices.getAll({ featured: true });
  },

  // Get events statistics
  getStats: async () => {
    try {
      const events = await eventServices.getAll();
      const stats = {
        total: events.length,
        active: events.filter(e => e.status === 'Active').length,
        completed: events.filter(e => e.status === 'Completed').length,
        cancelled: events.filter(e => e.status === 'Cancelled').length,
        draft: events.filter(e => e.status === 'Draft').length,
        featured: events.filter(e => e.featured).length,
        byCategory: {},
        byFaculty: {},
        upcoming: events.filter(e => new Date(e.date) > new Date()).length,
        past: events.filter(e => new Date(e.date) < new Date()).length,
      };

      // Count by category
      events.forEach(event => {
        stats.byCategory[event.category] = (stats.byCategory[event.category] || 0) + 1;
      });

      // Count by faculty
      events.forEach(event => {
        stats.byFaculty[event.faculty] = (stats.byFaculty[event.faculty] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching event stats:', error);
      throw error;
    }
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await apiCall('/health');
    return response;
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};

export default eventServices;