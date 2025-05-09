"use client";
import { useState, useEffect } from "react";
import { useUserProfile } from "@components/UserProfileContext";
import { fetchUserEvents, fetchUserNotifications } from "@lib/firebase";
import type { EventApplication, EventPost } from "@constants/event";

interface SimpleNotification {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  createdAt: string;
}

export function useDashboardData() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [events, setEvents] = useState<EventPost[]>([]);
  const [notifications, setNotifications] = useState<SimpleNotification[]>([]);
  const [applications, setApplications] = useState<{ [key: string]: EventApplication[] }>({});
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
        setEvents(userEvents);
        setNotifications(userNotifications as SimpleNotification[]);
        setError(null);
      } catch {
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
