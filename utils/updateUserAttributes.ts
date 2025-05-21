import { supabase } from '../supabaseClient';

/**
 * Update user attributes in the users table by id.
 * Accepts a partial user object (snake_case keys).
 * Returns the updated user row or throws on error.
 */
export async function updateUserAttributes(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
