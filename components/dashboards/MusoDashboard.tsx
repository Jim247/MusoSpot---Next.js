"use client"
import React from 'react';
import { useDashboardData } from '@hooks/useDashboardData'
import { NotificationList } from '@components/NotificationList';
import { EventsList } from '@components/events/EventsList';

export default function MusoDashboard() {
    const { profile, events, notifications, loading, error } = useDashboardData();
    console.log('MusoDashboard data:', { profile, events, notifications, loading, error });
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
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
                {/* Ensure notifications are of type EventNotification[] */}
                <NotificationList notifications={notifications} />
                {/* Pass applications prop to EventsList */}
                <EventsList events={events} applications={{}} />
            </div>
        </div>
    );
}