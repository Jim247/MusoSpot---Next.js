/**
 * Converts a postcode to a GeoJSON Point object for Supabase/PostGIS.
 * Returns null if the postcode is invalid or not found.
 */
export const postcodeToGeoJSONPoint = async (postcode: string): Promise<{ type: 'Point'; coordinates: [number, number] } | null> => {
  const formatted = postcode.trim().toUpperCase();
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(formatted)}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  if (data.status !== 200 || !data.result) return null;

  return {
    type: 'Point',
    coordinates: [data.result.longitude, data.result.latitude], // [lng, lat]
  };
};