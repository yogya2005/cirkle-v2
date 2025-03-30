// hooks/useGroups.ts
'use client';

import { useState, useEffect } from 'react';
import { getUserGroups, GroupData } from '@/services/groupService';
import { useAuth } from './useAuth';

interface UseGroupsReturn {
  groups: GroupData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGroups(): UseGroupsReturn {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchGroups = async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userGroups = await getUserGroups(user.uid);
      setGroups(userGroups);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  return { groups, loading, error, refetch: fetchGroups };
}