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

export function paSystemBadge({ boolean, size }) {
  if (!boolean) return null;
  const paSystem = badgeData.equipment.PaSystem;
  return (
    <div className="flex justify-left">
      <Badge label="PA System" svg={paSystem?.svg} size={size} />
    </div>
  );
}
