import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import type { CallToAction as Props } from '~/types';

type ButtonProps = Props & {
  children?: ReactNode;
  className?: string;
  icon?: string;
  type?: 'button' | 'submit' | 'reset';
};

const variants: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  tertiary: 'btn btn-tertiary',
  link: 'cursor-pointer hover:text-primary',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  target,
  children,
  icon = '',
  className = '',
  type,
  ...rest
}) => {
  const classes = twMerge(variants[variant] || '', className);

  if (type === 'button' || type === 'submit' || type === 'reset') {
    return (
      <button type={type} className={classes} {...rest}>
        {children}
        {icon && <Icon name={icon} className="w-5 h-4 ml-1 -mr-1.5 rtl:mr-1 rtl:-ml-1.5 inline-block" />}
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
      {icon && <Icon name={icon} className="w-5 h-5 ml-1 -mr-1.5 rtl:mr-1 rtl:-ml-1.5 inline-block" />}
    </a>
  );
};
