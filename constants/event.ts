

// properties of the main Event object
export type EventPost = {
  id?: string;
  poster_id: string;
  event_id: string;
  status: string;
  event_type: string;
  postcode: string;
  geopoint?: string;
  date: Date;
  instruments_needed: string[];
  budget: number;
  extra_info: string;
};

// Properties of the Applicant object in event list component
export type Applicant = {
  applicant_id: string;
  slug: string;
  name?: string;
};

// Properties of the Event object in event list component
export type EventListProps = {
  events: EventPost[];
  applications: {
    [event_id: string]: Applicant[];
  };
};

export const EVENT_TYPES = ['Public Event', 'Private Event'];

export type EventApplication = {
  event_id: string;
  applicantId: string;
  slug: string;
  created_at: Date;
};

// properties of the main Event object
export type EventNotification = {
  id?: string;
  agent_id: string;
  event_id: string;
  status: string;
  event_type: string;
  postcode: string;
  geopoint?: string;
  date: Date;
  instruments_needed: string[];
  budget: number;
  extra_info: string;
  distance: number;
};
