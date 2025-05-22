import React from 'react';
import MiniMap from '../maps/MiniMap';
import type { EventApplication, EventPost } from '../../constants/event';
import { getLatLngFromGeoPoint } from '../../utils/getLatLngFromGeoPoint';

interface EventsListProps {
  events: EventPost[];
  applications: { [key: string]: EventApplication[] };
}

export const EventsList: React.FC<EventsListProps> = ({ events, applications }) => {
  return (
    <div className="mt-8 bg-white rounded-lg p-6 col-2 shadow-md">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Events</h2>
          <a href="/add-event" className="text-highlight hover:text-secondary text-sm">
            + Post New Event
          </a>
        </div>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const eventKey = event.event_id || event.id;
              const latLng = event.geopoint ? getLatLngFromGeoPoint(event.geopoint) : null;
              const eventApplications = applications[String(eventKey)] || [];
              return (
                <div key={eventKey} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold" />
                  <p>Date: {event.date instanceof Date ? event.date.toLocaleDateString() : event.date}</p>                     
                   <p>Location: {event.postcode}</p>
                      <p>Budget: £{event.budget}</p>
                      <p>Looking for:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {event.instruments_needed.map((instrument: string, idx: number) => (
                          <div key={idx} className="bg-primary text-white px-2 py-1 rounded text-sm">
                            {instrument}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">Event is {event.status} to applications</div>
                    </div>
                    {latLng && (
                      <div>
                        <MiniMap
                          id={`map-${eventKey}`}
                          key={`map-${eventKey}`}
                          lat={latLng.lat}
                          lng={latLng.lng}
                          className="h-64 w-full rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Applications</h3>
                    {eventApplications.length ? (
                      <ul className="list-disc ml-6">
                        {eventApplications.map((app: EventApplication) => (
                          <li key={app.applicantId}>
                            <a href={`/users/${app.slug}`} className="text-highlight hover:text-secondary">
                              {app.slug}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No applications yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No events posted yet</p>
        )}
      </div>
    </div>
  );
};
