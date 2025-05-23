"use client";
import { useState, useEffect } from "react";
import { useUserProfile } from "@components/UserProfileContext";
import { supabase } from "../supabaseClient.js";
import type { EventNotification, EventPost } from "@constants/event";

export function useDashboardData() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [events, setEvents] = useState<EventPost[]>([]);
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        // Run both queries in parallel
        const [eventsRes, notificationsRes] = await Promise.all([
          supabase
            .from('events')
            .select('*')
            .eq('poster_id', profile.id),
          supabase
            .from('notifications')
            .select('*')
            .eq('user_id', profile.id),
        ]);

        if (eventsRes.error || notificationsRes.error) {
          throw eventsRes.error || notificationsRes.error;
        }

        setEvents(eventsRes.data || []);
        const mappedNotifications = (notificationsRes.data as EventNotification[]).map((notif) => ({
          ...notif,
          id: notif.id || '',
          poster_id: notif.agent_id || '',
          event_id: notif.event_id || '',
          event_type: notif.event_type || '',
          postcode: notif.postcode || '',
          budget: notif.budget || 0,
          instruments_needed: notif.instruments_needed || [],
          distance: notif.distance || 0,
          date: notif.date || null,
          geoPoint: notif.geopoint,
          extra_info: notif.extra_info || '',
          status: notif.status || '',
        }));
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
  }, [profile?.id]);

  return {
    profile,
    events,
    notifications,
    loading: loading || profileLoading,
    error,
  };
}