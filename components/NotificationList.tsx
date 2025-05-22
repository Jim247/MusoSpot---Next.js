"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@supabase/auth';
import { supabase } from '../supabaseClient.js';
import type { EventNotification } from '../constants/event';

interface NotificationListProps {
  notifications: EventNotification[];
  onApplicationSuccess?: (event_id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onApplicationSuccess }) => {
  const { user } = useAuth();
  const [appliedEvents, setAppliedEvents] = useState<{ [key: string]: boolean }>({});

  // Check if user has applied to event
  const hasUserAppliedToEvent = async (event_id: string, userID: string) => {
    const { data, error } = await supabase
      .from('event_applications')
      .select('id')
      .eq('event_id', event_id)
      .eq('user_id', userID)
      .maybeSingle();
    return !!data;
  };

  // Apply to event
  const applyToEvent = async (event_id: string, userID: string) => {
    const { error } = await supabase
      .from('event_applications')
      .insert([{ event_id: event_id, user_id: userID }]);
    if (error) throw error;
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const tracking: { [key: string]: boolean } = {};
      for (const notif of notifications) {
        if (!notif.event_id) {
          console.error('Missing event_id in notification:', notif);
          continue;
        }
        const alreadyApplied = await hasUserAppliedToEvent(notif.event_id, user.id);
        tracking[notif.event_id] = alreadyApplied;
      }
      setAppliedEvents(tracking);
    })();
  }, [notifications, user]);

  const handleApply = async (event_id: string) => {
    if (!user) return;
    try {
      await applyToEvent(event_id, user.id);
      alert('Applied successfully!');
      setAppliedEvents((prev) => ({ ...prev, [event_id]: true }));
      if (onApplicationSuccess) {
        onApplicationSuccess(event_id);
      }
    } catch (error) {
      alert('Failed to apply. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div className="mt-8 mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold">Events Matched to Me </h2>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="border rounded-lg p-4 bg-blue-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">New matching event! ({notification.instruments_needed.join(', ')})</p>
                  <p>Location: {notification.postcode}</p>
                  <p>Budget: £{notification.budget}</p>
                  <p className="text-sm text-gray-600">Distance: {notification.distance} miles away</p>
                </div>
                <div className="text-sm text-gray-500">
                  {notification.date && 'seconds' in notification.date
                    ? new Date(notification.event_date.seconds * 1000).toLocaleDateString()
                    : ''}
                </div>
              </div>
              <div className="mt-4">
                {user && !appliedEvents[notification.event_id] ? (
                  <button onClick={() => handleApply(notification.event_id)} className="btn btn-primary">
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