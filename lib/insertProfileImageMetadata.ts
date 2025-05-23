import { supabase } from '../supabaseClient';

/**
 * Inserts a new row into the profile_images table after uploading a profile image.
 * @param userId - The user's UUID
 * @param imageUrl - The public URL of the uploaded image
 * @returns The inserted row or throws on error
 */
export async function insertProfileImageMetadata(userId: string, imageUrl: string) {
  const { data, error } = await supabase
    .from('profile_images')
    .insert([
      {
        id: userId,
        image_url: imageUrl,
        // uploaded_at will default to now()
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}
