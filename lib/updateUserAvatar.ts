import { supabase } from '../supabaseClient';

/**
 * Updates the avatar field in the users table for the given user.
 * @param userId - The user's UUID
 * @param avatarUrl - The public URL of the uploaded image
 */
export async function updateUserAvatar(userId: string, avatarUrl: string) {
  const { error } = await supabase
    .from('users')
    .update({ avatar: avatarUrl })
    .eq('id', userId);
  if (error) throw error;
}
