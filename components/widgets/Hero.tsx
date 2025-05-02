import React from 'react';

type ImageProps = {
  src: string;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

type HeroProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tagline?: React.ReactNode;
  actions?: React.ReactNode;
  image?: {
    src: string;
    alt?: string;
  };
  id?: string;
};

const Image: React.FC<ImageProps> = ({ src, alt, className, loading }) => (
  <img src={src} alt={alt} className={className} loading={loading} />
);

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  tagline,
  actions,
  image,
  id,
}) => (
  <section
    className="relative flex items-center justify-center text-center py-16 md:py-24 lg:py-32 w-screen h-screen"
    {...(id ? { id } : {})}
  >
    {/* Hero Background Image */}
    {image?.src && (
      <div className="absolute inset-0 w-full h-full object-cover">
        <Image
          src={image.src}
          alt={image.alt || 'Hero Image'}
          className="absolute inset-0 w-full h-full object-cover overflow-hidden"
          loading="eager"
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>
    )}

    {/* Content on Top of Image */}
    <div className="relative max-w-4xl mx-3">
      <div className="flex flex-col items-center space-y-6 text-white">
        {tagline && (
          <p className="text-sm md:text-base font-semibold uppercase tracking-wide opacity-90">
            {tagline}
          </p>
        )}

        {title && (
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            {subtitle}
          </p>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex flex-wrap justify-center gap-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  </section>
);

export default Hero;