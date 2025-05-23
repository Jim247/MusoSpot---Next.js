'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@supabase/auth';
import { supabase } from '../supabaseClient.js';
import { MatchedEventCard } from './MatchedEventCard';
import type { EventNotification } from '@constants/event';

export const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from('matched_events')
        .select('event_id, events(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching matched events:', error);
        setNotifications([]);
        return;
      }
      const notifs = (data || []).map((row: any) => ({
        ...row.events,
        event_id: row.event_id,
      }));
      setNotifications(notifs);

      // Check which events the user has already applied to
      const eventIds = notifs.map(n => n.event_id);
      const { data: applications } = await supabase
        .from('event_applications')
        .select('event_id')
        .in('event_id', eventIds)
        .eq('user_id', user.id);

      const appliedEventIds = new Set(applications?.map(app => app.event_id));
      const tracking: { [key: string]: boolean } = {};
      for (const notif of notifs) {
        tracking[notif.event_id] = appliedEventIds.has(notif.event_id);
      }
      setAppliedEvents(tracking);
    })();
  }, [user]);

  const handleApply = async (event_id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('event_applications')
        .insert([{ event_id, user_id: user.id }]);
      if (error) throw error;
      alert('Applied successfully!');
      setAppliedEvents(prev => ({ ...prev, [event_id]: true }));
    } catch (error) {
      alert('Failed to apply. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div className="mt-8 mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold pb-2">Events Matched to Me</h2>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <MatchedEventCard
              key={notification.event_id}
              event={notification}
              applied={appliedEvents[notification.event_id]}
              onApply={handleApply}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-4">You have no matching events, check back later</p>
      )}
    </div>
  );
};
