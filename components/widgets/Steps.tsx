import React from 'react';
import { motion } from 'framer-motion';

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
      <div className="grid grid-cols-2 gap-8 items-start">
        <div className="relative">
          {items.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.6 }}
              className="flex items-start mb-12 last:mb-0"
            >
              <div className="relative flex flex-col items-center mr-6">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    border: `2px solid ${baseColor}`,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: baseColor,
                    background: '#fff',
                  }}
                >
                  {Icon ? <Icon size={28} /> : index + 1}
                </div>
                {index !== items.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: '#eee',
                      marginTop: 2,
                    }}
                  />
                )}
              </div>
              <div>
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
            </motion.div>
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