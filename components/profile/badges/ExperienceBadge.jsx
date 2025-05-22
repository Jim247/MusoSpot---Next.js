import Badge from './Badge';
import { getExperienceLevel } from '@utils/BadgeRules';
import { badgeData } from './badges';

export function ExperienceBadge({ years_experience, size }) {
  const level = getExperienceLevel(years_experience);
  const badge = level && badgeData.experience[level.label];
  if (!level || !badge) return null;

  return (
    <div className="flex justify-left rounded-md" style={{ background: level.color ? `${level.color}22` : undefined }}>
      <Badge
        {...badge}
        color={level.color}
        pillboxColor={level.color}
        tooltip={`${years_experience} year${years_experience === 1 ? '' : 's'} experience`}
        size={size}
      />
    </div>
  );
}
