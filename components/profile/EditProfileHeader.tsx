import React from 'react';
import type { UserDashboard } from '../../constants/users';
import { ImageUploader } from '../ImageUploader';

interface EditProfileHeaderProps {
  profile: UserDashboard;
}

export const EditProfileHeader: React.FC<EditProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      {profile.role == 'agent' && (
        <div className="mb-6">
          <h3 className="text-gray-700 font-semibold mb-2">Welcome, {profile.first_name}!</h3>
        </div>
      )}
      <div className="text-center">
        <ImageUploader
          userId={profile.id}
          initialUrl={profile.avatar || '/default-avatar.svg'}
          onImageChange={() => {}}
          size={256}
        />
      </div>

      <div className="mt-4 text-center">
        {profile?.username && (
          <a
            href={`users/${profile.username}`}
            className="text-highlight hover:text-secondary text-sm"
          >
            See My Profile
          </a>
        )}
      </div>
    </div>
  );
};
