import React from 'react';
import Headline from '~/components/ui/Headline';
import WidgetWrapper from '~/components/ui/WidgetWrapper';
import Button from '~/components/ui/Button';
import Image from '~/components/common/Image';
import type { Testimonials as Props } from '~/types';

type TestimonialItem = {
  title?: string;
  testimonial?: string;
  name?: string;
  job?: string;
  image?: any;
};

const Testimonials: React.FC<
  Props & {
    id?: string;
    isDark?: boolean;
    classes?: { container?: string };
    bg?: React.ReactNode;
  }
> = ({
  title = '',
  subtitle = '',
  tagline = '',
  testimonials = [],
  callToAction,
  id,
  isDark = false,
  classes = {},
  bg,
}) => (
  <WidgetWrapper
    id={id}
    isDark={isDark}
    containerClass={`max-w-6xl mx-auto ${classes?.container ?? ''}`}
    bg={bg}
  >
    <Headline title={title} subtitle={subtitle} tagline={tagline} />

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials &&
        testimonials.map(
          ({ title, testimonial, name, job, image }: TestimonialItem, idx: number) => (
            <div
              className="flex h-auto intersect-once motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 intersect-quarter"
              key={idx}
            >
              <div className="flex flex-col p-4 md:p-6 rounded-md shadow-xl dark:shadow-none dark:border dark:border-slate-600">
                {title && <h2 className="text-lg font-medium leading-6 pb-4">{title}</h2>}
                {testimonial && (
                  <blockquote className="flex-auto">
                    <p className="text-muted">&quot; {testimonial} &quot;</p>
                  </blockquote>
                )}
                <hr className="border-slate-200 dark:border-slate-600 my-4" />

                <div className="flex items-center">
                  {image && (
                    <div className="h-20 w-20 rounded-md border border-slate-200 dark:border-slate-600">
                      {typeof image === 'string' ? (
                        // If image is an SVG string, render as HTML
                        <span
                          dangerouslySetInnerHTML={{ __html: image }}
                          style={{ display: 'block', width: '100%', height: '100%' }}
                        />
                      ) : (
                        <Image
                          className="h-20 w-20 rounded-md border border-slate-200 dark:border-slate-600 min-w-full min-h-full"
                          width={80}
                          height={80}
                          widths={[400, 768]}
                          layout="fixed"
                          {...image}
                        />
                      )}
                    </div>
                  )}

                  <div className="grow ml-3 rtl:ml-0 rtl:mr-3">
                    {name && <p className="text-base font-semibold">{name}</p>}
                    {job && <p className="text-xs text-muted">{job}</p>}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
    </div>
    {callToAction && (
      <div className="flex justify-center mx-auto w-fit mt-8 md:mt-12 font-medium">
        <Button {...callToAction} />
      </div>
    )}
  </WidgetWrapper>
);

export default Testimonials;
