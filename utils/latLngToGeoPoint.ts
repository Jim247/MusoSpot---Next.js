// Utility to convert {lat, lng} to GeoJSON Point with correct type
export function latLngToGeoPoint(coords: { lat: number; lng: number }) {
  return {
    type: 'Point' as const,
    coordinates: [coords.lng, coords.lat] as [number, number],
  };
}
