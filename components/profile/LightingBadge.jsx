import Badge from '../badges/Badge';
import { getLighting } from '~/utils/badgeRules';
import { equipmentBadges } from '../badges/badges';

export default function PASystemBadge({ boolean, size }) {
  if (!boolean) return null;
  const lighting = getLighting(boolean);
  if (!lighting) return null;

  return (
    <div className="flex justify-left">
      <Badge label={lighting.label} description={lighting.description} svg={equipmentBadges.lighting.svg} size={size} />
    </div>
  );
}
