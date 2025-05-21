import type { Timestamp } from 'firebase/firestore';

export interface Muso {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  postcode?: string;
  search_radius?: number;
  years_experience?: number;
  agency_name?: string;
  city?: string;
  geo_point: string;
  ward?: string;
  region?: string;
  country?: string;
  instruments?: string[];
  role?: string;
  avatar?: string;
  bio?: string;
  video?: string;
  slug: string;
  reviews?: Review[];
  transport?: boolean;
  pa_system?: boolean;
  lighting?: boolean;
}

export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  postcode?: string;
  years_experience?: number;
  agency_name?: string;
  city?: string;
  geo_point?: string
  ward?: string;
  region?: string;
  country?: string;
  role?: string;
  avatar?: string;
  bio?: string;
  video?: string;
  slug: string;
  reviews?: Review[];

}
export interface Review {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  timestamp?: Timestamp | string ;
}

export interface UserDashboard {
  lighting: boolean;
  pa_system: boolean;
  transport: boolean;
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  email: string;
  phone?: string;
  postcode?: string;
  searchRadius?: number;
  years_experience?: number;
  agency_name?: string;
  city?: string;
  geo_point:string;
  ward?: string;
  region?: string;
  country?: string;
  instruments?: string[];
  role?: string;
  avatar?: string;
  bio?: string;
  video?: string;
  slug?: string;
}
