import type { GeoPoint } from '../constants/event';

export const getGeoPoint = async (postcode: string): Promise<GeoPoint> => {
  const formatted = postcode.trim().toUpperCase();
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(formatted)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching location data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (data.status !== 200 || !data.result) {
    throw new Error(`Invalid postcode or no location data found for "${formatted}".`);
  }

  return {
    lat: data.result.latitude,
    lng: data.result.longitude,
  };
};
