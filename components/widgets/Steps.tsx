import React, { ReactNode } from 'react';
import Timeline from '~/components/ui/Timeline';
import Headline from '~/components/ui/Headline';
import Image from '~/components/common/Image';
import type { Steps as Props } from '~/types';

type StepsProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  tagline?: ReactNode;
  items?: Props['items'];
  image?: any;
  isReversed?: boolean;
  id?: string;
  isDark?: boolean;
  classes?: Record<string, any>;
  bg?: ReactNode;
};

const Steps: React.FC<StepsProps> = ({
  title,
  subtitle,
  tagline,
  items = [],
  image,
  isReversed = false,
  id,
  isDark = false,
  classes = {},
  bg,
}) => (
  <WidgetWrapper
    id={id}
    isDark={isDark}
    containerClass={`max-w-5xl ${classes?.container ?? ''}`}
    bg={bg}
  >
    <div
      className={[
        'flex flex-col gap-8 md:gap-12',
        isReversed ? 'md:flex-row-reverse' : '',
        image ? 'md:flex-row' : '',
      ].filter(Boolean).join(' ')}
    >
      <div
        className={[
          'md:py-4 md:self-center',
          image ? 'md:basis-1/2' : '',
          !image ? 'w-full' : '',
        ].filter(Boolean).join(' ')}
      >
        <Headline
          title={title}
          subtitle={subtitle}
          tagline={tagline}
          classes={{
            container: 'text-left rtl:text-right',
            title: 'text-3xl lg:text-4xl',
            ...((classes?.headline as object) ?? {}),
          }}
        />
        <Timeline items={items} classes={classes?.items as Record<string, never>} />
      </div>
      {image && (
        <div className="relative md:basis-1/2">
          {typeof image === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: image }} />
          ) : (
            <Image
              className="inset-0 object-cover object-top w-full rounded-md shadow-lg md:absolute md:h-full bg-gray-400 dark:bg-slate-700"
              widths={[400, 768]}
              sizes="(max-width: 768px) 100vw, 432px"
              width={432}
              height={768}
              layout="cover"
              src={image?.src}
              alt={image?.alt || ''}
            />
          )}
        </div>
      )}
    </div>
  </WidgetWrapper>
);

export default Steps;
