"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth, getCurrentUser } from '../supabase/auth'
import type { UserDashboard } from '../constants/users'
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfileContextType {
  profile: UserDashboard | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth() as { user: SupabaseUser | null };
  const [profile, setProfile] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!authUser?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userProfile = await getCurrentUser();
      setProfile(userProfile);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => { 
    fetchProfile();
  }, [authUser?.id, fetchProfile]);

  return (
    <UserProfileContext.Provider value={{ profile, loading, refresh: fetchProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
