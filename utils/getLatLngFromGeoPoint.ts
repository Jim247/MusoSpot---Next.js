// Utility to extract lat/lng from GeoJSON Point
export function getLatLngFromGeoPoint(geoPoint: any): { lat: number; lng: number } | null {
  if (
    geoPoint &&
    typeof geoPoint === 'object' &&
    geoPoint.type === 'Point' &&
    Array.isArray(geoPoint.coordinates) &&
    geoPoint.coordinates.length === 2
  ) {
    return { lng: geoPoint.coordinates[0], lat: geoPoint.coordinates[1] };
  }
  return null;
}
