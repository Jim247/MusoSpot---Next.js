import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useUserProfile } from './UserProfileContext';
import { useAuth, updateUserAttributes, uploadProfileImage, fetchUserReviews } from '../lib/firebase';
import { EditProfileHeader } from './Profile/EditProfileHeader';
import { PromoVideo } from './PromoVideo';
import { SearchRadiusControl } from './SearchRadiusControl';
import { formatReviewDate } from '~/utils/formatReviewDate';
import type { Muso, Review } from '../constants/users';
import { EditMusoProfileInfo } from './Profile/EditMusoProfileInfo';


export default function MusoEditProfile() {
  const { profile, loading, refresh } = useUserProfile();
  const { user: authUser } = useAuth() as { user: Muso | null };
  const [message, setMessage] = useState('');
  const [bioMessage, setBioMessage] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingEquipment, setIsEditingEquipment] = useState(false);
  const [isEditingRadius, setIsEditingRadius] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<{ bio?: string }>({
    defaultValues: { bio: profile?.bio || '' },
  });

  const onBioSubmit = async (data: { bio?: string }) => {
    if (!authUser?.uid) return;
    try {
      await updateUserAttributes(authUser.uid, { bio: data.bio });
      await refresh();
      setBioMessage('Bio updated successfully');
      setIsEditingBio(false);
      setTimeout(() => setBioMessage(''), 3000);
    } catch (err) {
      setBioMessage('Failed to update bio');
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (!profile?.uid) return;
    setReviewLoading(true);
    fetchUserReviews(profile.uid)
      .then(setReviews)
      .catch(() => setReviewError('Error loading reviews'))
      .finally(() => setReviewLoading(false));
  }, [profile?.uid]);

  const handleEquipmentUpdate = async (equipment: { transport: boolean; paSystem: boolean; lighting: boolean }) => {
    if (!authUser?.uid) return;
    try {
      await updateUserAttributes(authUser.uid, equipment);
      await refresh();
      setMessage('Equipment updated successfully');
      setIsEditingEquipment(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update equipment');
      setIsEditingEquipment(false);
      console.error(err);
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
      await uploadProfileImage(authUser.uid, file);
      await refresh();
      setPhotoMessage('Profile image updated successfully!');
      setTimeout(() => setPhotoMessage(''), 3000);
    } catch {
      setPhotoMessage('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="bg-contrast dark=bg">
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <span>{message}</span>
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
            <EditMusoProfileInfo
              profile={profile}
              isEditingBio={isEditingBio}
              bioMessage={bioMessage}
              setIsEditingBio={setIsEditingBio}
              setBioMessage={setBioMessage}
              form={form}
              onBioSubmit={onBioSubmit}
              isEditingEquipment={isEditingEquipment}
              setIsEditingEquipment={setIsEditingEquipment}
              onUpdateEquipment={handleEquipmentUpdate}
            />
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">User Reviews</h2>
              {reviewLoading ? (
                <div>Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-500">No reviews yet.</div>
              ) : (
                <ul className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <li key={review.id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-700">Rating:</span>
                        <span className="text-yellow-500 text-lg">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      {review.comment && <div className="mt-1 text-gray-800 italic">"{review.comment}"</div>}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <span>{formatReviewDate(review.timestamp)}</span>
                        {review.reviewerName && (
                          <span>
                            · reviewed by <span className="font-semibold text-gray-700">{review.reviewerName}</span>
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {reviewError && <div className="text-red-500 mt-2">{reviewError}</div>}
            </div>
          </div>
          <div className="space-y-6">
            {profile.role !== 'agent' && (
              <div className="bg-white rounded-lg p-6">
                <div className="group">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-700 font-semibold w-1/3">Search Distance</h3>
                  </div>
                  <div>
                    {profile.geoPoint ? (
                      <SearchRadiusControl
                        initialRadius={profile.searchRadius || 100}
                        center={profile.geoPoint}
                        onSave={async (radius) => {
                          await updateUserAttributes(authUser!.uid, { searchRadius: radius });
                          await refresh();
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
                    onSave={async (videoUrl) => {
                      await updateUserAttributes(authUser!.uid, { video: videoUrl });
                      await refresh();
                      setIsEditingVideo(false);
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