import React, { ReactNode } from 'react';
import type { CallToAction as Props } from '~/types';

type ButtonProps = Props & {
  children?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const variants = {
  primary: 'btn-primary',
  secondary: 'inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200',
  tertiary: 'inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50',
  link: 'text-primary-600 hover:text-primary-700 font-medium',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  target,
  children,
  className = '',
  type,
  ...rest
}) => {
  const classes = `${variants[variant as keyof typeof variants] || variants.secondary} ${className}`;

  if (type === 'button' || type === 'submit' || type === 'reset') {
    return (
      <button type={type} className={classes} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <a
      className={classes}
      target={target}
      rel={target ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};
