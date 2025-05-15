import React from 'react';

export interface FAQItem {
  question: string;
  answer: string;
  icon?: React.ElementType;
}

export interface FAQsProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  items?: FAQItem[];
  columns?: number;
  id?: string;
  classes?: {
    container?: string;
    panel?: string;
    icon?: string;
  };
  bg?: React.ReactNode;
}

const FAQs: React.FC<FAQsProps> = ({
  title = '',
  subtitle = '',
  tagline = '',
  items = [],
  columns = 2,
  id,
  classes = {},
  bg,
}) => {
  return (
    <section
      id={id}
      className={`w-full max-w-7xl mx-auto my-8 px-6 py-10 bg-white rounded-2xl} ${classes.container || ''}`}
      style={{ position: 'relative' }}
    >
      {bg && <div className="absolute inset-0 z-0">{bg}</div>}
      <div className="relative z-10">
        {(title || subtitle || tagline) && (
          <div className="mb-8 md:mx-auto md:mb-12 text-center max-w-3xl">
            {tagline && (
              <p className="text-base text-secondary font-bold tracking-wide uppercase">{tagline}</p>
            )}
            {title && (
              <h2 className="font-bold leading-tighter tracking-tighter text-3xl md:text-4xl text-heading mb-2">{title}</h2>
            )}
            {subtitle && <p className="mt-4 text-muted text-xl">{subtitle}</p>}
          </div>
        )}
        <div
          className={`grid mx-auto gap-8 sm:grid-cols-2 gap-y-8 md:gap-y-12 ${columns === 1 ? 'max-w-4xl' : ''}`}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-row max-w-none ${classes.panel || ''}`}
            >
              {item.icon && (
                <span className={`flex justify-center mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0 mt-1 w-6 h-6 text-primary ${classes.icon || ''}`}>
                  <item.icon size={24} />
                </span>
              )}
              <div className="mt-0.5">
                <h3 className="text-xl font-bold">{item.question}</h3>
                <p className="mt-3 text-muted">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;


