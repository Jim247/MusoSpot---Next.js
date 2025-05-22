'use client';
import React from 'react';
import { useUserProfile } from '@components/UserProfileContext';
import { getExperienceLevel } from '@utils/BadgeRules';
import ReviewSection from '@components/ReviewSection';
import { ExperienceBadge } from '@components/Profile/badges/ExperienceBadge';

export default function AgentProfile() {
  const { profile, loading } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Updated header: Pic on top, name then instruments */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={profile.avatar || '/default-avatar.svg'}
          alt={`${profile.first_name}'s profile`}
          className="w-48 h-48 rounded-md object-cover"
        />
        <h1 className="text-2xl font-bold">
          {profile.agency_name}
        </h1>
        <h2 className="text-lg text-gray-600">Agency Account</h2>
        {(profile.ward || profile.region || profile.country) && (
          <h2 className="text-lg text-gray-600">
            {profile.ward ? `${profile.ward}, ` : ''}
            {profile.region || ''}
            {profile.country ? ` ${profile.country}` : ''}
          </h2>
        )}
      </div>
      {/* Badge Section - Only show experience for agents */}
      <div className="pt-4">
        {!!(profile.years_experience && getExperienceLevel(profile.years_experience ?? 0)) && (
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
              <div
                className="flex items-center justify-center transition-transform hover:scale-110 hover:shadow-xl rounded-md px-2 py-2"
                title="Experience Level"
              >
                <ExperienceBadge years_experience={profile.years_experience} size="xxl" />
              </div>
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
      {/* User Reviews Section*/}
      <ReviewSection />
    </div>
  );
}
