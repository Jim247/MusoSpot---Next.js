import React from 'react';
import MiniMap from '@components/maps/MiniMap';
import Image from 'next/image';
import ReviewSection from '../ReviewSection';
import UserBadges from '../profile/UserBadges';

interface MusoProfileProps {
  profile: {
    id: string;
    slug: string;
    avatar?: string;
    first_name: string;
    last_name: string;
    ward?: string;
    region?: string;
    country?: string;
    instruments?: string[];
    years_experience?: number;
    transport?: boolean;
    pa_system?: boolean;
    lighting?: boolean;
    video?: string;
    bio?: string;
    role?: string;
    geopoint?: { type: 'Point'; coordinates: [number, number] } | string | null;
    search_radius?: number;
    postcode?: string;
  };
}

export default function MusoProfile({ profile }: MusoProfileProps) {
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      {/* Updated header: Pic on top, name then instruments */}
      <div className="flex flex-col items-center space-y-4">
        <Image
          src={profile.avatar || '/default-avatar.svg'}
          alt={`${profile.first_name}'s profile`}
          width={192}
          height={192}
          className="w-48 h-48 rounded-md object-cover"
        />
        <h1 className="text-2xl font-bold">
          {profile.first_name} {profile.last_name}
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
            {profile.instruments.map((instrument: string, idx: number) => (
              <span key={idx} className="bg-highlight text-white px-3 py-1 rounded-md text-lg">
                {instrument}
              </span>
            ))}
          </div>
          
        )}
          {/* Location Section */}
      {profile.role !== 'agent' && profile.geopoint && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <MiniMap
            id={`map-${profile.slug}`}
            geopoint={profile.geopoint}
            radius={profile.search_radius || 100}
            className="h-64 w-full rounded-lg"
          />
          <p className="mt-2 text-gray-600">
            This user is available within {profile.search_radius || 100} miles of {profile.postcode}
          </p>
        </div>
      )}
      </div>
      {/* Badge Section */}
     
            <UserBadges profile={profile} size="xxl" />
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