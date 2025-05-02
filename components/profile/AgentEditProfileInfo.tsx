import React from 'react';
import type { UserDashboard } from '../../constants/users';
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormReset } from 'react-hook-form';

interface FormData {
  bio?: string;
}

<<<<<<< HEAD
<<<<<<<< HEAD:src/components/Profile/AgentEditProfileInfo.tsx
interface AgentProfileInfoProps {
========
interface MusoProfileInfoProps {
>>>>>>>> 1d1c905 (working):src/components/Profile/EditMusoProfileInfo.tsx
=======
interface AgentProfileInfoProps {
>>>>>>> 1d1c905 (working)
  profile: UserDashboard;
  isEditingBio: boolean;
  bioMessage: string;
  setIsEditingBio: (value: boolean) => void;
  setBioMessage: (message: string) => void;
<<<<<<< HEAD
  form: UseFormReturn<FormData>;
  isEditingEquipment: boolean;
  setIsEditingEquipment: (value: boolean) => void;
  onUpdateEquipment: (equipment: { transport: boolean; paSystem: boolean; lighting: boolean }) => void;
  onBioSubmit: (data: FormData) => void | Promise<void>;
}

<<<<<<<< HEAD:src/components/Profile/AgentEditProfileInfo.tsx
export const AgentProfileInfo: React.FC<AgentProfileInfoProps> = ({
========
/**
 * EditMusoProfileInfo component allows users to view and edit their musician profile information.
 *
 * This component displays the user's name, postcode, instruments, equipment (transport, PA system, lighting),
 * and bio. It provides editing capabilities for the equipment and bio sections, with form validation and
 * controlled state management.
 *
 * @component
 * @param {MusoProfileInfoProps} props - The props for the component.
 * @param {Profile} props.profile - The user's profile data.
 * @param {boolean} props.isEditingBio - Whether the bio section is in editing mode.
 * @param {string} props.bioMessage - Message to display for the bio section (e.g., validation errors).
 * @param {(isEditing: boolean) => void} props.setIsEditingBio - Function to toggle bio editing mode.
 * @param {(message: string) => void} props.setBioMessage - Function to set the bio message.
 * @param {UseFormReturn} props.form - React Hook Form instance for managing the bio form.
 * @param {boolean} props.isEditingEquipment - Whether the equipment section is in editing mode.
 * @param {(isEditing: boolean) => void} props.setIsEditingEquipment - Function to toggle equipment editing mode.
 * @param {(equipment: { transport: boolean; paSystem: boolean; lighting: boolean }) => void} props.onUpdateEquipment - Callback when equipment is updated.
 * @param {(data: any) => void} props.onBioSubmit - Callback when the bio form is submitted.
 *
 * @returns {JSX.Element} The rendered EditMusoProfileInfo component.
 */
const EditMusoProfileInfo: React.FC<MusoProfileInfoProps> = ({
>>>>>>>> 1d1c905 (working):src/components/Profile/EditMusoProfileInfo.tsx
=======
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  handleFormSubmit: ReturnType<UseFormHandleSubmit<FormData>>;
  reset: UseFormReset<FormData>;
}

export const AgentProfileInfo: React.FC<AgentProfileInfoProps> = ({
>>>>>>> 1d1c905 (working)
  profile,
  isEditingBio,
  bioMessage,
  setIsEditingBio,
  setBioMessage,
<<<<<<< HEAD
  form,
  isEditingEquipment,
  setIsEditingEquipment,
  onUpdateEquipment,
  onBioSubmit,
}) => {


  // Local state for equipment
  const [equipment, setEquipment] = React.useState({
    transport: !!profile.transport,
    paSystem: !!profile.paSystem,
    lighting: !!profile.lighting,
  });

  React.useEffect(() => {
    if (isEditingEquipment) {
      setEquipment({
        transport: !!profile.transport,
        paSystem: !!profile.paSystem,
        lighting: !!profile.lighting,
      });
    }
  }, [isEditingEquipment, profile]);

  const handleEquipmentSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEquipment(equipment);
    setIsEditingEquipment(false);
  };

  const handleCancel = () => {
    form.reset({
      bio: profile.bio || '',
    });
    setIsEditingBio(false);
    setIsEditingEquipment(false);
    setBioMessage('');
  };
=======
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

>>>>>>> 1d1c905 (working)
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-gray-700 font-semibold mb-2">Name</h3>
        <p className="text-gray-600">
          {profile.firstName} {profile.lastName}
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
<<<<<<< HEAD

      {/* Equipment Section */}
      <div className="mb-6 flex flex-col relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-700 font-semibold">Equipment</h3>
        </div>
        {isEditingEquipment ? (
          <form onSubmit={handleEquipmentSave} className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <span>Own Transport?</span>
              <select
                value={equipment.transport ? 'true' : 'false'}
                onChange={e => setEquipment(eq => ({ ...eq, transport: e.target.value === 'true' }))}
                className="border rounded px-2 py-1"
                autoFocus
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own PA System?</span>
              <select
                value={equipment.paSystem ? 'true' : 'false'}
                onChange={e => setEquipment(eq => ({ ...eq, paSystem: e.target.value === 'true' }))}
                className="border rounded px-2 py-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Own Lighting?</span>
              <select
                value={equipment.lighting ? 'true' : 'false'}
                onChange={e => setEquipment(eq => ({ ...eq, lighting: e.target.value === 'true' }))}
                className="border rounded px-2 py-1"
              >
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
                Own PA System: <span className="font-semibold">{profile.paSystem ? 'Yes' : 'No'}</span>
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

=======
>>>>>>> 1d1c905 (working)
      {/* Bio Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="border-b border-gray-200 py-4 group">
          <div>
            <h3 className="text-gray-700 font-semibold w-1/3">About Me</h3>
          </div>
          <div className="mt-2">
            {isEditingBio ? (
<<<<<<< HEAD
              <form onSubmit={form.handleSubmit(onBioSubmit)} className="space-y-2">
                <div className="space-y-2">
                  <textarea
                    {...form.register('bio', {
=======
              <form onSubmit={handleFormSubmit} className="space-y-2">
                <div className="space-y-2">
                  <textarea
                    {...register('bio', {
>>>>>>> 1d1c905 (working)
                      required: 'Bio is required',
                      minLength: {
                        value: 20,
                        message: 'Bio must be at least 20 words',
                      },
                    })}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                  />
<<<<<<< HEAD
                  {form.formState.errors.bio && <p className="text-red-500 text-sm">{form.formState.errors.bio.message}</p>}
=======
                  {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
>>>>>>> 1d1c905 (working)
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
                      setIsEditingBio(true);
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
    </div>
  );
};
<<<<<<< HEAD

export { EditMusoProfileInfo };
=======
>>>>>>> 1d1c905 (working)
