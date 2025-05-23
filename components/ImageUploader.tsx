import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { insertProfileImageMetadata } from '../lib/insertProfileImageMetadata';
import { updateUserAvatar } from '../lib/updateUserAvatar';

/**
 * Uploads a profile image to Supabase Storage and returns the public URL.
 * @param userId - The user's UUID
 * @param file - The image file
 * @returns The public URL of the uploaded image
 */
export async function uploadProfileImageSupabase(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  // Debug logging
  console.log('Uploading to bucket:', 'profile-images');
  console.log('File path:', filePath);
  console.log('File:', file);
  console.log('File type:', file.type, 'File size:', file.size);

  // Upload to Supabase Storage (bucket: profile-images)
  const uploadResult = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });
  console.log('Upload result:', uploadResult);
  const { error: uploadError } = uploadResult;
  if (uploadError) {
    console.error('[Supabase Storage] Upload error:', uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
  console.log('Public URL:', data.publicUrl);

  // Insert metadata into profile_images table, but don't block upload if it fails
  try {
    await insertProfileImageMetadata(userId, data.publicUrl);
  } catch (err) {
    console.error('[Supabase DB] Error inserting profile image metadata:', err);
    // Optionally, you could show a warning to the user here
  }

  return data.publicUrl;
}

// Reusable ImageUploader component
interface ImageUploaderProps {
  userId: string;
  initialUrl: string;
  onImageChange: (url: string) => void; 
  size?: number; // Optional, for avatar size
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  userId,
  initialUrl,
  onImageChange,
  size = 192,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const [currentUrl, setCurrentUrl] = useState(initialUrl); // Track current image
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update currentUrl if initialUrl changes from parent
  React.useEffect(() => {
    setCurrentUrl(initialUrl);
  }, [initialUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoMessage('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage('Image must be under 5MB.');
      return;
    }

    setIsUploading(true);
    setPhotoMessage('');

    try {
      const imageUrl = await uploadProfileImageSupabase(userId, file);
      await updateUserAvatar(userId, imageUrl); // Update users.avatar in DB
      setCurrentUrl(imageUrl + '?' + Date.now()); // Bust cache
      onImageChange(imageUrl);
      setPhotoMessage('Profile image updated successfully!');
      setTimeout(() => setPhotoMessage(''), 3000);
    } catch (err) {
      console.error('Upload failed:', err);
      setPhotoMessage('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="relative inline-block cursor-pointer group">
        <label className="cursor-pointer">
          <img
            src={currentUrl ? currentUrl : '/default-avatar.svg'}
            alt="Profile"
            className="object-cover rounded-md border mx-auto"
            style={{ width: size, height: size }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">{currentUrl ? 'Change Photo' : 'Add a Photo'}</span>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
            disabled={isUploading}
            ref={fileInputRef}
          />
        </label>
      </div>
      {isUploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      {photoMessage && (
        <p className={`mt-2 text-sm ${photoMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
          {photoMessage}
        </p>
      )}
    </div>
  );
};