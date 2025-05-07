"use client"
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '@components/UserProfileContext';
import {
    fetchUserEvents,
    fetchUserNotifications,
} from '@lib/firebase';
import { NotificationList } from '@components/NotificationList';
import { EventsList } from '@components/events/EventsList';
import type { EventApplication, EventPost } from '@constants/event';

// Move interface outside component
interface SimpleNotification {
    id: string;
    userId: string;
    eventId: string;
    status: string;
    createdAt: string;
}

export default function MusoDashboard() {
    const { profile, loading: profileLoading } = useUserProfile();
    const [events, setEvents] = useState<EventPost[]>([]);
    const [notifications, setNotifications] = useState<SimpleNotification[]>([]);
    const [applications, setApplications] = useState<{ [key: string]: EventApplication[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Events need to be fetched 
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
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [profile?.uid]);

    if (profileLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg mb-4">Please log in to view your dashboard</p>
                    <a href="/login" className="text-primary hover:text-secondary">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-contrast dark:bg-gray-800 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Welcome, {profile.firstName || 'Musician'}!
                    </h1>
                </div>
                
                <NotificationList notifications={notifications} />
                <EventsList events={events} />
            </div>
        </div>
    );
}