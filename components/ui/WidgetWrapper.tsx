import React from 'react';
import type { ReactNode, ElementType, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';


export interface Props extends HTMLAttributes<HTMLElement> {
  id?: string;
  isDark?: boolean;
  containerClass?: string;
  bg?: string;
  as?: ElementType;
  children?: ReactNode;
}

const WidgetWrapper: React.FC<Props> = ({
  id,
  isDark = false,
  containerClass = '',
  as: WrapperTag = 'section',
  children,
  ...rest
}) => (
  <WrapperTag
    className="relative not-prose scroll-mt-[72px]"
    id={id}
    {...rest}
  >
    <div className="absolute inset-0 pointer-events-none -z-[1]" aria-hidden="true"></div>
    <div
      className={twMerge(
        'relative mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-16 lg:py-20 text-default intersect-once intersect-quarter intercept-no-queue motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade',
        containerClass,
        isDark ? 'dark' : ''
      )}
    >
      {children}
    </div>
  </WrapperTag>
);

export default WidgetWrapper;
