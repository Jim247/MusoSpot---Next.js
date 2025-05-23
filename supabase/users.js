import { supabase } from './supabaseClient';

// Update user attributes
export async function updateUserAttributes(id, attributes) {
  const { error } = await supabase.from('users').update(attributes).eq('id', id);
  if (error) throw error;
}

// Fetch all users
export async function fetchAllUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

// Get a single user profile
export async function getUserProfile(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

// Upload profile image
export async function uploadProfileImage(id, file) {
  const filePath = `profile-images/${id}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

  await updateUserAttributes(id, {
    avatar: urlData.publicUrl,
    avatarupdated_at: new Date().toISOString(),
  });

  return urlData.publicUrl;
}
