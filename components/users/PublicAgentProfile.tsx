'use client';
import React from 'react';
import Image from 'next/image';
import ReviewSection from '@components/ReviewSection';
import UserBadges from '@components/profile/UserBadges';
import { usePublicProfile } from '@components/PublicProfileContext';

export default function PublicAgentProfile() {
  const { profile, loading } = usePublicProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
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
      
      {/* Badge Section */}
      <UserBadges profile={profile} size="xxl" />
      
      {/* Location Section */}
      {profile.role !== 'agent' && profile.geopoint && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Location</h2>
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
      <ReviewSection profileid={profile.id} currentUser={null} reviews={[]} />
    </div>
  );
}
