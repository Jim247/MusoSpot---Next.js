'use client';
import React, { createContext, useContext, ReactNode } from 'react';

interface DatabaseUser {
  id: string;
  username: string;
  role: 'musician' | 'agent';
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  avatar?: string;
  agency_name?: string;
  ward?: string;
  region?: string;
  country?: string;
  geopoint?: any;
  video?: string;
  instruments?: string[];
  // Add other fields as needed
}

interface PublicProfileContextType {
  profile: DatabaseUser | null;
  loading: boolean;
}

const PublicProfileContext = createContext<PublicProfileContextType | undefined>(undefined);

export function PublicProfileProvider({ 
  children, 
  profile, 
  loading 
}: { 
  children: ReactNode;
  profile: DatabaseUser | null;
  loading: boolean;
}) {
  return (
    <PublicProfileContext.Provider value={{ profile, loading }}>
      {children}
    </PublicProfileContext.Provider>
  );
}

export function usePublicProfile(): PublicProfileContextType {
  const context = useContext(PublicProfileContext);
  if (context === undefined) {
    throw new Error('usePublicProfile must be used within a PublicProfileProvider');
  }
  return context;
}
