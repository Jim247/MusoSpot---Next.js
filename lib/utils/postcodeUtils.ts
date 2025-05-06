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

export async function postcodeToGeoPoint(postcode: string): Promise<GeoPoint | null> {
  // First validate and format the postcode
  const { isValid, formatted } = validateAndFormatPostcode(postcode);
  if (!isValid || !formatted) {
    console.error('Invalid UK postcode format:', postcode);
    return null;
  }

  try {
    // Remove spaces from the formatted postcode for the API call
    const formattedPostcode = formatted.replace(/\s+/g, '');
    const response = await fetch(`https://api.postcodes.io/postcodes/${formattedPostcode}`);

    if (!response.ok) {
      console.error('Postcode not found:', formattedPostcode);
      return null;
    }

    const data = await response.json();

    if (data.result && data.result.latitude && data.result.longitude) {
      return {
        lat: data.result.latitude,
        lng: data.result.longitude,
        ward: data.result.admin_ward,
        region: data.result.region,
        country: data.result.country,
      };
    } else {
      console.error('Could not find coordinates for postcode:', postcode);
      return null;
    }
  } catch (error) {
    console.error('Error converting postcode to coordinates:', error);
    return null;
  }
}
