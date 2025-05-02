import type { Timestamp } from 'firebase-admin/firestore';

export type GeoPoint = {
  lat: number;
  lng: number;
};

// properties of the main Event object
export type EventPost = {
  id?: string;
  agentId: string;
  eventID: string;
  status: string;
  eventType: string;
  postcode: string;
  geoPoint?: GeoPoint;
  date: Timestamp;
  instrumentsNeeded: string[];
  budget: number;
  extraInfo: string;
};

// Properties of the Applicant object in event list component
export type Applicant = {
  applicantId: string;
  slug: string;
  name?: string;
};

// Properties of the Event object in event list component
export type EventListProps = {
  events: EventPost[];
  applications: {
    [eventId: string]: Applicant[];
  };
};

export const EVENT_TYPES = ['Public Event', 'Private Event'];

export type EventApplication = {
  eventID: string;
  applicantId: string;
  slug: string;
  createdAt: Timestamp;
};

// properties of the main Event object
export type EventNotification = {
  id?: string;
  agentId: string;
  eventID: string;
  status: string;
  eventType: string;
  postcode: string;
  geoPoint?: GeoPoint;
  date: Timestamp;
  instrumentsNeeded: string[];
  budget: number;
  extraInfo: string;
  distance: number;
};
