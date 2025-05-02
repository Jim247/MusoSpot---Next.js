import React, { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Review, Agent, UserDashboard } from '../constants/users';
import {
  useAuth,
  updateUserAttributes,
  uploadProfileImage,
  fetchUserReviews,
} from '../lib/firebase';
import { PromoVideo } from './PromoVideo';
import { SearchRadiusControl } from './SearchRadiusControl';
import { EditProfileHeader } from './Profile/EditProfileHeader';
import { AgentProfileInfo } from './Profile/AgentProfileInfo';
import { useUserProfile } from './UserProfileContext';
import ReviewSection from './ReviewSection';

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
    register,
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
    if (!profile?.uid) return;
    setReviewLoading(true);
    fetchUserReviews(profile.uid)
      .then(setReviews)
      .catch(() => setReviewError('Error loading reviews'))
      .finally(() => setReviewLoading(false));
  }, [profile?.uid]);

  // Use SubmitHandler for type safety
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!authUser?.uid) return;

    try {
      const updateData: Partial<UserDashboard> = {
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

      await updateUserAttributes(authUser.uid, updateData);
      setMessage('Profile updated successfully.');

      // Update the profile state reliably
      const updatedProfile = { ...profile, ...updateData } as UserDashboard;

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
    if (!file || !authUser?.uid) return;
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
      const imageUrl = await uploadProfileImage(authUser.uid, file);
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
          userName={profile.firstName}
          profile={profile}
          isUploading={isUploading}
          photoMessage={photoMessage}
          handleImageUpload={handleImageUpload}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Reviews Section */}
            <ReviewSection profileUid={profile.uid} currentUser={authUser} />
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

            {/* Promo Video Section - Needs adjustment to use RHF */}
            <div className="bg-white rounded-lg p-6">
              <div className="py-4 group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-700 font-semibold">My Promo Video</h3>
                  {!isEditingVideo && profile.video && (
                    <button onClick={() => setIsEditingVideo(true)} className="text-gray-400 hover:text-gray-600">
                      Edit
                    </button>
                  )}
                </div>
                {!profile.video && !isEditingVideo ? (
                  <div className="text-center p-6 bg-gray-100 rounded-lg">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>No video added yet</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingVideo(true)}
                      className="btn-primary px-4 py-2 mt-4 rounded-md text-white"
                    >
                      Add Video
                    </button>
                  </div>
                ) : (
                  <PromoVideo
                    initialUrl={profile.video || ''}
                    // Modify onSave to trigger the main form submission
                    onSave={async (videoUrl) => {
                      setValue('video', videoUrl, { shouldValidate: true });
                      await handleFormSubmit(onSubmit)(); // Trigger main form submit
                    }}
                    isEditing={isEditingVideo}
                    onEditToggle={setIsEditingVideo}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
