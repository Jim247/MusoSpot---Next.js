import type { Timestamp } from 'firebase/firestore';

export interface Muso {
  uid: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  postcode?: string;
  searchRadius?: number;
  yearsExperience?: number;
  agencyName?: string;
  city?: string;
  geoPoint?: {
    lat: number;
    lng: number;
  };
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
  paSystem?: boolean;
  lighting?: boolean;
}

export interface Agent {
  uid: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  postcode?: string;
  yearsExperience?: number;
  agencyName?: string;
  city?: string;
  geoPoint?: {
    lat: number;
    lng: number;
  };
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
  paSystem: boolean;
  transport: boolean;
  uid: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  phone?: string;
  postcode?: string;
  searchRadius?: number;
  yearsExperience?: number;
  agencyName?: string;
  city?: string;
  geoPoint?: {
    lat: number;
    lng: number;
  };
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
