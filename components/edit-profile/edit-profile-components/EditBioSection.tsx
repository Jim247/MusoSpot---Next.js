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

const MIN_WORDS = 30;
const MAX_WORDS = 150;

function stripHtmlTags(input: string) {
  return input.replace(/<[^>]*>?/gm, '');
}

const BioSectionEditable: React.FC<BioSectionEditableProps> = ({ profile, bioMessage, setBioMessage, form, onBioSubmit }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    form.reset({ bio: profile.bio || '' });
  }, [form, profile.bio]);

  const handleBioSubmit = async (data: { bio?: string }) => {
    const rawBio = data.bio || '';
    const cleanBio = stripHtmlTags(rawBio).trim();
    const wordCount = cleanBio.split(/\s+/).filter(Boolean).length;
    if (wordCount < MIN_WORDS) {
      setBioMessage(`Bio must be at least ${MIN_WORDS} words.`);
      return;
    }
    if (wordCount > MAX_WORDS) {
      setBioMessage(`Bio must be no more than ${MAX_WORDS} words.`);
      return;
    }
    setBioMessage('');
    await onBioSubmit({ bio: cleanBio });
    setIsEditing(false);
  };

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
              onSubmit={form.handleSubmit(handleBioSubmit)}
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
