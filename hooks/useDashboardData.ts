"use client";
import { useState, useEffect } from "react";
import { useUserProfile } from "@components/UserProfileContext";
import { fetchUserEvents, fetchUserNotifications } from "@lib/firebase";
import type { EventApplication, EventNotification, EventPost } from "@constants/event";

export function useDashboardData() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [events, setEvents] = useState<EventPost[]>([]);
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [applications] = useState<{ [key: string]: EventApplication[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!profile?.uid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [userEvents, userNotifications] = await Promise.all([
          fetchUserEvents(profile.uid),
          fetchUserNotifications(profile.uid),
        ]);
        console.log('Fetched userEvents:', userEvents);
        console.log('Fetched userNotifications:', userNotifications);
        setEvents(userEvents);
        const mappedNotifications = (userNotifications as EventNotification[]).map((notif) => ({
          ...notif,
          id: notif.id || '',
          agentId: notif.agentId || '',
          eventID: notif.eventID || notif.eventID || '',
          eventType: notif.eventType || '',
          postcode: notif.postcode || '',
          budget: notif.budget || 0,
          instrumentsNeeded: notif.instrumentsNeeded || [],
          distance: notif.distance || 0,
          date: notif.date || null,
          geoPoint: notif.geoPoint,
          extraInfo: notif.extraInfo || '',
          status: notif.status || '',
        }));
        console.log('Mapped notifications:', mappedNotifications);
        setNotifications(mappedNotifications);
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile?.uid]);

  return {
    profile,
    events,
    notifications,
    applications,
    loading: profileLoading || loading,
    error,
  };
}
