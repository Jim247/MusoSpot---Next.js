import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { UserDashboard } from '@constants/users';

interface BioSectionEditableProps {
  profile: UserDashboard;
  bioMessage: string;
  setBioMessage: (msg: string) => void;
  form: UseFormReturn<{ bio?: string }>;
  onBioSubmit: (data: { bio?: string }) => void | Promise<void>;
}

const BioSectionEditable: React.FC<BioSectionEditableProps> = ({ profile, bioMessage, setBioMessage, form, onBioSubmit }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    form.reset({ bio: profile.bio || '' });
  }, [form, profile.bio]);

  return (
    <div className="bg-white rounded-lg p-6 relative">
      {!isEditing && (
        <button className="btn-primary absolute bottom-3 right-3" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      )}
      <div className="py-4 group">
        <div>
          <h3 className="text-gray-700 font-semibold w-1/3">About Me</h3>
        </div>
        <div className="mt-2">
          {isEditing ? (
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await onBioSubmit(data);
                setIsEditing(false);
              })}
            >
              <textarea
                {...form.register('bio')}
                className="w-full border rounded px-3 py-2"
                rows={4}
              />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setIsEditing(false); setBioMessage(''); form.reset({ bio: profile.bio || '' }); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-m text-gray-500">{profile.bio || 'Add a short bio to tell people about yourself'}</p>
            </div>
          )}
          {bioMessage && <p className="text-red-500 text-sm mt-1">{bioMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default BioSectionEditable;
