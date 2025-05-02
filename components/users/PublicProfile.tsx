import { useUserProfile } from './UserProfileContext';
import MusoProfile from '~/pages/users/MusoProfile';
import AgentProfile from 'AgentProfile';

const PublicProfile = () => {
  const { profile, loading } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  if (profile.role === 'musician') {
    return <MusoProfile/>;
  } else if (profile.role === 'agent') {
    return <AgentProfile />;
  } else {
    return <div>Unknown role.</div>;
  }
};

export default PublicProfile;