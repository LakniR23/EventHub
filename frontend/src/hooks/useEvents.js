import { useState, useEffect, useCallback, useRef } from 'react';
import { eventServices } from '../services/eventServices';
import { useCustomAlert } from './useCustomAlert';

export const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showError, showSuccess } = useCustomAlert();
  
  // Use ref to track if initial fetch has happened
  const hasFetchedRef = useRef(false);

  // Fetch events with current filters
  const fetchEvents = useCallback(async (customFilters) => {
    try {
      setLoading(true);
      setError(null);
      const appliedFilters = customFilters !== undefined ? customFilters : filters;
      const eventsData = await eventServices.getAll(appliedFilters);
      setEvents(eventsData || []);
    } catch (err) {
      const errorMessage = 'Failed to fetch events. Please ensure the backend server is running.';
      setError(errorMessage);
      console.error('Error fetching events:', err);
      showError && showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  // Get single event
  const getEvent = useCallback(async (id) => {
    try {
      const event = await eventServices.getById(id);
      return event;
    } catch (err) {
      console.error(`Error fetching event ${id}:`, err);
      showError && showError('Error', `Failed to fetch event details`);
      throw err;
    }
  }, [showError]);

  // Create new event
  const createEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await eventServices.create(eventData);
      setEvents(prevEvents => [newEvent, ...prevEvents]);
      showSuccess && showSuccess('Success!', 'Event created successfully!');
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      showError && showError('Error', 'Failed to create event. Please try again.');
      throw err;
    }
  }, [showError, showSuccess]);

  // Update existing event
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      const updatedEvent = await eventServices.update(id, eventData);
      setEvents(prevEvents => 
        prevEvents.map(event => event.id === id ? updatedEvent : event)
      );
      showSuccess && showSuccess('Success!', 'Event updated successfully!');
      return updatedEvent;
    } catch (err) {
      console.error(`Error updating event ${id}:`, err);
      showError && showError('Error', 'Failed to update event. Please try again.');
      throw err;
    }
  }, [showError, showSuccess]);

  // Delete event
  const deleteEvent = useCallback(async (id) => {
    try {
      await eventServices.delete(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      showSuccess && showSuccess('Success!', 'Event deleted successfully!');
    } catch (err) {
      console.error(`Error deleting event ${id}:`, err);
      showError && showError('Error', 'Failed to delete event. Please try again.');
      throw err;
    }
  }, [showError, showSuccess]);

  // Update filters and refetch
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    // Don't call fetchEvents here - let the effect handle it
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Initial fetch - only runs once on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchEvents(initialFilters);
      hasFetchedRef.current = true;
    }
  }, []); // Empty dependency array - only run on mount

  // Fetch when filters change (but not on initial mount)
  useEffect(() => {
    if (hasFetchedRef.current) {
      fetchEvents(filters);
    }
  }, [filters]); // Only depend on filters

  return {
    events,
    loading,
    error,
    filters,
    fetchEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateFilters,
    resetFilters,
    refetch: () => fetchEvents(filters)
  };
};

export const useEventStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await eventServices.getStats();
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch event statistics');
      console.error('Error fetching event stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useFeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await eventServices.getFeatured();
      setFeaturedEvents(events || []);
    } catch (err) {
      setError('Failed to fetch featured events');
      console.error('Error fetching featured events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedEvents();
  }, [fetchFeaturedEvents]);

  return { featuredEvents, loading, error, refetch: fetchFeaturedEvents };
};

export default useEvents;