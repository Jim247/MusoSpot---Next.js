'use client';
import EditMusoProfile from '@components/edit-profile/EditMusoProfile';
import EditAgentProfile from '@components/edit-profile/EditAgentProfile';
import { useUserProfile } from '@components/UserProfileContext';
import 'leaflet/dist/leaflet.css';

export const EditMyProfile = () => {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }
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
