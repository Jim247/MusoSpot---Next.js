"use client"
import EditMusoProfile from '@components/edit-profile/EditMusoProfile'
import EditAgentProfile from '@components/edit-profile/EditAgentProfile'
import { useUserProfile } from '@components/UserProfileContext';
import 'leaflet/dist/leaflet.css';


export const EditMyProfile = () => {
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

export default EditMyProfile;