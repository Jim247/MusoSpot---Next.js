import { supabase } from './supabaseClient';

// Update user attributes
export async function updateUserAttributes(uid, attributes) {
  const { error } = await supabase
    .from('users')
    .update(attributes)
    .eq('id', uid);
  if (error) throw error;
}

// Fetch all users
export async function fetchAllUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
}

// Get a single user profile
export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();
  if (error) throw error;
  return data;
}

// Upload profile image
export async function uploadProfileImage(uid, file) {
  const filePath = `profile-images/${uid}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);

  await updateUserAttributes(uid, {
    avatar: urlData.publicUrl,
    avatarUpdatedAt: new Date().toISOString()
  });

  return urlData.publicUrl;
}