"use client";
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth, getUserProfile } from '../lib/firebase'
import type { Muso, Agent, UserDashboard } from '../constants/users'

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
  const { user: authUser } = useAuth() as { user: Muso | Agent | null };
  const [profile, setProfile] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!authUser?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const userProfile = await getUserProfile(authUser.uid);
    setProfile(userProfile);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [authUser?.uid]);

  return (
    <UserProfileContext.Provider value={{ profile, loading, refresh: fetchProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
