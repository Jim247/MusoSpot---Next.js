import React, { useState, useRef } from 'react';
import { uploadProfileImage } from '../lib/firebase';

interface ImageUploaderProps {
  userId: string;
  initialUrl: string;
  onImageChange: (updatedUrl: string) => void;
}

export function ImageUploader({ userId, initialUrl, onImageChange }: ImageUploaderProps) {
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

      const imageUrl = await uploadProfileImage(userId, file);
      onImageChange(imageUrl);
      setPhotoMessage('Profile image updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setPhotoMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setPhotoMessage('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="text-center">
      <div className="relative inline-block cursor-pointer group">
        <label className="cursor-pointer">
          <img
            src={initialUrl ? initialUrl : '/images/User-avatar.svg'}
            alt="Profile"
            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-md border mx-auto"
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
        <p className={`mt-2 text-sm ${photoMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
          {photoMessage}
        </p>
      )}
    </div>
  );
}
