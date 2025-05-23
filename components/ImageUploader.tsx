import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { insertProfileImageMetadata } from '../lib/insertProfileImageMetadata';

/**
 * Uploads a profile image to Supabase Storage and returns the public URL.
 * @param userId - The user's UUID
 * @param file - The image file
 * @returns The public URL of the uploaded image
 */
export async function uploadProfileImageSupabase(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `profile-images/${userId}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage (bucket: profile-images)
  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });
  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error('Could not get public URL');

  // Insert metadata into profile_images table
  await insertProfileImageMetadata(userId, data.publicUrl);

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

export const ImageUploader: React.FC<ImageUploaderProps> = ({ userId, initialUrl, onImageChange, size = 192, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setPhotoMessage('');
      if (!file.type.startsWith('image/')) {
        setPhotoMessage('Please select an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoMessage('Image must be less than 5MB.');
        return;
      }
      const imageUrl = await uploadProfileImageSupabase(userId, file);
      onImageChange(imageUrl);
      setPhotoMessage('Profile image updated successfully!');
      setTimeout(() => setPhotoMessage(''), 3000);
    } catch {
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
            src={initialUrl || '/default-avatar.svg'}
            alt="Profile"
            className={`object-cover rounded-md border mx-auto`}
            style={{ width: size, height: size }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">{initialUrl ? 'Change Photo' : 'Add a Photo'}</span>
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
      {isUploading && <span className="mt-2 text-sm text-gray-500">Uploading...</span>}
      {photoMessage && (
        <p className={`mt-2 text-sm ${photoMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{photoMessage}</p>
      )}
    </div>
  );
};
