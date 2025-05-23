import React from 'react';
import type { UserDashboard } from '../../constants/users';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormReset,
} from 'react-hook-form';
import { BioSection } from './BioSection';

interface FormData {
  bio?: string;
}

interface AgentProfileInfoProps {
  profile: UserDashboard;
  isEditingBio: boolean;
  bioMessage: string;
  setIsEditingBio: (value: boolean) => void;
  setBioMessage: (message: string) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  handleFormSubmit: ReturnType<UseFormHandleSubmit<FormData>>;
  reset: UseFormReset<FormData>;
}

export const AgentProfileInfo: React.FC<AgentProfileInfoProps> = ({
  profile,
  isEditingBio,
  bioMessage,
  setIsEditingBio,
  setBioMessage,
  register,
  errors,
  handleFormSubmit,
  reset,
}) => {
  const handleCancel = () => {
    reset({
      bio: profile.bio || '',
    });
    setIsEditingBio(false);
    setBioMessage('');
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-gray-700 font-semibold mb-2">Name</h3>
        <p className="text-gray-600">
          {profile.first_name} {profile.last_name}
        </p>
      </div>
      <div className="mb-6">
        <h3 className="text-gray-700 font-semibold mb-2">Postcode</h3>
        <p className="text-gray-600">{profile.postcode || 'Not specified'}</p>
      </div>
      {profile.instruments && profile.instruments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-700 font-semibold mb-2">Instruments</h3>
          <div className="flex flex-wrap gap-2">
            {profile.instruments.map((instrument, idx) => (
              <span key={idx} className="bg-highlight text-white px-3 py-1 rounded-md text-sm">
                {instrument}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Bio Section */}
      <BioSection
        profile={profile}
        isEditing={isEditingBio}
        setIsEditing={setIsEditingBio}
        bioMessage={bioMessage}
        setBioMessage={setBioMessage}
        register={register}
        errors={errors}
        handleFormSubmit={handleFormSubmit}
        reset={reset}
      />
    </div>
  );
};
