// Badge sizes for different display sizes
const SIZES = {
  sm: '24px',
  md: '32px',
  lg: '48px',
  xl: '64px',
  xxl: '85px',
  // Mobile sizes
  'mobile-sm': '20px',
  'mobile-md': '26px',
  'mobile-lg': '38px',
  'mobile-xl': '50px',
  'mobile-xxl': '65px',
};

// Hard-coded badge colors for use in SVGs
const BADGE_COLORS = {
  bronze: '#8B4513',
  silver: '#666666',
  gold: '#B8860B',
  default: '#494949',
};

export default function Badge({ label, svg, tooltip, color, size = 'md', pillboxColor }) {
  // Get appropriate sizes for mobile and desktop
  const getMobileSize = size => {
    switch (size) {
      case 'xxl':
        return SIZES['mobile-xl'];
      case 'xl':
        return SIZES['mobile-lg'];
      case 'lg':
        return SIZES['mobile-md'];
      default:
        return SIZES['mobile-sm'];
    }
  };

  const mobileSize = getMobileSize(size);
  const desktopSize = SIZES[size] || SIZES.md;

  // Determine badge color based on label
  const badgeColor = label?.toLowerCase().includes('bronze')
    ? BADGE_COLORS.bronze
    : label?.toLowerCase().includes('silver')
      ? BADGE_COLORS.silver
      : label?.toLowerCase().includes('gold')
        ? BADGE_COLORS.gold
        : color || BADGE_COLORS.default;

  // Split label for better display
  let labelLines = [label];
  if (label && /years/i.test(label) && /experience/i.test(label)) {
    const parts = label.split(' ');
    const expIndex = parts.findIndex(part => /experience/i.test(part));
    if (expIndex > 0) {
      labelLines = [parts.slice(0, expIndex).join(' '), parts.slice(expIndex).join(' ')];
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      <style jsx>{`
        @media (min-width: 768px) {
          .badge-icon {
            width: ${desktopSize} !important;
            height: ${desktopSize} !important;
          }
        }
      `}</style>
      <div
        className="badge-icon p-1 transition-all duration-200 flex items-center justify-center"
        style={{
          '--badge-color': badgeColor,
          width: mobileSize,
          height: mobileSize,
        }}
        title={tooltip}
        dangerouslySetInnerHTML={{
          __html: svg.replace(/rgb\(180, 41, 122\)/g, 'var(--badge-color)'),
        }}
      />
      <div
        className="text-xs px-2 py-1 rounded-md flex flex-col items-center bg-highlight text-white"
        style={{
          background: pillboxColor ? `${pillboxColor}cc` : `${badgeColor}cc`,
        }}
      >
        {labelLines.map((line, idx) => (
          <span key={idx}>{line}</span>
        ))}
      </div>
    </div>
  );
}
