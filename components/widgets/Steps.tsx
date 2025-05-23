import React from 'react';

export interface Item {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

export interface Props {
  items?: Array<Item>;
  title?: string;
  image?: React.ReactNode; // for the right column
}

const Steps = ({ title, items = [], image }: Props) => {
  if (!items.length) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title above columns on large screens, inside left column on mobile */}
      <div className="block md:hidden mb-8 text-left">
        {/* Mobile title */}
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 items-start">
        <div className="relative flex flex-col gap-6 align-middle">
          {/* Large screen title */}
          <div className="hidden md:block mb-2 text-left">
            {title && <h2 className="text-3xl font-bold">{title}</h2>}
          </div>
          {items.map(({ title, description, icon: Icon }, index) => (
            <div key={index} className="flex flex-row items-center gap-6 relative z-10">
              <div className="flex-shrink-0 flex flex-col items-center pt-0">
                <div
                  style={{
                    width: 62,
                    height: 62,
                    border: '2px solid var(--aw-color-primary)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--aw-color-primary)',
                    background: '#fff',
                  }}
                >
                  {Icon ? <Icon size={36} color="var(--aw-color-primary)" /> : index + 1}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                  {title && (
                    <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{title}</div>
                  )}
                  {description && (
                    <div style={{ color: '#666', fontSize: 17, lineHeight: 1.5 }}>
                      {description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>{image}</div>
      </div>
    </div>
  );
};

export default Steps;
