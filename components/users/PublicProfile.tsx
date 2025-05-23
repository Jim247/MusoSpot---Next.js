"use client"
import { useEffect, useState } from 'react';
import PublicMusoProfile from './PublicMusoProfile';
import PublicAgentProfile from './PublicAgentProfile';
import { getPublicProfileByUsername } from '@supabase/auth';
import { PublicProfileProvider } from '@components/PublicProfileContext';

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
  // Add other fields as needed
}

const PublicProfile = ({ username }: { username: string }) => {
  const [profile, setProfile] = useState<DatabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      console.log('Loading profile for username:', username);
      setLoading(true);
      try {
        const user = await getPublicProfileByUsername(username);
        console.log('Profile loaded:', user);
        setProfile(user);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      }
      setLoading(false);
    }
    loadProfile();
  }, [username]);

    // Loading Screen for Dashboard
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }
  if (!profile) return <div>Profile not found</div>;

  return (
    <PublicProfileProvider profile={profile} loading={loading}>
      {profile.role === 'musician' && <PublicMusoProfile />}
      {profile.role === 'agent' && <PublicAgentProfile />}
    </PublicProfileProvider>
  );
};

export default PublicProfile;