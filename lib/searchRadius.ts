import { getDistance } from 'geolib';

export default function searchRadius(
  latitude: number,
  longitude: number,
  radius: number,
  locations: { latitude: number; longitude: number }[]
) {
  return locations.filter((location) => {
    return (
      getDistance({ latitude, longitude }, { latitude: location.latitude, longitude: location.longitude }) <= radius
    );
  });
}
