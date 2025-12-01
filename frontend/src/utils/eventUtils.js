import { VALIDATION_RULES, FACULTY_LABELS, CATEGORY_LABELS } from '../constants/eventConstants';

// Format date for display
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

// Format time for display
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // Handle time ranges like "10:00 - 18:00"
  if (timeString.includes(' - ')) {
    const [start, end] = timeString.split(' - ');
    return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
  }
  
  return formatSingleTime(timeString);
};

// Format single time
export const formatSingleTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    // Handle different time formats
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const min = parseInt(minutes) || 0;
      
      if (hour === 0) return `12:${min.toString().padStart(2, '0')} AM`;
      if (hour < 12) return `${hour}:${min.toString().padStart(2, '0')} AM`;
      if (hour === 12) return `12:${min.toString().padStart(2, '0')} PM`;
      return `${hour - 12}:${min.toString().padStart(2, '0')} PM`;
    }
    
    return timeString;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Calculate event duration in hours
export const calculateDuration = (startDate, endDate, startTime, endTime) => {
  try {
    if (!startDate || !endDate || !startTime || !endTime) return null;
    
    const start = new Date(`${startDate} ${startTime}`);
    const end = new Date(`${endDate} ${endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    return Math.round(diffInHours * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating duration:', error);
    return null;
  }
};

// Check if event is upcoming
export const isUpcoming = (eventDate) => {
  if (!eventDate) return false;
  const today = new Date();
  const event = new Date(eventDate);
  return event > today;
};

// Check if event is past
export const isPast = (eventDate) => {
  if (!eventDate) return false;
  const today = new Date();
  const event = new Date(eventDate);
  return event < today;
};

// Check if event is today
export const isToday = (eventDate) => {
  if (!eventDate) return false;
  const today = new Date();
  const event = new Date(eventDate);
  return (
    event.getDate() === today.getDate() &&
    event.getMonth() === today.getMonth() &&
    event.getFullYear() === today.getFullYear()
  );
};

// Get event status based on date
export const getEventStatusByDate = (eventDate, currentStatus) => {
  if (currentStatus === 'Cancelled' || currentStatus === 'Draft') {
    return currentStatus;
  }
  
  if (isPast(eventDate)) return 'Completed';
  if (isToday(eventDate)) return 'Ongoing';
  return 'Upcoming';
};

// Validate event data
export const validateEventData = (eventData) => {
  const errors = {};
  
  // Title validation
  if (!eventData.title || eventData.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (eventData.title.length < VALIDATION_RULES.title.minLength) {
    errors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
  } else if (eventData.title.length > VALIDATION_RULES.title.maxLength) {
    errors.title = `Title must not exceed ${VALIDATION_RULES.title.maxLength} characters`;
  }
  
  // Description validation
  if (!eventData.description || eventData.description.trim() === '') {
    errors.description = 'Description is required';
  } else if (eventData.description.length < VALIDATION_RULES.description.minLength) {
    errors.description = `Description must be at least ${VALIDATION_RULES.description.minLength} characters`;
  } else if (eventData.description.length > VALIDATION_RULES.description.maxLength) {
    errors.description = `Description must not exceed ${VALIDATION_RULES.description.maxLength} characters`;
  }
  
  // Date validation
  if (!eventData.date || eventData.date.trim() === '') {
    errors.date = 'Date is required';
  } else {
    const eventDate = new Date(eventData.date);
    if (isNaN(eventDate.getTime())) {
      errors.date = 'Invalid date format';
    }
  }
  
  // End date validation (if provided)
  if (eventData.endDate && eventData.endDate.trim() !== '') {
    const startDate = new Date(eventData.date);
    const endDate = new Date(eventData.endDate);
    
    if (isNaN(endDate.getTime())) {
      errors.endDate = 'Invalid end date format';
    } else if (endDate < startDate) {
      errors.endDate = 'End date must be after start date';
    }
  }
  
  // Time validation
  if (!eventData.time || eventData.time.trim() === '') {
    errors.time = 'Time is required';
  }
  
  // Location validation
  if (!eventData.location || eventData.location.trim() === '') {
    errors.location = 'Location is required';
  } else if (eventData.location.length < VALIDATION_RULES.location.minLength) {
    errors.location = `Location must be at least ${VALIDATION_RULES.location.minLength} characters`;
  } else if (eventData.location.length > VALIDATION_RULES.location.maxLength) {
    errors.location = `Location must not exceed ${VALIDATION_RULES.location.maxLength} characters`;
  }
  
  // Organizer validation
  if (!eventData.organizer || eventData.organizer.trim() === '') {
    errors.organizer = 'Organizer is required';
  } else if (eventData.organizer.length < VALIDATION_RULES.organizer.minLength) {
    errors.organizer = `Organizer must be at least ${VALIDATION_RULES.organizer.minLength} characters`;
  } else if (eventData.organizer.length > VALIDATION_RULES.organizer.maxLength) {
    errors.organizer = `Organizer must not exceed ${VALIDATION_RULES.organizer.maxLength} characters`;
  }
  
  // Max participants validation
  if (eventData.maxParticipants && eventData.maxParticipants !== '') {
    const maxPart = parseInt(eventData.maxParticipants);
    if (isNaN(maxPart) || maxPart < 1) {
      errors.maxParticipants = 'Max participants must be a positive number';
    } else if (maxPart > 10000) {
      errors.maxParticipants = 'Max participants cannot exceed 10,000';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate slug from title
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Extract keywords from event data for search
export const extractKeywords = (eventData) => {
  const keywords = new Set();
  
  // Add title words
  if (eventData.title) {
    eventData.title.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
  }
  
  // Add description words
  if (eventData.description) {
    eventData.description.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
  }
  
  // Add category and faculty
  if (eventData.category) keywords.add(eventData.category.toLowerCase());
  if (eventData.faculty) keywords.add(eventData.faculty.toLowerCase());
  if (eventData.organizer) keywords.add(eventData.organizer.toLowerCase());
  
  // Add tags
  if (eventData.tags && Array.isArray(eventData.tags)) {
    eventData.tags.forEach(tag => keywords.add(tag.toLowerCase()));
  }
  
  return Array.from(keywords);
};

// Format event for display
export const formatEventForDisplay = (event) => {
  if (!event) return null;
  
  return {
    ...event,
    formattedDate: formatDate(event.date),
    formattedEndDate: event.endDate ? formatDate(event.endDate) : null,
    formattedTime: formatTime(event.time),
    facultyLabel: FACULTY_LABELS[event.faculty] || event.faculty,
    categoryLabel: CATEGORY_LABELS[event.category] || event.category,
    statusByDate: getEventStatusByDate(event.date, event.status),
    isUpcoming: isUpcoming(event.date),
    isPast: isPast(event.date),
    isToday: isToday(event.date),
    slug: generateSlug(event.title),
    keywords: extractKeywords(event)
  };
};

// Sort events by different criteria
export const sortEvents = (events, sortBy = 'date', order = 'asc') => {
  if (!Array.isArray(events)) return [];
  
  const sortedEvents = [...events].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'faculty':
        aValue = a.faculty;
        bValue = b.faculty;
        break;
      case 'participants':
        aValue = a.registeredCount || 0;
        bValue = b.registeredCount || 0;
        break;
      case 'featured':
        aValue = a.featured ? 1 : 0;
        bValue = b.featured ? 1 : 0;
        break;
      default:
        aValue = a.createdAt || a.date;
        bValue = b.createdAt || b.date;
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sortedEvents;
};

// Filter events by multiple criteria
export const filterEvents = (events, filters = {}) => {
  if (!Array.isArray(events)) return [];
  
  return events.filter(event => {
    // Category filter
    if (filters.category && filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }
    
    // Faculty filter
    if (filters.faculty && filters.faculty !== 'all' && event.faculty !== filters.faculty) {
      return false;
    }
    
    // Status filter
    if (filters.status && event.status !== filters.status) {
      return false;
    }
    
    // Featured filter
    if (filters.featured !== undefined && event.featured !== filters.featured) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate) {
      const eventDate = new Date(event.date);
      const filterStart = new Date(filters.startDate);
      if (eventDate < filterStart) return false;
    }
    
    if (filters.endDate) {
      const eventDate = new Date(event.date);
      const filterEnd = new Date(filters.endDate);
      if (eventDate > filterEnd) return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        event.title,
        event.description,
        event.organizer,
        event.location,
        event.category,
        event.faculty,
        ...(event.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) return false;
    }
    
    return true;
  });
};

export default {
  formatDate,
  formatTime,
  formatSingleTime,
  calculateDuration,
  isUpcoming,
  isPast,
  isToday,
  getEventStatusByDate,
  validateEventData,
  generateSlug,
  extractKeywords,
  formatEventForDisplay,
  sortEvents,
  filterEvents
};