import React from 'react';

interface WidgetWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WidgetWrapper provides a consistent, attractive container for widgets like Hero, Steps, etc.
 * It centers content, adds padding, background, and subtle shadow for separation.
 */
const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ children, className = '', style }) => {
  return (
    <section
      className={`w-full max-w-5xl mx-auto my-8 px-6 py-10 bg-white border-gray-100 ${className}`}
      style={style}
    >
      {children}
    </section>
  );
};

export default WidgetWrapper;
