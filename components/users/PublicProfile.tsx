"use client"
import { useEffect, useState } from 'react';
import MusoProfile from './MusoProfile';
import AgentProfile from './AgentProfile';
import { getPublicProfileByUsername } from '@supabase/auth';
import { UserProfile } from 'firebase/auth';

const PublicProfile = ({ slug }: { slug: string }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const user = await getPublicProfileByUsername(slug);
      setProfile(user);
      setLoading(false);
    }
    loadProfile();
  }, [slug]);

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

  

if (profile.role === 'musician') {
  return <MusoProfile profile={profile} />;
} else if (profile.role === 'agent') {
  return <AgentProfile profile={profile} />;
}
};

export default PublicProfile;