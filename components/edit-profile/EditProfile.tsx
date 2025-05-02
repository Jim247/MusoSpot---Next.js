import EditMusoProfile from './EditMusoProfile';
import EditAgentProfile from './EditAgentProfile';
import { useUserProfile } from './UserProfileContext';


const EditProfile = () => {
const { profile, loading } = useUserProfile();
  
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  if (profile.role === 'musician') {
    return <EditMusoProfile />;
  } else if (profile.role === 'agent') {
    return <EditAgentProfile />;
  } else {
    return <div>Unknown role.</div>;
  }
};

export default EditProfile;