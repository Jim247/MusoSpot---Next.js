import React from 'react';
import type { UserDashboard } from '../../constants/users';
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormReset } from 'react-hook-form';
import { BioSection } from './BioSection';

interface FormData {
  bio?: string;
  transport?: boolean;
  pa_system?: boolean;
  lighting?: boolean;
}

interface MusoProfileInfoProps {
  profile: UserDashboard;
  isEditingBio: boolean;
  bioMessage: string;
  setIsEditingBio: (value: boolean) => void;
  setBioMessage: (message: string) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  handleFormSubmit: ReturnType<UseFormHandleSubmit<FormData>>;
  reset: UseFormReset<FormData>;
  isEditingEquipment: boolean;
  setIsEditingEquipment: (value: boolean) => void;
}

export const MusoProfileInfo: React.FC<MusoProfileInfoProps> = ({
  profile,
  isEditingBio,
  bioMessage,
  setIsEditingBio,
  setBioMessage,
  register,
  errors,
  handleFormSubmit,
  reset,
  isEditingEquipment,
  setIsEditingEquipment,
}) => {
  const handleCancel = () => {
    reset({
      bio: profile.bio || '',
      transport: profile.transport,
      pa_system: profile.pa_system,
      lighting: profile.lighting,
    });
    setIsEditingBio(false);
    setIsEditingEquipment(false);
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

      {/* Equipment Section */}
      <div className="mb-6 flex flex-col relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-700 font-semibold">Equipment</h3>
        </div>
        {isEditingEquipment ? (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <span>Own Transport?</span>
              <select {...register('transport', { setValueAs: v => v === 'true' })} className="border rounded px-2 py-1" autoFocus>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own PA System?</span>
              <select {...register('pa_system', { setValueAs: v => v === 'true' })} className="border rounded px-2 py-1">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own Lighting?</span>
              <select {...register('lighting', { setValueAs: v => v === 'true' })} className="border rounded px-2 py-1">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn-primary text-white text-xs px-2 py-1 rounded">
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-xs px-2 py-1 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <ul className="text-gray-600 space-y-2">
              <li>
                Own Transport: <span className="font-semibold">{profile.transport ? 'Yes' : 'No'}</span>
              </li>
              <li>
                Own PA System: <span className="font-semibold">{profile.pa_system ? 'Yes' : 'No'}</span>
              </li>
              <li>
                Own Lighting: <span className="font-semibold">{profile.lighting ? 'Yes' : 'No'}</span>
              </li>
            </ul>
            <button
              className="btn-primary"
              style={{ maxWidth: '200px', marginLeft: 'auto', marginRight: '0' }}
              onClick={() => setIsEditingEquipment(true)}
              type="button"
            >
              Edit
            </button>
          </>
        )}
      </div>

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
