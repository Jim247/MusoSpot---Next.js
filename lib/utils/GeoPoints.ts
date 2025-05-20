/**
 * Converts a postcode to a GeoJSON Point object for Supabase/PostGIS.
 * Returns null if the postcode is invalid or not found.
 */

import { validateAndFormatPostcode } from "./PostcodeUtils";

export async function postcodeToGeoPoint(postcode: string): Promise<{ point: string, ward: string, region: string, country: string } | null> {
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
      // Return as a PostGIS-compatible string and include ward, region, country
      return {
        point: `POINT(${data.result.longitude} ${data.result.latitude})`,
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
