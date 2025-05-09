import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { Muso } from '@constants/users';

interface BioSectionEditableProps {
  profile: Muso;
  bioMessage: string;
  setBioMessage: (msg: string) => void;
  form: UseFormReturn<{ bio?: string }>;
  onBioSubmit: (data: { bio?: string }) => void | Promise<void>;
}

const BioSectionEditable: React.FC<BioSectionEditableProps> = ({ profile, bioMessage, setBioMessage, form, onBioSubmit }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    form.reset({ bio: profile.bio || '' });
  }, [profile.bio]);

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="border-b border-gray-200 py-4 group">
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
              <p className="text-m text-gray-500">{profile.bio || 'Add a bio to tell people about yourself'}</p>
              <button className="btn-primary mt-2" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </div>
          )}
          {bioMessage && <p className="text-red-500 text-sm mt-1">{bioMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default BioSectionEditable;
