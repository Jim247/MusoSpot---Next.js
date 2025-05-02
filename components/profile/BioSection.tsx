import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormReset } from 'react-hook-form';
import type { UserDashboard } from '../../constants/users';

interface FormData {
  bio?: string;
}

interface BioSectionProps {
  profile: UserDashboard;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  bioMessage: string;
  setBioMessage: (msg: string) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  handleFormSubmit: ReturnType<UseFormHandleSubmit<FormData>>;
  reset: UseFormReset<FormData>;
}

export const BioSection: React.FC<BioSectionProps> = ({
  profile,
  isEditing,
  setIsEditing,
  bioMessage,
  setBioMessage,
  register,
  errors,
  handleFormSubmit,
  reset,
}) => {
  const handleCancel = () => {
    reset({ bio: profile.bio || '' });
    setIsEditing(false);
    setBioMessage('');
  };

  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="border-b border-gray-200 py-4 group">
        <div>
          <h3 className="text-gray-700 font-semibold w-1/3">About Me</h3>
        </div>
        <div className="mt-2">
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div className="space-y-2">
                <textarea
                  {...register('bio', {
                    required: 'Bio is required',
                    minLength: {
                      value: 20,
                      message: 'Bio must be at least 20 words',
                    },
                  })}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
                {bioMessage && <p className="text-red-500 text-sm mt-1">{bioMessage}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="btn-primary text-white text-sm rounded">
                  Save
                </button>
                <button type="button" onClick={handleCancel} className="px-3 py-1 bg-gray-300 text-sm rounded">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-m text-gray-500">{profile.bio || 'Add a bio to tell people about yourself'}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setBioMessage('');
                  }}
                  className="btn-primary"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
