"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/firebase';
import type { User } from 'firebase/auth';
import type { EventNotification } from '../constants/event';

// Fix: Define correct props interface
interface NotificationListProps {
  notifications: EventNotification[];
  onApplicationSuccess?: (eventID: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onApplicationSuccess }) => {
  const { user } = useAuth() as { user: User | null };
  const [appliedEvents, setAppliedEvents] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      const tracking: { [key: string]: boolean } = {};
      for (const notif of notifications) {
        if (!notif.eventID) {
          console.error('Missing eventID in notification:', notif);
          continue;
        }
        const alreadyApplied = await hasUserAppliedToEvent(notif.eventID, user.uid);
        tracking[notif.eventID] = alreadyApplied;
      }
      setAppliedEvents(tracking);
    })();
  }, [notifications, user]);

  const handleApply = async (eventID: string) => {
    if (!user) return;
    try {
      await applyToEvent(eventID, user.uid);
      alert('Applied successfully!');
      setAppliedEvents((prev) => ({ ...prev, [eventID]: true }));
      if (onApplicationSuccess) {
        onApplicationSuccess(eventID);
      }
    } catch (error) {
      alert('Failed to apply. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div className="mt-8 mb-8 bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold">Events Matched to Me </h2>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="border rounded-lg p-4 bg-blue-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">New matching event! ({notification.instrumentsNeeded.join(', ')})</p>
                  <p>Location: {notification.postcode}</p>
                  <p>Budget: £{notification.budget}</p>
                  <p className="text-sm text-gray-600">Distance: {notification.distance} miles away</p>
                </div>
                <div className="text-sm text-gray-500">
                  {notification.date && 'seconds' in notification.date
                    ? new Date(notification.date.seconds * 1000).toLocaleDateString()
                    : ''}
                </div>
              </div>
              <div className="mt-4">
                {user && !appliedEvents[notification.eventID] ? (
                  <button onClick={() => handleApply(notification.eventID)} className="btn btn-primary">
                    Apply
                  </button>
                ) : (
                  <span className="text-green-600 inline-block">Applied</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-4">You have no matching events, check back later</p>
      )}
    </div>
  );
};
