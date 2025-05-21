export function parseGeoPoint(geoPoint: string): { lat: number; lng: number } | null {
  // Expects "POINT(lng lat)"
  const match = geoPoint.match(/^POINT\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)$/);
  if (!match) return null;
  return {
    lng: parseFloat(match[1]),
    lat: parseFloat(match[3]),
  };
}