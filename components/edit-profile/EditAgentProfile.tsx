import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUserProfile } from '@components/UserProfileContext';
import { EditProfileHeader } from '@components/profile/EditProfileHeader';
import { SearchRadiusControl } from '@components/SearchRadiusControl';
import type { Muso } from '@constants/users';
import BioSectionEditable from './edit-profile-components/EditBioSection';
import ReviewSection from '@components/ReviewSection';
import EditPromoVideo from './edit-profile-components/EditPromoVideo'
import { supabase } from '../../supabaseClient'; // Adjust path as needed
import type { Review } from '@constants/users';
import { useAuth } from '@supabase/auth';
import { getLatLngFromGeoPoint } from 'utils/getLatLngFromGeoPoint';
import { updateUserAttributes } from 'utils/updateUserAttributes';

export default function MusoEditProfile() {
  const { profile, loading, refresh } = useUserProfile();
  const { user: authUser } = useAuth() as { user: Muso | null };
  const [message, setMessage] = useState('');
  const [bioMessage, setBioMessage] = useState('');
  const [isEditingRadius, setIsEditingRadius] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const form = useForm<{ bio?: string }>({
    defaultValues: { bio: profile?.bio || '' },
  });

  const onBioSubmit = async (data: { bio?: string }) => {
    if (!authUser?.id) return;
    try {
      await updateUserAttributes(authUser.id, { bio: data.bio });
      await refresh();
      setBioMessage('Bio updated successfully');
      setTimeout(() => setBioMessage(''), 3000);
    } catch (err) {
      setBioMessage('Failed to update bio');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!profile?.id) return;
    setReviewLoading(true);
    supabase
      .from('reviews')
      .select('*')
      .eq('reviewed_user_id', profile.id)
      .order('timestamp', { ascending: false }) // changed from 'created_at' to 'timestamp'
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

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="bg-contrast">
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <span>{message}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6">
        <EditProfileHeader
          profile={profile}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BioSectionEditable
              profile={profile}
              bioMessage={bioMessage}
              setBioMessage={setBioMessage}
              form={form}
              onBioSubmit={onBioSubmit}
            />
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2"></h2>
              {reviewError ? (
                <div className="text-red-500 text-sm mb-2">{reviewError}</div>
              ) : !reviews ? (
                <div className="text-gray-500 text-sm mb-2">No reviews found.</div>
              ) : (
                <ReviewSection
                  profileid={profile.id}
                  currentUser={authUser}
                  reviews={reviews}
                />
              )}
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
                    {(() => {
                      return null;
                    })()}
                    {getLatLngFromGeoPoint(profile.geopoint) ? (
                      <SearchRadiusControl
                        initialRadius={profile.search_radius || 100}
                        center={getLatLngFromGeoPoint(profile.geopoint)}
                        onSave={async (radius) => {
                          await updateUserAttributes(authUser!.id, { search_radius: radius });
                          await refresh();
                        }}
                        isEditing={isEditingRadius}
                        onEditToggle={setIsEditingRadius}
                        key={profile.search_radius} // Force remount when radius changes
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
              <EditPromoVideo
                videoUrl={profile.video || ''}
                isEditing={isEditingVideo}
                setIsEditing={setIsEditingVideo}
                onSave={async (videoUrl) => {
                  await updateUserAttributes(authUser!.id, { video: videoUrl });
                  await refresh();
                  setIsEditingVideo(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}