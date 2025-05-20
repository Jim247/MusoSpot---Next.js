import { supabase } from './supabaseClient';

// Create a new event
export async function createEvent(eventData) {
  const { data, error } = await supabase.from('events').insert([eventData]).select();
  if (error) throw error;
  return data[0];
}

// Update an event
export async function updateEvent(event_id, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', event_id)
    .select();
  if (error) throw error;
  return data[0];
}

// Fetch all events
export async function fetchAllEvents() {
  const { data, error } = await supabase.from('events').select('*');
  if (error) throw error;
  return data;
}

// Get a single event
export async function getEvent(event_id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id)
    .single();
  if (error) throw error;
  return data;
}