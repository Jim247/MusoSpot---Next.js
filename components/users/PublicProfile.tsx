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

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  

  if (profile.role === 'musician') {
    return <MusoProfile />;
  } else if (profile.role === 'agent') {
    return <AgentProfile />;
  } else {
    return <div>Unknown role.</div>;
  }
};

export default PublicProfile;