// hooks/useAuth.tsx
'use client';

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { signInWithGoogle, signOut } from '@/lib/auth';
import { User } from 'firebase/auth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<any>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const login = async (): Promise<any> => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      return await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user: auth.currentUser,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    login,
    logout
  };
};