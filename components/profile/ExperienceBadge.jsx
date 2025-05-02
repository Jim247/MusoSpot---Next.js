import Badge from '../badges/Badge';
import { getExperienceLevel } from '~/utils/badgeRules';
import { experienceBadges } from '../badges/badges';

export default function ExperienceBadge({ yearsExperience, size }) {
  const level = getExperienceLevel(yearsExperience);
  const badge = level && experienceBadges[level.label.toLowerCase()];
  if (!level || !badge) return null;

  return (
    <div className="flex justify-left rounded-md" style={{ background: level.color ? `${level.color}22` : undefined }}>
      <Badge
        {...badge}
        color={level.color}
        pillboxColor={level.color}
        tooltip={`${yearsExperience} year${yearsExperience === 1 ? '' : 's'} experience`}
        size={size}
      />
    </div>
  );
}
