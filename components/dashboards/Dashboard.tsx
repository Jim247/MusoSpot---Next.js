"use client"
import React from 'react';
import MusoDashboard from './MusoDashboard';
import AgentDashboard from './AgentDashboard';
import { useUserProfile } from '../UserProfileContext';

const Dashboard = () => {
  const { profile, loading } = useUserProfile();

  console.log('Dashboard state:', { profile, loading }); // Debug log

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <p className="text-lg mb-4">Please log in to view your dashboard</p>
          <a href="/login" className="text-primary hover:text-secondary">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  switch (profile.role) {
    case 'musician':
      return <MusoDashboard />;
    case 'agent':
      return <AgentDashboard profile={profile} />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Invalid user role. Please contact support.</p>
        </div>
      );
  }
};

export default Dashboard;