'use client';
import React from 'react';
import MiniMap from '@components/maps/MiniMap';
import Image from 'next/image';
import ReviewSection from '../ReviewSection';
import UserBadges from '../profile/UserBadges';
import { ProfileInstruments } from '@components/profile/ProfileInstruments';
import { usePublicProfile } from '@components/PublicProfileContext';

export default function PublicMusoProfile() {
  const { profile, loading } = usePublicProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  // Debug logging for geopoint
  console.log('Profile geopoint:', profile.geopoint);
  console.log('Profile search_radius:', (profile as any).search_radius);
  console.log('Full profile object:', profile);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      {/* Updated header: Pic on top, name then instruments */}
      <div className="flex flex-col items-center space-y-4">
        <Image
          src={profile.avatar || '/default-avatar.svg'}
          alt={`${profile.first_name}'s profile`}
          className="w-48 h-48 rounded-md object-cover"
          width={300}
          height={300}
        />
        <h1 className="text-2xl font-bold">
          {profile.first_name} {profile.last_name}
        </h1>
        {/* Instruments Section */}
        {profile.instruments && profile.instruments.length > 0 && (
          <div className="mt-6">
            <ProfileInstruments instruments={profile.instruments} />
          </div>
        )}
        {(profile.ward || profile.region || profile.country) && (
          <h2 className="text-lg text-gray-600">
            {profile.ward ? `${profile.ward}, ` : ''}
            {profile.region || ''}
            {profile.country ? ` ${profile.country}` : ''}
          </h2>
        )}
      </div>

      {/* Badge Section */}
      <UserBadges profile={profile} size="xxl" />

      {/* Location Section */}
      {profile.geopoint && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Location</h2>
          <div className="h-64 w-full">
            <MiniMap
              geopoint={profile.geopoint}
              id={`map-${profile.id}`}
              className="h-full w-full rounded-lg"
              radius={profile.search_radius}
              showCoverage={true}
            />
          </div>
        </div>
      )}

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

      {/* User Reviews Section */}
      <ReviewSection profileid={profile.id} currentUser={null} />
    </div>
  );
}
