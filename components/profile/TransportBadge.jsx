import Badge from '../badges/Badge';
import { getTransport } from '~/utils/badgeRules';
import { equipmentBadges } from '../badges/badges';

export default function TransportBadge({ boolean, size }) {
  if (!boolean) return null;
  const transport = getTransport(boolean);
  if (!transport) return null;

  return (
    <div className="flex justify-left">
      <Badge
        label={transport.label}
        description={transport.description}
        svg={equipmentBadges.transport.svg}
        size={size}
      />
    </div>
  );
}
