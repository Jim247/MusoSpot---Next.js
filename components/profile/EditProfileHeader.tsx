import React, { useRef } from 'react';
import type { UserDashboard } from '../../constants/users';

interface EditProfileHeaderProps {
  profile: UserDashboard;
  isUploading: boolean;
  userName: string;
  photoMessage: string;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EditProfileHeader: React.FC<EditProfileHeaderProps> = ({
  profile,
  isUploading,
  photoMessage,
  handleImageUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg p-6 mb-8">
     {profile.role == 'agent' && (
        <div className="mb-6">
          <h3 className="text-gray-700 font-semibold mb-2">Welcome, {profile.firstName}!</h3>
        </div>
      )}
      <div className="text-center">
        <div className="relative inline-block cursor-pointer group">
          <label className="cursor-pointer">
            <img
              src={profile.avatar ? profile.avatar : '/images/User-avatar.svg'}
              alt="Profile"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-md border mx-auto"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm">{profile.avatar ? 'Change Photo' : 'Add a Photo'}</span>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
              disabled={isUploading}
              ref={fileInputRef}
            />
          </label>
        </div>
        {isUploading && <span className="mt-2 text-sm text-gray-500">Uploading...</span>}
        {photoMessage && (
          <p className={`mt-2 text-sm ${photoMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {photoMessage}
          </p>
        )}
      </div>

      <div className="mt-4 text-center">
        {profile?.slug && (
          <a href={`/users/${profile.slug}`} className="text-highlight hover:text-secondary text-sm">
            See My Profile
          </a>
        )}
      </div>
    </div>
  );
};
