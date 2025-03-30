// contexts/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/services/userService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create/update user profile in Firestore
        try {
          await createUserProfile(user);
        } catch (error) {
          console.error('Error creating/updating user profile:', error);
        }
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};