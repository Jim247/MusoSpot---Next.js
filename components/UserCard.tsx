// filepath: /Users/jamesburgess/Documents/Find-a-Muso/astrowind/src/components/UserCard.tsx
import React from 'react';
import type { User } from '../constants/users';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-md bg-gray-200 overflow-hidden">
          <img
            src={user.avatar || '/src/assets/images/avatar-placeholder.png'}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/src/assets/images/avatar-placeholder.png';
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {user.first_name} {user.last_name}{' '}
          </h3>
          <p className="text-gray-600">{user.location}</p>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Instruments:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.instruments?.map(instrument => (
            <span key={instrument} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
              {instrument}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
