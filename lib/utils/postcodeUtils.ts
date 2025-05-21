import { postcodeValidator } from 'postcode-validator';

export type GeoPoint = {
  lat: number;
  lng: number;
  ward?: string | null;
  region?: string | null;
  country?: string | null;
};

export function formatPostcode(postcode: string): string {
  // Remove all spaces and convert to uppercase
  const clean = postcode.replace(/\s+/g, '').toUpperCase();
  // Add space at the correct position - before the last 3 characters
  return clean.replace(/^(.+?)(\d[A-Z]{2})$/, '$1 $2');
}

export function validateAndFormatPostcode(postcode: string): {
  isValid: boolean;
  formatted: string | null;
} {
  const isValid = postcodeValidator(postcode, 'GB');
  return {
    isValid,
    formatted: isValid ? formatPostcode(postcode) : null,
  };
}

