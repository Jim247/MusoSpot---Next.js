import React from 'react';
import Badge from './badges/RenderBadges';
import { badgeData } from './badges/badges';
import { getExperienceLevel, getTransport, getPaSystem, getLighting } from '@utils/BadgeRules';
import MusoSpotStar from './badges/MusoSpotStar';

interface UserProfile {
  years_experience?: number;
  transport?: boolean;
  pa_system?: boolean;
  lighting?: boolean;
}

interface UserBadgesProps {
  profile: UserProfile;
  size?: string;
}

const UserBadges: React.FC<UserBadgesProps> = ({ profile, size = 'md' }) => {
  if (!profile) return null;

  // Experience badge
  let experienceBadge = null;
  if (profile.years_experience) {
    const level = getExperienceLevel(Number(profile.years_experience));
    const badge = level && badgeData.experience[level.label as keyof typeof badgeData.experience];
    if (level && badge) {
      experienceBadge = (
        <Badge
          {...badge}
          color={level.color}
          pillboxColor={level.color}
          tooltip={
            profile.years_experience === 1
              ? '1 year experience'
              : `${profile.years_experience} years experience`
          }
          size={size}
        />
      );
    }
  }

  // Equipment badges (use BadgeRules helpers for DRYness)
  const equipmentBadges = [];
  if (profile.transport) {
    const transport = getTransport(true);
    equipmentBadges.push(
      <Badge
        key="transport"
        label={transport?.label}
        svg={badgeData.equipment.transport.svg}
        tooltip={transport?.description}
        color={null}
        pillboxColor={null}
        size={size}
      />
    );
  }
  if (profile.pa_system) {
    const paSystem = getPaSystem(true);
    equipmentBadges.push(
      <Badge
        key="pa_system"
        label={paSystem?.label}
        svg={badgeData.equipment.PaSystem?.svg}
        tooltip={paSystem?.description}
        color={null}
        pillboxColor={null}
        size={size}
      />
    );
  }
  if (profile.lighting) {
    const lighting = getLighting(true);
    equipmentBadges.push(
      <Badge
        key="lighting"
        label={lighting?.label}
        svg={badgeData.equipment.lighting.svg}
        tooltip={lighting?.description}
        color={null}
        pillboxColor={null}
        size={size}
      />
    );
  }

  return (
    <div className="pt-4">
      <div className="mt-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl text-yellow-600 flex items-center">
            <MusoSpotStar className="inline w-5 h-5 mr-1" />
          </span>
          <h2 className="text-xl font-semibold text-black tracking-wide">MusoSpot Achievements</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 items-center p-4">
          <div className="flex flex-wrap gap-2 items-center">
            {experienceBadge}
            {equipmentBadges}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBadges;
