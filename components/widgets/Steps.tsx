import React from 'react';

export interface Item {
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

export interface Props {
  items?: Array<Item>;
  title?: string;
}

const Steps = ({ title, items = [] }: Props) => {
  if (!items.length) return null;

  return (
    <div>
      {title && <h2>{title}</h2>}
      {items.map(({ title, description, icon: Icon }, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: 8, marginRight: 12 }}>
            {Icon ? <Icon size={24} /> : index + 1}
          </div>
          <div>
            {title && <div style={{ fontWeight: 'bold' }}>{title}</div>}
            {description && <div>{description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Steps;