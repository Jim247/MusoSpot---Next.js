import React, { useState, useEffect } from 'react';

interface PromoVideoProps {
  initialUrl: string;
  onSave: (url: string) => void;
  isEditing: boolean;
  onEditToggle: (editing: boolean) => void;
}

export function PromoVideo({ initialUrl, onSave, isEditing, onEditToggle }: PromoVideoProps) {
  const [url, setUrl] = useState<string>(initialUrl);
  const [error, setError] = useState<string>('');

  // Reset local state when editing starts or initialUrl changes
  useEffect(() => {
    if (isEditing) setUrl(initialUrl);
  }, [isEditing, initialUrl]);

  const extractYouTubeEmbedUrl = (input: string): string | null => {
    const iframeMatch = input.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1].includes('youtube.com/embed/')) {
      return iframeMatch[1];
    }
    if (input.includes('youtube.com/embed/')) {
      return input.trim();
    }
    return null;
  };

  const handleSave = () => {
    const extractedUrl = extractYouTubeEmbedUrl(url);
    if (!extractedUrl) {
      setError('Please enter a valid YouTube embed URL or iframe code.');
      return;
    }
    onSave(extractedUrl);
    onEditToggle(false);
    setError('');
  };

  const handleCancel = () => {
    setUrl(initialUrl);
    setError('');
    onEditToggle(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="Paste your video embed URL or iframe code here"
            className="w-full px-3 py-2 border rounded-md"
          />
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button onClick={handleSave} className="btn-primary">
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
          {extractYouTubeEmbedUrl(url) && (
            <div className="w-full relative pt-[56.25%] mt-4">
              <iframe
                src={extractYouTubeEmbedUrl(url) || ''}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                title="YouTube video preview"
              ></iframe>
            </div>
          )}
        </div>
      ) : (
        initialUrl && (
          <div className="flex flex-col">
            <div className="w-full relative pt-[56.25%]">
              <iframe
                src={initialUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                title="YouTube video"
              ></iframe>
            </div>
            <div className="flex justify-end">
              <button onClick={() => onEditToggle(true)} className="btn-primary mt-4">
                Edit
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
