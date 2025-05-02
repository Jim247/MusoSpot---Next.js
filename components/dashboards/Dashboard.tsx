import React from 'react';
import MusoDashboard from '~/components/MusoDashboard';
import AgentDashboard from '~/components/AgentDashboard';
import { useUserProfile } from './UserProfileContext';

const Dashboard = () => {
  const { profile, loading } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  if (profile.role === 'musician') {
    return <MusoDashboard profile={profile} />;
  } else if (profile.role === 'agent') {
    return <AgentDashboard profile={profile} />;
  } else {
    return <div>Unknown role.</div>;
  }
};

export default Dashboard;