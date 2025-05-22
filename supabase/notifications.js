import { supabase } from './supabaseClient';

// Create a new notification
export async function createNotification(userId, eventId, type) {
  const { error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        event_id: eventId,
        type,
        read: false,
      },
    ]);
  if (error) throw error;
}
// Update a notification
export async function updateNotification(notificationId, updates) {
  const { data, error } = await supabase
    .from('event_notifications')
    .update(updates)
    .eq('id', notificationId)
    .select();
  if (error) throw error;
  return data[0];
}

// Fetch all notifications
export async function fetchAllNotifications() {
  const { data, error } = await supabase.from('event_notifications').select('*');
  if (error) throw error;
  return data;
}

// Get a single notification
export async function getNotification(notificationId) {
  const { data, error } = await supabase
    .from('event_notifications')
    .select('*')
    .eq('id', notificationId)
    .single();
  if (error) throw error;
  return data;
}