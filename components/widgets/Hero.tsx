import React from 'react';

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

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  actions,
  image,
  id,
}) => (
  <section
    className="relative w-full h-[80vh] min-h-[400px] max-h-[900px] overflow-hidden flex items-center justify-center"
    {...(id ? { id } : {})}
  >
    {/* Background Image */}
    {image?.src && (
      <img
        src={image.src}
        alt={image.alt || 'Hero Image'}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />
    )}
    {/* Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-30" style={{ zIndex: 1 }} />
    {/* Centered Content */}
    <h2 className="text- text-3xl font-bold">Tailwind working?</h2>
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4">
      {title && (
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow mb-4">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-lg md:text-2xl max-w-2xl opacity-90 text-white drop-shadow mb-6">
          {subtitle}
        </p>
      )}
      {actions && (
        <div className="flex flex-wrap justify-center gap-4">
          {actions}
        </div>
      )}
    </div>
  </section>
);

export default Hero;