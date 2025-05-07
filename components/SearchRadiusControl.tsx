import React, { useState } from 'react';
import CoverageMap from '@components/maps/CoverageMap'

interface SearchRadiusControlProps {
  initialRadius: number;
  center: { lat: number; lng: number };
  onSave: (radius: number) => Promise<void>;
  isEditing: boolean;
  onEditToggle: (editing: boolean) => void;
}

export const SearchRadiusControl = React.memo(
  ({ initialRadius, center, onSave, isEditing, onEditToggle }: SearchRadiusControlProps) => {
    const [radiusValue, setRadiusValue] = useState(initialRadius);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await onSave(radiusValue);
      onEditToggle(false);
    };

    return (
      <div className="space-y-4">
        <CoverageMap center={center} radiusMiles={radiusValue} />

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="200"
                value={radiusValue}
                onChange={(e) => setRadiusValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <span className="text-sm text-gray-500 w-16">{radiusValue} miles</span>
            </div>
            <div className="flex justify-end gap-2">
              <button type="submit" className="btn btn-primary px-3 py-1 text-white text-sm rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  onEditToggle(false);
                  setRadiusValue(initialRadius);
                }}
                className="px-3 py-1 bg-gray-300 text-sm rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-m text-gray-500">Your search radius is set to {radiusValue} miles</p>
            <button type="button" onClick={() => onEditToggle(true)} className="btn-primary">
              Edit
            </button>
          </div>
        )}
      </div>
    );
  }
);

SearchRadiusControl.displayName = 'SearchRadiusControl';
