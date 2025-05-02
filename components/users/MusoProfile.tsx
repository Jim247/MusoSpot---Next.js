import { useUserProfile } from '~/components/UserProfileContext';
import React from 'react';
import MiniMap from '~/components/MiniMap';
import ExperienceBadge from '~/components/Profile/ExperienceBadge';
import { getExperienceLevel, getTransport } from '~/utils/badgeRules';
import TransportBadge from '~/components/Profile/TransportBadge';
import PASystemBadge from '~/components/Profile/PaSystemBadge';
import LightingBadge from '~/components/Profile/LightingBadge';
import ReviewSection from '~/components/ReviewSection';

export default function MusoProfile() {
  const { profile, loading } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Updated header: Pic on top, name then instruments */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={profile.avatar || '/images/User-avatar.svg'}
          alt={`${profile.firstName}'s profile`}
          className="w-48 h-48 rounded-md object-cover"
        />
        <h1 className="text-2xl font-bold">
          {profile.firstName} {profile.lastName}
        </h1>
        {(profile.ward || profile.region || profile.country) && (
          <h2 className="text-lg text-gray-600">
            {profile.ward ? `${profile.ward}, ` : ''}
            {profile.region || ''}
            {profile.country ? ` ${profile.country}` : ''}
          </h2>
        )}
        {profile.instruments && profile.instruments.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {profile.instruments.map((instrument, idx) => (
              <span key={idx} className="bg-highlight text-white px-3 py-1 rounded-md text-lg">
                {instrument}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Badge Section */}
      <div className="pt-4">
        {(!!(profile.yearsExperience && getExperienceLevel(profile.yearsExperience ?? 0)) ||
          profile.transport ||
          profile.paSystem ||
          profile.lighting) && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl text-yellow-600 flex items-center">
                <svg
                  className="inline w-5 h-5 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                    strokeWidth="0"
                  />
                </svg>
              </span>
              <h2 className="text-xl font-semibold text-black tracking-wide">MusoSpot Achievements</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6 items-center p-4">
              {profile.yearsExperience && getExperienceLevel(profile.yearsExperience ?? 0) && (
                <div
                  className="flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl rounded-md px-2 py-2"
                  title="Experience Level"
                >
                  <ExperienceBadge yearsExperience={profile.yearsExperience} size="xxl" />
                </div>
              )}
              {profile.transport && (
                <div
                  className="flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl rounded-md bg-gray-50 px-2 py-2"
                  title="Transport Available"
                >
                  <TransportBadge boolean={getTransport(profile.transport)} size="xxl" />
                </div>
              )}
              {profile.paSystem && (
                <div
                  className="flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl rounded-md bg-gray-50 px-2 py-2"
                  title="PA System Owner"
                >
                  <PASystemBadge boolean={profile.paSystem} size="xxl" />
                </div>
              )}
              {profile.lighting && (
                <div
                  className="flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl rounded-md bg-gray-50 px-2 py-2"
                  title="Lighting Owner"
                >
                  <LightingBadge boolean={profile.lighting} size="xxl" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Promo Video Section - conditional */}
      {profile.video && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Promo Video</h2>
          <div className="w-full relative pt-[56.25%]">
            <iframe
              src={profile.video}
              title="User Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
      {/* Bio Section */}
      {profile.bio ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600">{profile.bio}</p>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600">No bio provided yet</p>
        </div>
      )}
      {/* Location Section */}
      {profile.role !== 'agent' && profile.geoPoint && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <MiniMap
            id={`map-${profile.slug}`}
            lat={profile.geoPoint.lat}
            lng={profile.geoPoint.lng}
            radius={profile.searchRadius || 100}
            className="h-64 w-full rounded-lg"
          />
          <p className="mt-2 text-gray-600">
            This user is available within {profile.searchRadius || 100} miles of {profile.postcode}
          </p>
        </div>
      )}
      {/* User Reviews Section - Replaced with ReviewSection component */}
      <ReviewSection profileUid={profile.uid} currentUser={null} />
    </div>
  );
}
