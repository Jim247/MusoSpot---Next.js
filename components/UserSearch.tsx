import { useState, useEffect } from 'react';
import UserCard from './UserCard';
import { INSTRUMENTS } from '../constants/instruments';
import type { User } from '../constants/users';

interface UserCard {
  id: string;
  name: string;
  location: string;
  instruments: string[];
}

export default function UserSearch() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState('');
  const [instrument, setInstrument] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (region) params.append('region', region);
        if (instrument) params.append('instrument', instrument);

        console.log('Fetching users with params:', params.toString());
        // Update API endpoint URL
        const response = await fetch(
          `/api/users${params.toString() ? '?' + params.toString() : ''}`
        );

        if (!response.ok) {
          console.error('Response status:', response.status);
          const text = await response.text();
          console.error('Response text:', text);
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log('Received users:', data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error instanceof Error ? error.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [region, instrument]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div>
      <div className="flex gap-4 mb-8">
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Regions</option>
          {UK_REGIONS.map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select
          value={instrument}
          onChange={e => setInstrument(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Instruments</option>
          {INSTRUMENTS.map(instrument => (
            <option key={instrument} value={instrument}>
              {instrument}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center p-4">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <a
              key={user.id}
              href={`/user/${user.id}`}
              className="block hover:scale-105 transition-transform"
            >
              <UserCard user={user} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
