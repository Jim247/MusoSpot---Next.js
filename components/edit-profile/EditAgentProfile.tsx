import React, { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Review, Agent, UserDashboard } from '@constants/users';
import { SearchRadiusControl } from '@components/SearchRadiusControl';
import { EditProfileHeader } from '@components/profile/EditProfileHeader';
import { useUserProfile } from '@components/UserProfileContext';
import ReviewSection from '@components/ReviewSection';
import EditPromoVideo from './edit-profile-components/EditPromoVideo'
import { supabase } from '../../supabaseClient';

interface FormData {
  bio?: string;
  video?: string;
  searchRadius?: number;
}

export default function AgentEditProfile() {
  const { user: authUser } = useAuth() as { user: Agent | null };
  const { profile, loading } = useUserProfile();
  const [message, setMessage] = useState('');
  const [bioMessage, setBioMessage] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingRadius, setIsEditingRadius] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoMessage, setPhotoMessage] = useState('');
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');

  const {
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      bio: profile?.bio || '',
      video: profile?.video || '',
      searchRadius: profile?.searchRadius || 100,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || '',
        video: profile.video || '',
        searchRadius: profile.searchRadius || 100,
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    if (!profile?.id) return;
    setReviewLoading(true);
    // --- Replace Firebase fetchUserReviews with Supabase query ---
    supabase
      .from('reviews')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setReviewError('Error loading reviews');
          setReviews([]);
        } else {
          setReviews(data as Review[]);
          setReviewError('');
        }
      })
      .catch(() => setReviewError('Error loading reviews'))
      .finally(() => setReviewLoading(false));
  }, [profile?.id]);

  // Use SubmitHandler for type safety
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!authUser?.id) return;

    try {
      const updated_ata: Partial<UserDashboard> = {
        bio: data.bio,
        video: data.video,
        searchRadius: data.searchRadius,
      };

      // Perform bio validation here if needed, or rely on RHF validation
      const bioText = data.bio || '';
      const wordCount = bioText.trim().split(/\s+/).filter(Boolean).length;
      const MIN_WORDS = 20;
      const MAX_WORDS = 200;

      // Check RHF errors first
      if (errors.bio) {
        // RHF already handles displaying the error message
        return;
      }
      // Additional custom validation if necessary (though RHF should handle min/max length)
      if (wordCount < MIN_WORDS) {
        setBioMessage(`Bio must be at least ${MIN_WORDS} words.`); // Keep custom message state if needed
        return;
      }
      if (wordCount > MAX_WORDS) {
        setBioMessage(`Bio must not exceed ${MAX_WORDS} words.`); // Keep custom message state if needed
        return;
      }

      await updateUserAttributes(authUser.id, updated_ata);
      setMessage('Profile updated successfully.');

      // Update the profile state reliably
      const updatedProfile = { ...profile, ...updated_ata } as UserDashboard;

      setBioMessage(''); // Clear custom message
      setIsEditingBio(false);
      setIsEditingVideo(false);
      setIsEditingRadius(false); // Also ensure radius editing closes if save is triggered elsewhere

      // Reset the form with the fully updated profile data, ensuring correct types
      reset(updatedProfile);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      setMessage(`Update failed: ${errorMessage}`); // Show error in general message area
      setBioMessage(errorMessage); // Also set bio message if relevant
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser?.id) return;
    try {
      setIsUploading(true);
      setPhotoMessage('');
      if (!file.type.startsWith('image/')) {
        setPhotoMessage('Please select an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoMessage('Image must be less than 5MB.');
        return;
      }
      const imageUrl = await uploadProfileImage(authUser.id, file);
      setProfile((prev) => (prev ? { ...prev, avatar: imageUrl } : null));
      setPhotoMessage('Profile image updated successfully!');
      setTimeout(() => setPhotoMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setPhotoMessage('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="bg-contrast dark=bg">
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <p className="flex items-center">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="ml-4 text-green-700 hover:text-green-900">
              ×
            </button>
          </p>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6">
        <EditProfileHeader
          username={profile.first_name}
          profile={profile}
          isUploading={isUploading}
          photoMessage={photoMessage}
          handleImageUpload={handleImageUpload}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Reviews Section */}
            <ReviewSection profileid={profile.id} currentUser={authUser} />
          </div>

          <div className="space-y-6">
            {/* Search Radius Section - Needs adjustment to use RHF */}
            {profile.role !== 'agent' && (
              <div className="bg-white rounded-lg p-6">
                <div className="group">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-semibold w-1/3">Search Distance</h3>
                  </div>
                  <div className="">
                    {profile.geoPoint ? (
                      <SearchRadiusControl
                        // Use RHF state if possible, or keep local state for editing toggle
                        initialRadius={profile.searchRadius || 100}
                        center={profile.geoPoint}
                        // Modify onSave to trigger the main form submission
                        onSave={async (radius) => {
                          setValue('searchRadius', radius, { shouldValidate: true });
                          await handleFormSubmit(onSubmit)();
                        }}
                        isEditing={isEditingRadius}
                        onEditToggle={setIsEditingRadius}
                      />
                    ) : (
                      <div className="w-full h-64 rounded-lg mt-2 bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">Location not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Promo Video Section */}
            <EditPromoVideo
              videoUrl={profile.video || ''}
              isEditing={isEditingVideo}
              setIsEditing={setIsEditingVideo}
              onSave={async (videoUrl) => {
                setValue('video', videoUrl, { shouldValidate: true });
                await handleFormSubmit(onSubmit)();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
