import React from 'react';
import MiniMap from './maps/MiniMap';

export const MatchedEventCard = ({ event, applied, onApply }: any) => (
  <div className="border rounded-lg p-4 bg-slate-50">
    <div className="flex flex-col lg:flex-row gap-6">
           {/* Right column: Map */}
      <div className="w-full lg:w-80 flex-shrink-0">
        {event.geopoint && (
          <MiniMap
            id={`event-map-${event.event_id}`}
            geopoint={event.geopoint}
            showCoverage={false}
            className="rounded-lg border shadow h-40 w-full lg:h-64"
          />
        )}
      </div>
      {/* Left column: Event details */}
      <div className="flex-1">
        <ul className="space-y-1 mb-4">
          <li>
            <span className="font-semibold">Date of Event:</span>{' '}
            <span className="text-gray-700">
              {event.event_date ? new Date(event.event_date).toLocaleDateString() : '—'}
            </span>
          </li>
          <li>
            <span className="font-semibold">Instruments Required:</span>{' '}
            <span className="text-gray-700">
              {event.instruments_needed?.join(', ') || '—'}
            </span>
          </li>
          <li>
            <span className="font-semibold">Event Location:</span>{' '}
            <span className="text-gray-700">{event.postcode || '—'}</span>
          </li>
          <li>
            <span className="font-semibold">Budget:</span>{' '}
            <span className="text-gray-700">£{event.budget ?? '—'}</span>
          </li>
        </ul>
        <div>
          {!applied ? (
            <button onClick={() => onApply(event.event_id)} className="btn btn-primary">
              Apply
            </button>
          ) : (
            <span className="text-green-600 inline-block">Applied</span>
          )}
        </div>
      </div>
    </div>
  </div>
);