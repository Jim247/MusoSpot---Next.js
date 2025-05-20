import Badge from './Badge';
import { badgeData } from './badges';

export function LightingBadge({ boolean, size }) {
  if (!boolean) return null;
  const lighting = badgeData.equipment.lighting;
  return (
    <div className="flex justify-left">
      <Badge label="Lighting" svg={lighting.svg} size={size} />
    </div>
  );
}

export function TransportBadge({ boolean, size }) {
  if (!boolean) return null;
  const transport = badgeData.equipment.transport;
  return (
    <div className="flex justify-left">
      <Badge label="Transport" svg={transport.svg} size={size} />
    </div>
  );
}

export function pa_systemBadge({ boolean, size }) {
  if (!boolean) return null;
  const pa_system = badgeData.equipment.pa_system;
  return (
    <div className="flex justify-left">
      <Badge label="PA System" svg={pa_system.svg} size={size} />
    </div>
  );
}
