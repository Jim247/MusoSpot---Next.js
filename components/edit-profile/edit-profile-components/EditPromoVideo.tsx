import React from 'react';
import { PromoVideo } from '@components/PromoVideo';

interface PromoVideoSectionProps {
  videoUrl: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave: (videoUrl: string) => Promise<void>;
}

const PromoVideoSection: React.FC<PromoVideoSectionProps> = ({ videoUrl, isEditing, setIsEditing, onSave }) => (
  <div className="bg-white rounded-lg p-6">
    <div className="py-4 group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-semibold">My Promo Video</h3>
        {!isEditing && videoUrl && (
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600">
            Edit
          </button>
        )}
      </div>
      {!videoUrl && !isEditing ? (
        <div className="text-center p-6 bg-gray-100 rounded-lg">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No video added yet</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary px-4 py-2 mt-4 rounded-md text-white"
          >
            Add Video
          </button>
        </div>
      ) : (
        <PromoVideo
          initialUrl={videoUrl || ''}
          onSave={async (url) => {
            await onSave(url);
            setIsEditing(false);
          }}
          isEditing={isEditing}
          onEditToggle={setIsEditing}
        />
      )}
    </div>
  </div>
);

export default PromoVideoSection;
