import Badge from '../badges/Badge';
import { getPaSystem } from '~/utils/badgeRules';
import { equipmentBadges } from '../badges/badges';

export default function PASystemBadge({ boolean, size }) {
  if (!boolean) return null;
  const paSystem = getPaSystem(boolean);
  if (!paSystem) return null;

  return (
    <div className="flex justify-left">
      <Badge label={paSystem.label} description={paSystem.description} svg={equipmentBadges.paSystem.svg} size={size} />
    </div>
  );
}
