export const experienceLevels = {
  BRONZE: {
    min: 5,
    max: 10,
    label: 'bronze',
    description: '5 Years Experience',
    color: '#804521',
  },
  SILVER: {
    min: 10,
    max: 15,
    label: 'silver',
    description: '10 Years Experience',
    color: '#595959',
  },
  GOLD: {
    min: 15,
    max: Infinity,
    label: 'gold',
    description: '15+ Years Experience',
    color: '#b08f2d',
  },
};

/**
 * Returns the experience level based on years of experience
 * @param years Number of years of experience
 * @returns Experience level object or null if less than 5 years (novice)
 */
export const getExperienceLevel = (years: number) => {
  if (years < experienceLevels.BRONZE.min) return null;
  if (years >= experienceLevels.GOLD.min) return experienceLevels.GOLD;
  if (years >= experienceLevels.SILVER.min) return experienceLevels.SILVER;
  if (years >= experienceLevels.BRONZE.min) return experienceLevels.BRONZE;
  return null;
};

export const getTransport = (transport: boolean) => {
  if (transport) {
    return {
      label: 'Transport',
      description: 'I have my own transport',
    };
  }
};
export const getpa_system = (pa_system: boolean) => {
  if (pa_system) {
    return {
      label: 'PA System',
      description: 'I have my own PA System',
    };
  }
};

export const getLighting = (lighting: boolean) => {
  if (lighting) {
    return {
      label: 'Lighting Rig',
      description: 'I have my own lighting rig',
    };
  }
};
