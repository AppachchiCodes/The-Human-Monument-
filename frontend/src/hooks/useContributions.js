import { useState, useEffect, useCallback } from 'react';
import { contributionAPI } from '../lib/api';

export function useContributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, byType: {} });

  const fetchContributions = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contributionAPI.getAll(page, 500);
      setContributions(response.data);
      
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contributions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await contributionAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const findContribution = useCallback(async (shortId) => {
    try {
      setError(null);
      const response = await contributionAPI.getByShortId(shortId);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const addContribution = useCallback((newContribution) => {
    setContributions((prev) => [...prev, newContribution]);
    setStats((prev) => ({
      total: prev.total + 1,
      byType: {
        ...prev.byType,
        [newContribution.type.toLowerCase()]: 
          (prev.byType[newContribution.type.toLowerCase()] || 0) + 1,
      },
    }));
  }, []);

  useEffect(() => {
    fetchContributions();
    fetchStats();
  }, [fetchContributions, fetchStats]);

  return {
    contributions,
    loading,
    error,
    stats,
    fetchContributions,
    findContribution,
    addContribution,
    refetch: fetchContributions,
  };
}