'use client';
import React, { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
  icon?: React.ElementType;
}

export interface FAQsProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  items?: FAQItem[];
  columns?: number;
  id?: string;
  classes?: {
    container?: string;
    panel?: string;
    icon?: string;
  };
  bg?: React.ReactNode;
}

const FAQs: React.FC<FAQsProps> = ({
  title = '',
  subtitle = '',
  tagline = '',
  items = [],
  columns = 2,
  id,
  classes = {},
  bg,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id={id}
      className={`w-full max-w-7xl mx-auto my-8 px-6 py-10 bg-white rounded-2xl ${classes.container || ''}`}
      style={{ position: 'relative' }}
    >
      {bg && <div className="absolute inset-0 z-0">{bg}</div>}
      <div className="relative z-10">
        {(title || subtitle || tagline) && (
          <div className="mb-8 md:mx-auto md:mb-12 text-center max-w-3xl">
            {tagline && (
              <p className="text-base text-primary font-bold tracking-wide uppercase">{tagline}</p>
            )}
            {title && (
              <h2 className="font-bold leading-tighter tracking-tighter text-3xl md:text-4xl text-heading mb-2">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-4 text-muted text-xl">{subtitle}</p>}
          </div>
        )}
        <div
          className={`grid mx-auto gap-8 sm:grid-cols-2 gap-y-8 md:gap-y-12 ${columns === 1 ? 'max-w-4xl' : ''}`}
        >
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`flex flex-col max-w-none border-b pb-4 ${classes.panel || ''}`}
              >
                <button
                  className={`faq-button flex items-center w-full text-left focus:outline-none group`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${idx}`}
                  onClick={() => handleToggle(idx)}
                >
                  {item.icon && (
                    <span
                      className={`faq-icon flex justify-center mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0 mt-1 w-6 h-6 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${classes.icon || ''}`}
                    >
                      <item.icon size={24} />
                    </span>
                  )}
                  <span className="text-xl font-bold flex-1">{item.question}</span>
                  <span
                    className={`ml-2 transition-transform duration-200 text-highlight ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    {/* Chevron Down SVG */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-content-${idx}`}
                  className={`faq-description overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}
                  style={{}}
                >
                  <p className="text-muted">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
