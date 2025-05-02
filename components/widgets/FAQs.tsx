import React from 'react';
import Headline from '~/components/ui/Headline';
import ItemGrid from '~/components/ui/ItemGrid';
import WidgetWrapper from '../ui/WidgetWrapper';
import type { Faqs as Props } from '~/types';

type FAQsProps = Props & {
  bg?: React.ReactNode;
  id?: string;
  isDark?: boolean;
  classes?: Record<string, string>;
};

const FAQs: React.FC<FAQsProps> = ({
  title = '',
  subtitle = '',
  tagline = '',
  items = [],
  columns = 2,
  id,
  isDark = false,
  classes = {},
  bg,
}) => (
  <WidgetWrapper
    id={id}
    isDark={isDark}
    containerClass={`max-w-7xl mx-auto ${classes?.container ?? ''}`}
    bg={bg}
  >
    <Headline title={title} subtitle={subtitle} tagline={tagline} />
    <ItemGrid
      items={items}
      columns={columns}
      defaultIcon="tabler:chevron-right"
      classes={{
        container: `${columns === 1 ? 'max-w-4xl' : ''} gap-y-8 md:gap-y-12`,
        panel: 'max-w-none',
        icon: 'flex-shrink-0 mt-1 w-6 h-6 text-primary',
      }}
    />
  </WidgetWrapper>
);

export default FAQs;
