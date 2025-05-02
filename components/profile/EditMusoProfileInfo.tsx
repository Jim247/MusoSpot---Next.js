import React from 'react';
import type { UserDashboard } from '../../constants/users';
import type { UseFormReturn } from 'react-hook-form';

interface FormData {
  bio?: string;
  firstName?: string;
  lastName?: string;
  postcode?: string;
  instruments?: string[];
  transport?: boolean;
  paSystem?: boolean;
  lighting?: boolean;
}

interface MusoProfileInfoProps {
  profile: UserDashboard;
  bioMessage: string;
  setBioMessage: (message: string) => void;
  form: UseFormReturn<FormData>;
  onUpdateEquipment: (equipment: { transport: boolean; paSystem: boolean; lighting: boolean }) => void;
  onBioSubmit: (data: FormData) => void | Promise<void>;
}

/**
 * EditMusoProfileInfo component allows users to view and edit their musician profile information.
 *
 * This component displays the user's name, postcode, instruments, equipment (transport, PA system, lighting),
 * and bio. It provides editing capabilities for bio and equipment sections with a global edit mode, form validation, and
 * controlled state management.
 *
 * @component
 * @param {MusoProfileInfoProps} props - The props for the component.
 * @param {Profile} props.profile - The user's profile data.
 * @param {string} props.bioMessage - Message to display for the bio section (e.g., validation errors).
 * @param {(message: string) => void} props.setBioMessage - Function to set the bio message.
 * @param {UseFormReturn} props.form - React Hook Form instance for managing the bio form.
 * @param {(equipment: { transport: boolean; paSystem: boolean; lighting: boolean }) => void} props.onUpdateEquipment - Callback when equipment is updated.
 * @param {(data: any) => void} props.onBioSubmit - Callback when the bio form is submitted.
 *
 * @returns {JSX.Element} The rendered EditMusoProfileInfo component.
 */
const EditMusoProfileInfo: React.FC<MusoProfileInfoProps> = (props) => {
  const {
    profile,
    bioMessage,
    setBioMessage,
    onBioSubmit,
    onUpdateEquipment,
  } = props;

  // Global edit mode
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [editState, setEditState] = React.useState<FormData>({
    bio: profile.bio || '',
    transport: !!profile.transport,
    paSystem: !!profile.paSystem,
    lighting: !!profile.lighting,
  });

  React.useEffect(() => {
    setEditState({
      bio: profile.bio || '',
      transport: !!profile.transport,
      paSystem: !!profile.paSystem,
      lighting: !!profile.lighting,
    });
  }, [profile]);

  const handleFieldChange = (field: keyof FormData, value: any) => {
    setEditState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Save all fields (call updateUserAttributes or similar in parent)
    await onUpdateEquipment({
      transport: !!editState.transport,
      paSystem: !!editState.paSystem,
      lighting: !!editState.lighting,
    });
    await onBioSubmit({ bio: editState.bio });
    setIsEditingProfile(false);
  };

  const handleCancel = () => {
    setEditState({
      bio: profile.bio || '',
      transport: !!profile.transport,
      paSystem: !!profile.paSystem,
      lighting: !!profile.lighting,
    });
    setIsEditingProfile(false);
    setBioMessage('');
  };
  return (
    <div className="bg-white rounded-lg p-6">
      {/* Equipment */}
      <div className="mb-6 flex flex-col relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-700 font-semibold">Equipment</h3>
        </div>
        {isEditingProfile ? (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <span>Own Transport?</span>
              <select
                value={editState.transport ? 'true' : 'false'}
                onChange={e => handleFieldChange('transport', e.target.value === 'true')}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own PA System?</span>
              <select
                value={editState.paSystem ? 'true' : 'false'}
                onChange={e => handleFieldChange('paSystem', e.target.value === 'true')}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own Lighting?</span>
              <select
                value={editState.lighting ? 'true' : 'false'}
                onChange={e => handleFieldChange('lighting', e.target.value === 'true')}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        ) : (
          <ul className="text-gray-600 space-y-2">
            <li>
              Own Transport: <span className="font-semibold">{profile.transport ? 'Yes' : 'No'}</span>
            </li>
            <li>
              Own PA System: <span className="font-semibold">{profile.paSystem ? 'Yes' : 'No'}</span>
            </li>
            <li>
              Own Lighting: <span className="font-semibold">{profile.lighting ? 'Yes' : 'No'}</span>
            </li>
          </ul>
        )}
      </div>
      {/* Bio */}
      <div className="pt-6 border-t border-gray-200">
        <div className="border-b border-gray-200 py-4 group">
          <div>
            <h3 className="text-gray-700 font-semibold w-1/3">About Me</h3>
          </div>
          <div className="mt-2">
            {isEditingProfile ? (
              <textarea
                value={editState.bio}
                onChange={e => handleFieldChange('bio', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={4}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-m text-gray-500">{profile.bio || 'Add a bio to tell people about yourself'}</p>
              </div>
            )}
            {bioMessage && <p className="text-red-500 text-sm mt-1">{bioMessage}</p>}
            <div className="flex justify-start mt-4">
              {!isEditingProfile ? (
                <button className="btn-primary" onClick={() => setIsEditingProfile(true)}>
                  Edit
                </button>
              ) : (
                <>
                  <button className="btn-primary mr-2" onClick={handleSave}>
                    Save
                  </button>
                  <button className="bg-gray-300" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EditMusoProfileInfo };
