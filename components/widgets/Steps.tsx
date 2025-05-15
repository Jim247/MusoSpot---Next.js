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

const baseColor = 'var(--color-primary, #f50057)';

const Steps = ({ title, items = [], image }: Props) => {
  if (!items.length) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold">{title}</h2>
        </div>
      )}
      {/* Grid Columns */}
      <div className="grid grid-cols-2 gap-8 items-center">
        <div className="relative flex flex-col gap-12">
          {/* Vertical line connecting all icons */}
          <div className="absolute left-[31px] top-[31px] bottom-[31px] w-px bg-gray-300 z-0" style={{height: 'calc(100% - 62px)'}} />
          {items.map(({ title, description, icon: Icon }, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-6 relative z-10"
            >
              <div className="flex-shrink-0 flex flex-col items-center pt-0">
                <div
                  style={{
                    width: 62,
                    height: 62,
                    border: `2px solid ${baseColor}`,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: baseColor,
                    background: '#fff',
                  }}
                >
                  {Icon ? <Icon size={36} /> : index + 1}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                  {title && (
                    <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                      {title}
                    </div>
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
        <div>
          {image}
        </div>
      </div>
    </div>
  );
};

export default Steps;