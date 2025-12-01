// Event-related constants and enums

export const FACULTIES = {
  COMPUTING: 'COMPUTING',
  ENGINEERING: 'ENGINEERING',
  BUSINESS: 'BUSINESS',
  HUMANITIES: 'HUMANITIES',
  SCIENCE: 'SCIENCE',
  SLIIT_BUSINESS_SCHOOL: 'SLIIT_BUSINESS_SCHOOL',
  ALL_FACULTIES: 'ALL_FACULTIES'
};

export const FACULTY_LABELS = {
  [FACULTIES.COMPUTING]: 'Faculty of Computing',
  [FACULTIES.ENGINEERING]: 'Faculty of Engineering',
  [FACULTIES.BUSINESS]: 'Faculty of Business',
  [FACULTIES.HUMANITIES]: 'Faculty of Humanities',
  [FACULTIES.SCIENCE]: 'Faculty of Science',
  [FACULTIES.SLIIT_BUSINESS_SCHOOL]: 'SLIIT Business School',
  [FACULTIES.ALL_FACULTIES]: 'All Faculties'
};

export const CATEGORIES = {
  WORKSHOP: 'WORKSHOP',
  COMPETITION: 'COMPETITION',
  SEMINAR: 'SEMINAR',
  CULTURAL: 'CULTURAL',
  SPORTS: 'SPORTS',
  CAREER: 'CAREER',
  ACADEMIC: 'ACADEMIC',
  SOCIAL: 'SOCIAL',
  PROFESSIONAL: 'PROFESSIONAL',
  INDUSTRY_VISIT: 'INDUSTRY_VISIT',
  JOB_FAIR: 'JOB_FAIR',
  CAREER_WORKSHOP: 'CAREER_WORKSHOP',
  INTERVIEW_PREPARATION: 'INTERVIEW_PREPARATION',
  NETWORKING_EVENT: 'NETWORKING_EVENT',
  PROFESSIONAL_DEVELOPMENT: 'PROFESSIONAL_DEVELOPMENT',
  INTERNSHIP_PROGRAM: 'INTERNSHIP_PROGRAM',
  GUEST_LECTURE: 'GUEST_LECTURE'
};

export const CATEGORY_LABELS = {
  [CATEGORIES.WORKSHOP]: 'Workshop',
  [CATEGORIES.COMPETITION]: 'Competition',
  [CATEGORIES.SEMINAR]: 'Seminar',
  [CATEGORIES.CULTURAL]: 'Cultural',
  [CATEGORIES.SPORTS]: 'Sports',
  [CATEGORIES.CAREER]: 'Career',
  [CATEGORIES.ACADEMIC]: 'Academic',
  [CATEGORIES.SOCIAL]: 'Social',
  [CATEGORIES.PROFESSIONAL]: 'Professional',
  [CATEGORIES.INDUSTRY_VISIT]: 'Industry Visit',
  [CATEGORIES.JOB_FAIR]: 'Job Fair',
  [CATEGORIES.CAREER_WORKSHOP]: 'Career Workshop',
  [CATEGORIES.INTERVIEW_PREPARATION]: 'Interview Preparation',
  [CATEGORIES.NETWORKING_EVENT]: 'Networking Event',
  [CATEGORIES.PROFESSIONAL_DEVELOPMENT]: 'Professional Development',
  [CATEGORIES.INTERNSHIP_PROGRAM]: 'Internship Program',
  [CATEGORIES.GUEST_LECTURE]: 'Guest Lecture'
};

export const EVENT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  DRAFT: 'Draft'
};

export const PRICE_OPTIONS = {
  FREE: 'Free',
  PAID: 'Paid'
};

// Color schemes for different faculties
export const FACULTY_COLORS = {
  [FACULTIES.COMPUTING]: {
    primary: 'blue',
    bg: 'bg-blue-500',
    text: 'text-blue-400',
    hover: 'hover:bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  [FACULTIES.ENGINEERING]: {
    primary: 'red',
    bg: 'bg-red-500',
    text: 'text-red-400',
    hover: 'hover:bg-red-500/10',
    border: 'border-red-500/30'
  },
  [FACULTIES.BUSINESS]: {
    primary: 'green',
    bg: 'bg-green-500',
    text: 'text-green-400',
    hover: 'hover:bg-green-500/10',
    border: 'border-green-500/30'
  },
  [FACULTIES.SLIIT_BUSINESS_SCHOOL]: {
    primary: 'green',
    bg: 'bg-green-500',
    text: 'text-green-400',
    hover: 'hover:bg-green-500/10',
    border: 'border-green-500/30'
  },
  [FACULTIES.HUMANITIES]: {
    primary: 'purple',
    bg: 'bg-purple-500',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  [FACULTIES.SCIENCE]: {
    primary: 'orange',
    bg: 'bg-orange-500',
    text: 'text-orange-400',
    hover: 'hover:bg-orange-500/10',
    border: 'border-orange-500/30'
  },
  [FACULTIES.ALL_FACULTIES]: {
    primary: 'yellow',
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    hover: 'hover:bg-yellow-500/10',
    border: 'border-yellow-500/30'
  }
};

// Default event form data
export const DEFAULT_EVENT_DATA = {
  title: '',
  description: '',
  fullDescription: '',
  date: '',
  endDate: '',
  time: '',
  location: '',
  faculty: FACULTIES.ALL_FACULTIES,
  category: CATEGORIES.ACADEMIC,
  organizer: '',
  maxParticipants: '',
  registeredCount: 0,
  price: PRICE_OPTIONS.FREE,
  featured: false,
  hasRegistration: true,
  status: EVENT_STATUS.ACTIVE,
  tags: [],
  requirements: [],
  agenda: null,
  speakers: null,
  contact: null,
  company: '',
  industry: '',
  jobOpportunities: '',
  internshipOpportunities: '',
  skillsRequired: '',
  dresscode: '',
  image: '',
  prizes: []
};

// Validation rules
export const VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  date: {
    required: true
  },
  time: {
    required: true
  },
  location: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  organizer: {
    required: true,
    minLength: 2,
    maxLength: 100
  }
};

// API endpoints
export const API_ENDPOINTS = {
  EVENTS: '/api/events',
  EVENT_BY_ID: (id) => `/api/events/${id}`,
  EVENTS_BY_CATEGORY: (category) => `/api/events?category=${category}`,
  EVENTS_BY_FACULTY: (faculty) => `/api/events?faculty=${faculty}`,
  EVENTS_SEARCH: (query) => `/api/events?search=${encodeURIComponent(query)}`,
  FEATURED_EVENTS: '/api/events?featured=true'
};

export default {
  FACULTIES,
  FACULTY_LABELS,
  CATEGORIES,
  CATEGORY_LABELS,
  EVENT_STATUS,
  PRICE_OPTIONS,
  FACULTY_COLORS,
  DEFAULT_EVENT_DATA,
  VALIDATION_RULES,
  API_ENDPOINTS
};