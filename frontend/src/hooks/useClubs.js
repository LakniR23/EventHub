import { useState, useEffect, useCallback, useRef } from 'react';
import * as clubServices from '../services/clubServices';
import { useCustomAlert } from './useCustomAlert';

export const useClubs = (initialFilters = {}) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const { showError, showSuccess } = useCustomAlert();
  const hasFetchedRef = useRef(false);

  const fetchClubs = useCallback(async (customFilters) => {
    try {
      setLoading(true);
      setError(null);
      const applied = customFilters !== undefined ? customFilters : filters;
      const data = await clubServices.getClubs(applied);
      setClubs(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      const msg = 'Failed to fetch clubs. Ensure backend is running.';
      setError(msg);
      console.error('Error fetching clubs:', err);
      showError && showError('Error', msg);
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  const getClub = useCallback(async (id) => {
    try {
      const club = await clubServices.getClub(id);
      return club;
    } catch (err) {
      console.error(`Error fetching club ${id}:`, err);
      showError && showError('Error', 'Failed to fetch club details');
      throw err;
    }
  }, [showError]);

  const createClub = useCallback(async (clubData) => {
    try {
      const created = await clubServices.createClub(clubData);
      setClubs(prev => [created, ...prev]);
      showSuccess && showSuccess('Success!', 'Club created successfully');
      return created;
    } catch (err) {
      console.error('Error creating club:', err);
      showError && showError('Error', 'Failed to create club');
      throw err;
    }
  }, [showError, showSuccess]);

  const updateClub = useCallback(async (id, clubData) => {
    try {
      const updated = await clubServices.updateClub(id, clubData);
      setClubs(prev => prev.map(c => c.id === id ? updated : c));
      showSuccess && showSuccess('Success!', 'Club updated successfully');
      return updated;
    } catch (err) {
      console.error(`Error updating club ${id}:`, err);
      showError && showError('Error', 'Failed to update club');
      throw err;
    }
  }, [showError, showSuccess]);

  const deleteClub = useCallback(async (id) => {
    try {
      await clubServices.deleteClub(id);
      setClubs(prev => prev.filter(c => c.id !== id));
      showSuccess && showSuccess('Success!', 'Club deleted successfully');
    } catch (err) {
      console.error(`Error deleting club ${id}:`, err);
      showError && showError('Error', 'Failed to delete club');
      throw err;
    }
  }, [showError, showSuccess]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchClubs(initialFilters);
      hasFetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) {
      fetchClubs(filters);
    }
  }, [filters]);

  return {
    clubs,
    loading,
    error,
    filters,
    fetchClubs,
    getClub,
    createClub,
    updateClub,
    deleteClub,
    updateFilters,
    resetFilters,
    refetch: () => fetchClubs(filters)
  };
};

export default useClubs;
