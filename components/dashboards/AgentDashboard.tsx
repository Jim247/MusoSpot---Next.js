"use client"
import { useState, useEffect } from 'react';
import {
    fetchUserEvents,
    fetchUserNotifications,
} from '@lib/firebase';
import { EventsList } from '@components/events/EventsList';
import type { EventApplication, EventPost } from '@constants/event';
import { useUserProfile } from '@components/UserProfileContext';

// Define a simpler notification type based on the error message
interface SimpleNotification {
    id: string;
    userId: string;
    eventId: string;
    status: string;
    createdAt: string;
}

export default function AgentDashboard() {
    const { profile, loading: profileLoading } = useUserProfile();
    const [events, setEvents] = useState<EventPost[]>([]);
    const [notifications, setNotifications] = useState<SimpleNotification[]>([]); 
    const [applications, setApplications] = useState<{ [key: string]: EventApplication[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Events need to be fetched 
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

    if (profileLoading || loading) return <div>Loading dashboard data...</div>;
    if (!profile) return <div>Could not load profile data. Please try again later.</div>;

    return (
        <div className="bg-contrast dark:bg-gray-800 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Welcome Message & Profile Snippet */}
                <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome, {profile.firstName || 'Musician'}!</h1>
                </div>
                {/* Events/Gigs Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Your Posted Gigs & Applicants</h2>
                    <EventsList events={events} applications={applications} />
                </div>
            </div>
        </div>
    );
}
