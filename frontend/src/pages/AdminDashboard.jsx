import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm, UserForm, ClubForm } from '../components/forms';
import { eventsAPI } from '../services/api';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userServices';
import { getClubs, createClub, updateClub, deleteClub } from '../services/clubServices';
import { getVenues, getVenueById, createVenue, updateVenue, deleteVenue } from '../services/venueServices';
import VenueForm from '../components/forms/VenueForm';
import { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/announcementServices';
import AnnouncementForm from '../components/forms/AnnouncementForm';
import { getClubImageUrl, createPlaceholderImage } from '../utils/imageUtils';
import CustomAlert from '../components/CustomAlert';
import ConfirmAlert from '../components/ConfirmAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { useConfirmAlert } from '../hooks/useConfirmAlert';
import EventsTab from './tabs/EventsTab';
import UsersTab from './tabs/UsersTab';
import ClubsTab from './tabs/ClubsTab';
import VenuesTab from './tabs/VenuesTab';
import AnnouncementsTab from './tabs/AnnouncementsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import CareerTab from './tabs/CareerTab';
import RegistrationsTab from './tabs/RegistrationsTab';
import PhotographsTab from './tabs/PhotographsTab';
import { getCareers, getCareerById, createCareer, updateCareer, deleteCareer } from '../services/careerServices';
import SettingsTab from './tabs/SettingsTab';
import { PhotoForm } from '../components/forms';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  // Custom alert hooks
  const { alert, showSuccess, showError, hideAlert } = useCustomAlert();
  const { confirm, showConfirm, hideConfirm, confirmDelete } = useConfirmAlert();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Events dynamic filter state (match announcements style)
  const [eventFilterBy, setEventFilterBy] = useState('none');
  const [eventFilterCategory, setEventFilterCategory] = useState('all');
  const [eventFilterFaculty, setEventFilterFaculty] = useState('all');
  const [eventFilterDateFrom, setEventFilterDateFrom] = useState('');
  const [eventFilterDateTo, setEventFilterDateTo] = useState('');

  // --- Users state ---
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  // --- Clubs state ---
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [clubsError, setClubsError] = useState(null);
  const [clubSearchQuery, setClubSearchQuery] = useState('');
  const [clubFilterBy, setClubFilterBy] = useState('none');
  const [clubFilterCategory, setClubFilterCategory] = useState('all');
  const [clubFilterFaculty, setClubFilterFaculty] = useState('all');
  const [clubFilterStatus, setClubFilterStatus] = useState('all');
  const [clubFilterDateFrom, setClubFilterDateFrom] = useState('');
  const [clubFilterDateTo, setClubFilterDateTo] = useState('');
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [showEditClubModal, setShowEditClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  // --- Venues state ---
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState(null);
  const [venueSearch, setVenueSearch] = useState('');
  const [venueFilterBy, setVenueFilterBy] = useState('none');
  const [venueFilterCategory, setVenueFilterCategory] = useState('all');
  const [venueFilterStatus, setVenueFilterStatus] = useState('all');
  const [showAddVenueModal, setShowAddVenueModal] = useState(false);
  const [showEditVenueModal, setShowEditVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [photosReloadKey, setPhotosReloadKey] = useState(0);

  // --- Announcements state ---
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [annSearch, setAnnSearch] = useState('');
  const [annFilterBy, setAnnFilterBy] = useState('none');
  const [annFilterType, setAnnFilterType] = useState('all');
  const [annFilterPriority, setAnnFilterPriority] = useState('all');
  const [annFilterFaculty, setAnnFilterFaculty] = useState('all');
  const [annFilterDateFrom, setAnnFilterDateFrom] = useState('');
  const [annFilterDateTo, setAnnFilterDateTo] = useState('');
  const [showEditAnnouncementModal, setShowEditAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // --- Careers state ---
  const [careers, setCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(false);
  const [careersError, setCareersError] = useState(null);
  const [showAddCareerModal, setShowAddCareerModal] = useState(false);
  const [showEditCareerModal, setShowEditCareerModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [careerFilterBy, setCareerFilterBy] = useState('none');
  const [careerFilterType, setCareerFilterType] = useState('all');
  const [careerFilterDateFrom, setCareerFilterDateFrom] = useState('');
  const [careerFilterDateTo, setCareerFilterDateTo] = useState('');

  // Reset helpers for filters
  const resetEventFilters = () => {
    setEventFilterBy('none');
    setEventFilterCategory('all');
    setEventFilterFaculty('all');
    setEventFilterDateFrom('');
    setEventFilterDateTo('');
    setSearchQuery('');
  };

  const resetVenueFilters = () => {
    setVenueFilterBy('none');
    setVenueFilterCategory('all');
    setVenueFilterStatus('all');
    setVenueSearch('');
  };

  const resetAnnouncementFilters = () => {
    setAnnFilterBy('none');
    setAnnFilterType('all');
    setAnnFilterPriority('all');
    setAnnFilterFaculty('all');
    setAnnFilterDateFrom('');
    setAnnFilterDateTo('');
    setAnnSearch('');
  };


  const resetClubFilters = () => {
    setClubFilterBy('none');
    setClubFilterFaculty('all');
    setClubFilterStatus('all');
    setClubFilterDateFrom('');
    setClubFilterDateTo('');
    setClubSearchQuery('');
  };

  const resetCareerFilters = () => {
    setCareerSearchQuery('');
    setCareerFilterBy('none');
    setCareerFilterType('all');
    setCareerFilterDateFrom('');
    setCareerFilterDateTo('');
  };

  // System settings state (persisted to localStorage)
  const [defaultEventCapacity, setDefaultEventCapacity] = useState(() => {
    const v = localStorage.getItem('defaultEventCapacity');
    return v ? Number(v) : 100;
  });
  const [registrationDeadlineDays, setRegistrationDeadlineDays] = useState(() => {
    const v = localStorage.getItem('registrationDeadlineDays');
    return v ? Number(v) : 3;
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const storedUser = localStorage.getItem('adminUser');
    
    if (!isLoggedIn || !storedUser) {
      navigate('/admin/login');
      return;
    }
    
    try {
      const user = JSON.parse(storedUser);
      setAdminUser(user);
      setIsAuthenticating(false);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch events from API on component mount
  useEffect(() => {
    if (!isAuthenticating) {
      fetchEvents();
    }
  }, [isAuthenticating]);

  // Fetch users when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch clubs when clubs tab is active
  useEffect(() => {
    if (activeTab === 'clubs') {
      fetchClubs();
    }
  }, [activeTab]);

  // Fetch venues when venues tab is active
  useEffect(() => {
    if (activeTab === 'venues') {
      fetchVenues();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await eventsAPI.getAll();
      // Ensure events are sorted newest -> oldest (by event date, fallback to createdAt)
      const sortEventsByNewest = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.slice().sort((a, b) => {
          // Primary: newest createdAt first
          const aCreated = a?.createdAt ? new Date(a.createdAt) : null;
          const bCreated = b?.createdAt ? new Date(b.createdAt) : null;
          if (aCreated && bCreated) {
            const diff = bCreated - aCreated;
            if (diff !== 0) return diff;
          } else if (aCreated || bCreated) {
            // If one has createdAt, prefer that one
            return (bCreated ? 1 : 0) - (aCreated ? 1 : 0);
          }

          // Secondary: event date (newest first)
          const aDate = a?.date ? new Date(a.date) : new Date(0);
          const bDate = b?.date ? new Date(b.date) : new Date(0);
          return bDate - aDate;
        });
      };

      setEvents(sortEventsByNewest(eventsData || []));
    } catch (err) {
      setError('Failed to fetch events. Please ensure the backend server is running.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  // User management functions
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const usersData = await getUsers();
      setUsers(usersData || []);
    } catch (err) {
      setUsersError('Failed to fetch users. Please ensure the backend server is running.');
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const createdUser = await createUser(userData);
      setUsers([...users, createdUser]);
      showSuccess('Success!', 'User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      showError('Error', 'Failed to create user. Please try again.');
      throw error; // Re-throw to let UserForm handle it
    }
  };

  const handleEditUser = async (userData) => {
    try {
      const updatedUser = await updateUser(editingUser.id, userData);
      setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
      setEditingUser(null);
      showSuccess('Success!', 'User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showError('Error', 'Failed to update user. Please try again.');
      throw error; // Re-throw to let UserForm handle it
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    confirmDelete(userName, async () => {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        showSuccess('Success!', 'User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        showError('Error', 'Failed to delete user. Please try again.');
      }
    });
  };

  const startEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditUserModal(true);
  };

  // Club management functions
  const fetchClubs = async () => {
    try {
      setClubsLoading(true);
      setClubsError(null);
      const clubsData = await getClubs();
      setClubs(clubsData || []);
    } catch (err) {
      setClubsError('Failed to fetch clubs. Please ensure the backend server is running.');
      console.error('Error fetching clubs:', err);
    } finally {
      setClubsLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      setVenuesLoading(true);
      setVenuesError(null);
      const data = await getVenues();
      setVenues(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setVenuesError('Failed to fetch venues. Please ensure the backend server is running.');
      console.error('Error fetching venues:', err);
    } finally {
      setVenuesLoading(false);
    }
  };

  const handleAddVenue = async (venueData) => {
    try {
      const created = await createVenue(venueData);
      setVenues(prev => [...prev, created]);
      setShowAddVenueModal(false);
      showSuccess('Success!', 'Venue created successfully!');
    } catch (err) {
      console.error('Error creating venue:', err);
      showError('Error', 'Failed to create venue.');
    }
  };

  const startEditVenue = (venue) => {
    (async () => {
      try {
        const full = await getVenueById(venue.id);
        setEditingVenue(full);
        setShowEditVenueModal(true);
      } catch (err) {
        console.error('Error fetching venue details:', err);
        showError('Error', 'Failed to load venue details.');
      }
    })();
  };

  const handleEditVenue = async (formData) => {
    try {
      const updated = await updateVenue(editingVenue.id, formData);
      setVenues(prev => prev.map(v => v.id === editingVenue.id ? updated : v));
      setEditingVenue(null);
      setShowEditVenueModal(false);
      showSuccess('Success!', 'Venue updated successfully!');
    } catch (err) {
      console.error('Error updating venue:', err);
      showError('Error', 'Failed to update venue.');
    }
  };

  const handleDeleteVenue = (venueId, venueName) => {
    confirmDelete(venueName, async () => {
      try {
        await deleteVenue(venueId);
        setVenues(prev => prev.filter(v => v.id !== venueId));
        showSuccess('Success!', 'Venue deleted successfully!');
      } catch (err) {
        console.error('Error deleting venue:', err);
        showError('Error', 'Failed to delete venue.');
      }
    });
  };

  const handleAddClub = async (clubData) => {
    try {
      const createdClub = await createClub(clubData);
      setClubs([...clubs, createdClub]);
      showSuccess('Success!', 'Club created successfully!');
    } catch (error) {
      console.error('Error creating club:', error);
      showError('Error', 'Failed to create club. Please try again.');
      throw error; // Re-throw to let ClubForm handle it
    }
  };

  const handleEditClub = async (clubData) => {
    try {
      const updatedClub = await updateClub(editingClub.id, clubData);
      setClubs(clubs.map(club => club.id === editingClub.id ? updatedClub : club));
      setEditingClub(null);
      showSuccess('Success!', 'Club updated successfully!');
    } catch (error) {
      console.error('Error updating club:', error);
      showError('Error', 'Failed to update club. Please try again.');
      throw error; // Re-throw to let ClubForm handle it
    }
  };

  const handleDeleteClub = async (clubId, clubName) => {
    confirmDelete(clubName, async () => {
      try {
        await deleteClub(clubId);
        setClubs(clubs.filter(club => club.id !== clubId));
        showSuccess('Success!', 'Club deleted successfully!');
      } catch (error) {
        console.error('Error deleting club:', error);
        showError('Error', 'Failed to delete club. Please try again.');
      }
    });
  };

  const startEditClub = (club) => {
    setEditingClub({ ...club });
    setShowEditClubModal(true);
  };

  // --- Announcements functions ---
  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      setAnnouncementsError(null);
      const data = await getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setAnnouncementsError('Failed to fetch announcements. Please ensure the backend server is running.');
      console.error('Error fetching announcements:', err);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab]);

  // Fetch careers when tab active
  const fetchCareers = async () => {
    try {
      setCareersLoading(true);
      setCareersError(null);
      const data = await getCareers();
      setCareers(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      setCareersError('Failed to fetch careers. Please ensure the backend server is running.');
      console.error('Error fetching careers:', err);
    } finally {
      setCareersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'career') {
      fetchCareers();
    }
  }, [activeTab]);

  const handleAddCareer = async (careerData) => {
    try {
      const created = await createCareer(careerData);
      setCareers(prev => [...prev, created]);
      setShowAddCareerModal(false);
      showSuccess('Success!', 'Career entry created successfully!');
    } catch (err) {
      console.error('Error creating career:', err);
      showError('Error', 'Failed to create career.');
      throw err;
    }
  };

  const startEditCareer = (career) => {
    (async () => {
      try {
        if (career?.id) {
          const full = await getCareerById(career.id);
          setEditingCareer(full || career);
        } else {
          setEditingCareer({ ...career });
        }
        setShowEditCareerModal(true);
      } catch (err) {
        console.error('Error fetching career details:', err);
        showError('Error', 'Failed to load career details.');
      }
    })();
  };

  const handleEditCareer = async (formData) => {
    try {
      const updated = await updateCareer(editingCareer.id, formData);
      setCareers(prev => prev.map(c => c.id === editingCareer.id ? updated : c));
      setEditingCareer(null);
      setShowEditCareerModal(false);
      showSuccess('Success!', 'Career updated successfully!');
    } catch (err) {
      console.error('Error updating career:', err);
      showError('Error', 'Failed to update career.');
      throw err;
    }
  };

  const handleDeleteCareer = (careerId, careerTitle) => {
    confirmDelete(careerTitle, async () => {
      try {
        await deleteCareer(careerId);
        setCareers(prev => prev.filter(c => c.id !== careerId));
        showSuccess('Success!', 'Career entry deleted successfully!');
      } catch (err) {
        console.error('Error deleting career:', err);
        showError('Error', 'Failed to delete career.');
      }
    });
  };

  const handleAddAnnouncement = async (announcementData) => {
    try {
      const created = await createAnnouncement(announcementData);
      setAnnouncements(prev => [...prev, created]);
      setShowAddAnnouncementModal(false);
      showSuccess('Success!', 'Announcement created successfully!');
    } catch (err) {
      console.error('Error creating announcement:', err);
      showError('Error', 'Failed to create announcement.');
      throw err;
    }
  };

  const startEditAnnouncement = (announcement) => {
    (async () => {
      try {
        // Try fetching full announcement details if available
        if (announcement?.id) {
          const full = await getAnnouncementById(announcement.id);
          setEditingAnnouncement(full || announcement);
        } else {
          setEditingAnnouncement({ ...announcement });
        }
        setShowEditAnnouncementModal(true);
      } catch (err) {
        console.error('Error fetching announcement details:', err);
        showError('Error', 'Failed to load announcement details.');
      }
    })();
  };

  const handleEditAnnouncement = async (formData) => {
    try {
      const updated = await updateAnnouncement(editingAnnouncement.id, formData);
      setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? updated : a));
      setEditingAnnouncement(null);
      setShowEditAnnouncementModal(false);
      showSuccess('Success!', 'Announcement updated successfully!');
    } catch (err) {
      console.error('Error updating announcement:', err);
      showError('Error', 'Failed to update announcement.');
      throw err;
    }
  };

  const handleDeleteAnnouncement = (announcementId, announcementTitle) => {
    confirmDelete(announcementTitle, async () => {
      try {
        await deleteAnnouncement(announcementId);
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
        showSuccess('Success!', 'Announcement deleted successfully!');
      } catch (err) {
        console.error('Error deleting announcement:', err);
        showError('Error', 'Failed to delete announcement.');
      }
    });
  };

  

  const categories = [
    { value: 'all', label: 'All Categories' },
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

  const handleAddEvent = async (eventData) => {
    try {
      // Create event via API
      const newEvent = await eventsAPI.create(eventData);
      
      // Update local state with the new event
      setEvents(prevEvents => {
        const merged = [...prevEvents, newEvent];
        // reuse sorting logic to keep newest first
        const sortEventsByNewest = (arr) => {
          if (!Array.isArray(arr)) return [];
          return arr.slice().sort((a, b) => {
            const aCreated = a?.createdAt ? new Date(a.createdAt) : null;
            const bCreated = b?.createdAt ? new Date(b.createdAt) : null;
            if (aCreated && bCreated) {
              const diff = bCreated - aCreated;
              if (diff !== 0) return diff;
            } else if (aCreated || bCreated) {
              return (bCreated ? 1 : 0) - (aCreated ? 1 : 0);
            }
            const aDate = a?.date ? new Date(a.date) : new Date(0);
            const bDate = b?.date ? new Date(b.date) : new Date(0);
            return bDate - aDate;
          });
        };
        return sortEventsByNewest(merged);
      });
      showSuccess('Success!', 'Event created successfully!');
      
    } catch (error) {
      console.error('Error creating event:', error);
      showError('Error', 'Failed to create event. Please check your connection and try again.');
      throw error; // Re-throw to let EventForm handle it
    }
  };

  const handleEditEvent = async (eventData) => {
    try {
      console.log('Updating event with ID:', editingEvent.id);
      console.log('Event data being sent:', eventData);
      
      // Update event via API
      const updatedEvent = await eventsAPI.update(editingEvent.id, eventData);
      
      console.log('Update successful, received:', updatedEvent);
      
      // Refresh events list to ensure we have the latest data
      const refreshedEvents = await eventsAPI.getAll();
      // sort refreshed events newest -> oldest
      const sortEventsByNewest = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.slice().sort((a, b) => {
          const aCreated = a?.createdAt ? new Date(a.createdAt) : null;
          const bCreated = b?.createdAt ? new Date(b.createdAt) : null;
          if (aCreated && bCreated) {
            const diff = bCreated - aCreated;
            if (diff !== 0) return diff;
          } else if (aCreated || bCreated) {
            return (bCreated ? 1 : 0) - (aCreated ? 1 : 0);
          }
          const aDate = a?.date ? new Date(a.date) : new Date(0);
          const bDate = b?.date ? new Date(b.date) : new Date(0);
          return bDate - aDate;
        });
      };
      setEvents(sortEventsByNewest(refreshedEvents));
      
      setEditingEvent(null);
      setShowEditModal(false);
      showSuccess('Success!', 'Event updated successfully!');
      
    } catch (error) {
      console.error('Error updating event:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        eventId: editingEvent?.id,
        eventData: eventData
      });
      showError('Error', `Failed to update event: ${error.message}. Please try again.`);
      throw error; // Re-throw to let EventForm handle it
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    confirmDelete(eventTitle, async () => {
      try {
        // Delete event via API
        await eventsAPI.delete(eventId);
        
        // Update local state by removing the deleted event
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        showSuccess('Success!', 'Event deleted successfully!');
        
      } catch (error) {
        console.error('Error deleting event:', error);
        showError('Error', 'Failed to delete event. Please check your connection and try again.');
      }
    });
  };

  const startEditEvent = (event) => {
    // Convert event data to match EventForm expectations
    const editData = {
      ...event,
      // Prefer explicit startTime/endTime if provided by the transformed event
      startTime: event.startTime || (typeof event.time === 'string' && event.time.includes(' - ') ? event.time.split(' - ')[0] : event.time || ''),
      endTime: event.endTime || (typeof event.time === 'string' && event.time.includes(' - ') ? event.time.split(' - ')[1] : ''),
      // The event data from DB already has enum values, so we use them directly
      faculty: event.faculty || 'COMPUTING',
      category: event.category || 'WORKSHOP',
      tags: event.tags || [],
      requirements: event.requirements || [],
      prizes: event.prizes || [],
      agenda: event.agenda || [],
      speakers: event.speakers || [],
      contact: event.contact || { email: '', phone: '', coordinator: '' }
    };
    
    setEditingEvent(editData);
    setShowEditModal(true);
  };

  // Save settings to localStorage and show feedback
  const saveSettings = async () => {
    try {
      setIsSavingSettings(true);
      const capacity = Number(defaultEventCapacity);
      const days = Number(registrationDeadlineDays);

      if (!Number.isInteger(capacity) || capacity <= 0) {
        showError('Invalid value', 'Default Event Capacity must be a positive integer.');
        return;
      }
      if (!Number.isInteger(days) || days < 0) {
        showError('Invalid value', 'Registration Deadline must be a non-negative integer.');
        return;
      }

      // Persist settings locally (could be extended to call an API)
      localStorage.setItem('defaultEventCapacity', String(capacity));
      localStorage.setItem('registrationDeadlineDays', String(days));

      showSuccess('Settings Saved', 'Your system settings have been saved.');
    } catch (err) {
      console.error('Error saving settings:', err);
      showError('Save failed', 'Failed to save settings. Please try again.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    // Apply dynamic filters if chosen, otherwise fall back to legacy filterCategory
    let matchesFilter = true;
    if (eventFilterBy === 'category') {
      matchesFilter = eventFilterCategory === 'all' || event.category === eventFilterCategory || event.category === categories.find(c => c.value === eventFilterCategory)?.label;
    } else if (eventFilterBy === 'faculty') {
      matchesFilter = eventFilterFaculty === 'all' || String(event.faculty) === String(eventFilterFaculty);
    } else if (eventFilterBy === 'date') {
      if (eventFilterDateFrom) {
        const from = new Date(eventFilterDateFrom);
        const ed = event.date ? new Date(event.date) : null;
        if (!ed || ed < from) return false;
      }
      if (eventFilterDateTo) {
        const to = new Date(eventFilterDateTo);
        const ed = event.date ? new Date(event.date) : null;
        if (!ed || ed > to) return false;
      }
    } else {
      matchesFilter = filterCategory === 'all' || event.category === filterCategory || event.category === categories.find(c => c.value === filterCategory)?.label;
    }

    return matchesSearch && matchesFilter;
  });

  // Club filtering logic
  const clubCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Social Service', label: 'Social Service' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Special Interest', label: 'Special Interest' },
    { value: 'Leadership', label: 'Leadership' }
  ];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = (club.name || '').toLowerCase().includes(clubSearchQuery.toLowerCase()) ||
                         (club.description || '').toLowerCase().includes(clubSearchQuery.toLowerCase()) ||
                         (club.faculty || '').toLowerCase().includes(clubSearchQuery.toLowerCase());

    // Apply dynamic club filters if selected, otherwise fallback to legacy clubFilterCategory
    let matchesFilter = true;
    if (clubFilterBy === 'faculty') {
      matchesFilter = clubFilterFaculty === 'all' || String(club.faculty) === String(clubFilterFaculty);
    } else if (clubFilterBy === 'status') {
      matchesFilter = clubFilterStatus === 'all' || String(club.status) === String(clubFilterStatus);
    } else if (clubFilterBy === 'date') {
      if (clubFilterDateFrom) {
        const from = new Date(clubFilterDateFrom);
        const cd = club.createdAt ? new Date(club.createdAt) : null;
        if (!cd || cd < from) return false;
      }
      if (clubFilterDateTo) {
        const to = new Date(clubFilterDateTo);
        const cd = club.createdAt ? new Date(club.createdAt) : null;
        if (!cd || cd > to) return false;
      }
    } else {
      matchesFilter = clubFilterCategory === 'all' || club.category === clubFilterCategory;
    }

    return matchesSearch && matchesFilter;
  });

  // Users filtering (search by name or email)
  const filteredUsers = users.filter(user => {
    const q = (userSearchQuery || '').trim().toLowerCase();
    if (!q) return true;
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Utility: format enum-ish strings into sentence case for display
  const formatSentenceCase = (value) => {
    if (value === null || value === undefined) return '';
    const s = String(value).replace(/_/g, ' ').replace(/-/g, ' ').toLowerCase();
    return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Show loading screen while checking authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <header className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-500">EventHub</h1>
              <span className="ml-3 text-xs text-gray-400 font-medium self-end">Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white">
                Welcome, {adminUser?.name || 'Admin'}
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-yellow-500 hover:text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-500/10 hover:bg-yellow-500/5"
              >
                View Main Site
              </button>
              <button
                onClick={() => {
                  // Clear authentication data
                  localStorage.removeItem('isAdminLoggedIn');
                  localStorage.removeItem('adminUser');
                  navigate('/admin/login');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Dashboard</h2>
          <p className="text-gray-300">Manage events with the new structured form components</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Events</p>
                <p className="text-2xl font-bold text-white">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Active Events</p>
                <p className="text-2xl font-bold text-white">{events.filter(e => e.status === 'Active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Registrations</p>
                <p className="text-2xl font-bold text-white">{events.reduce((sum, event) => sum + event.registeredCount, 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">This Month</p>
                <p className="text-2xl font-bold text-white">{events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <nav className="flex justify-between items-center -mb-px">
            {/* Left side: primary tabs (requested order) */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Users
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Events
              </button>

              <button
                onClick={() => setActiveTab('clubs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'clubs'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Clubs
              </button>

              <button
                onClick={() => setActiveTab('career')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'career'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Careers
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'announcements'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Announcement
              </button>

              <button
                onClick={() => setActiveTab('venues')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'venues'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Venues
              </button>

              <button
                onClick={() => setActiveTab('registrations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registrations'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Registrations
              </button>

              <button
                onClick={() => setActiveTab('photographs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'photographs'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Photographs
              </button>
            </div>

            {/* Right side: Analytics & Settings */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-yellow-500 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-gray-700'
                }`}
              >
                Settings
              </button>
            </div>
          </nav>
        </div>

        {/* Events Tab (moved to separate file) */}
        {activeTab === 'events' && (
          <EventsTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            eventFilterBy={eventFilterBy}
            setEventFilterBy={setEventFilterBy}
            eventFilterCategory={eventFilterCategory}
            setEventFilterCategory={setEventFilterCategory}
            eventFilterFaculty={eventFilterFaculty}
            setEventFilterFaculty={setEventFilterFaculty}
            eventFilterDateFrom={eventFilterDateFrom}
            setEventFilterDateFrom={setEventFilterDateFrom}
            eventFilterDateTo={eventFilterDateTo}
            setEventFilterDateTo={setEventFilterDateTo}
            resetEventFilters={resetEventFilters}
            setShowAddModal={setShowAddModal}
            loading={loading}
            error={error}
            filteredEvents={filteredEvents}
            categories={categories}
            formatSentenceCase={formatSentenceCase}
            getStatusColor={getStatusColor}
            startEditEvent={startEditEvent}
            handleDeleteEvent={handleDeleteEvent}
            fetchEvents={fetchEvents}
          />
        )}

        {activeTab === 'clubs' && (
          <ClubsTab
            clubSearchQuery={clubSearchQuery}
            setClubSearchQuery={setClubSearchQuery}
            clubFilterBy={clubFilterBy}
            setClubFilterBy={setClubFilterBy}
            clubFilterCategory={clubFilterCategory}
            setClubFilterCategory={setClubFilterCategory}
            clubFilterFaculty={clubFilterFaculty}
            setClubFilterFaculty={setClubFilterFaculty}
            clubFilterStatus={clubFilterStatus}
            setClubFilterStatus={setClubFilterStatus}
            clubFilterDateFrom={clubFilterDateFrom}
            setClubFilterDateFrom={setClubFilterDateFrom}
            clubFilterDateTo={clubFilterDateTo}
            setClubFilterDateTo={setClubFilterDateTo}
            resetClubFilters={resetClubFilters}
            setShowAddClubModal={setShowAddClubModal}
            clubsLoading={clubsLoading}
            clubsError={clubsError}
            filteredClubs={filteredClubs}
            clubCategories={clubCategories}
            faculties={faculties}
            startEditClub={startEditClub}
            handleDeleteClub={handleDeleteClub}
          />
        )}

        {activeTab === 'venues' && (
          <VenuesTab
            venueSearch={venueSearch}
            setVenueSearch={setVenueSearch}
            venueFilterBy={venueFilterBy}
            setVenueFilterBy={setVenueFilterBy}
            venueFilterCategory={venueFilterCategory}
            setVenueFilterCategory={setVenueFilterCategory}
            venueFilterStatus={venueFilterStatus}
            setVenueFilterStatus={setVenueFilterStatus}
            resetVenueFilters={resetVenueFilters}
            setShowAddVenueModal={setShowAddVenueModal}
            venuesLoading={venuesLoading}
            venuesError={venuesError}
            venues={venues}
            categories={categories}
            formatSentenceCase={formatSentenceCase}
            startEditVenue={startEditVenue}
            handleDeleteVenue={handleDeleteVenue}
            showAddVenueModal={showAddVenueModal}
            showEditVenueModal={showEditVenueModal}
            editingVenue={editingVenue}
            handleAddVenue={handleAddVenue}
            handleEditVenue={handleEditVenue}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            setShowAddUserModal={setShowAddUserModal}
            usersLoading={usersLoading}
            usersError={usersError}
            filteredUsers={filteredUsers}
            startEditUser={startEditUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'registrations' && (
          <RegistrationsTab />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsTab
            annSearch={annSearch}
            setAnnSearch={setAnnSearch}
            annFilterBy={annFilterBy}
            setAnnFilterBy={setAnnFilterBy}
            annFilterType={annFilterType}
            setAnnFilterType={setAnnFilterType}
            annFilterPriority={annFilterPriority}
            setAnnFilterPriority={setAnnFilterPriority}
            annFilterFaculty={annFilterFaculty}
            setAnnFilterFaculty={setAnnFilterFaculty}
            annFilterDateFrom={annFilterDateFrom}
            setAnnFilterDateFrom={setAnnFilterDateFrom}
            annFilterDateTo={annFilterDateTo}
            setAnnFilterDateTo={setAnnFilterDateTo}
            resetAnnouncementFilters={resetAnnouncementFilters}
            setShowAddAnnouncementModal={setShowAddAnnouncementModal}
            announcements={announcements}
            announcementsLoading={announcementsLoading}
            announcementsError={announcementsError}
            startEditAnnouncement={startEditAnnouncement}
            handleDeleteAnnouncement={handleDeleteAnnouncement}
            formatSentenceCase={formatSentenceCase}
            faculties={faculties}
          />
        )}

        {activeTab === 'photographs' && (
          <PhotographsTab 
            events={events} 
            setShowAddPhotosModal={setShowAddPhotosModal} 
            photosReloadKey={photosReloadKey} 
            setEditingPhoto={setEditingPhoto}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab events={events} categories={categories} />
        )}

        {activeTab === 'career' && (
          <CareerTab
            careers={careers}
            careersLoading={careersLoading}
            careersError={careersError}
            startEditCareer={startEditCareer}
            handleDeleteCareer={handleDeleteCareer}
            setShowAddCareerModal={setShowAddCareerModal}
            setShowEditCareerModal={setShowEditCareerModal}
            showAddCareerModal={showAddCareerModal}
            showEditCareerModal={showEditCareerModal}
            editingCareer={editingCareer}
            handleAddCareer={handleAddCareer}
            handleEditCareer={handleEditCareer}
            searchQuery={careerSearchQuery}
            setSearchQuery={setCareerSearchQuery}
            careerFilterBy={careerFilterBy}
            setCareerFilterBy={setCareerFilterBy}
            careerFilterType={careerFilterType}
            setCareerFilterType={setCareerFilterType}
            careerFilterDateFrom={careerFilterDateFrom}
            setCareerFilterDateFrom={setCareerFilterDateFrom}
            careerFilterDateTo={careerFilterDateTo}
            setCareerFilterDateTo={setCareerFilterDateTo}
            resetCareerFilters={resetCareerFilters}
            formatSentenceCase={formatSentenceCase}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            defaultEventCapacity={defaultEventCapacity}
            setDefaultEventCapacity={setDefaultEventCapacity}
            registrationDeadlineDays={registrationDeadlineDays}
            setRegistrationDeadlineDays={setRegistrationDeadlineDays}
            saveSettings={saveSettings}
            isSavingSettings={isSavingSettings}
          />
        )}
      </div>

      {/* Modals: grouped to keep JSX balanced and easy to read */}
      <>
        <EventForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEvent}
          mode="add"
        />

        <EventForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditEvent}
          initialData={editingEvent}
          mode="edit"
        />

        {showAddAnnouncementModal && (
          <AnnouncementForm
            isOpen={showAddAnnouncementModal}
            onClose={() => setShowAddAnnouncementModal(false)}
            onSubmit={handleAddAnnouncement}
            mode="add"
          />
        )}

        {showEditAnnouncementModal && (
          <AnnouncementForm
            isOpen={showEditAnnouncementModal}
            onClose={() => setShowEditAnnouncementModal(false)}
            onSubmit={(formData) => handleEditAnnouncement(formData)}
            initialData={editingAnnouncement}
            mode="edit"
          />
        )}

        <UserForm
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onSubmit={handleAddUser}
          mode="add"
        />

        <UserForm
          isOpen={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          onSubmit={handleEditUser}
          initialData={editingUser}
          mode="edit"
        />

        <ClubForm
          isOpen={showAddClubModal}
          onClose={() => setShowAddClubModal(false)}
          onSubmit={handleAddClub}
          mode="add"
        />

        <ClubForm
          isOpen={showEditClubModal}
          onClose={() => setShowEditClubModal(false)}
          onSubmit={handleEditClub}
          initialData={editingClub}
          mode="edit"
        />
 
        {showAddVenueModal && (
          <VenueForm
            isOpen={showAddVenueModal}
            onClose={() => setShowAddVenueModal(false)}
            onSubmit={handleAddVenue}
            mode="add"
          />
        )}

        {showAddPhotosModal && (
          <PhotoForm
            isOpen={showAddPhotosModal}
            onClose={() => {
              setShowAddPhotosModal(false);
              setEditingPhoto(null);
            }}
            events={events}
            editingPhoto={editingPhoto}
            onUploaded={() => { 
              setPhotosReloadKey(k => k + 1);
              setEditingPhoto(null);
            }}
          />
        )}

        {showEditVenueModal && (
          <VenueForm
            isOpen={showEditVenueModal}
            onClose={() => setShowEditVenueModal(false)}
            onSubmit={handleEditVenue}
            initialData={editingVenue}
            mode="edit"
          />
        )}
      </>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        showIcon={alert.showIcon}
        showConfirm={alert.showConfirm}
      />

      {/* Confirmation Alert */}
      <ConfirmAlert
        isOpen={confirm.isOpen}
        onClose={hideConfirm}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        type={confirm.type}
      />
    </div>
  );
};

export default AdminDashboard;