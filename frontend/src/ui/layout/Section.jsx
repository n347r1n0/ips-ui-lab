// frontend/src/ui/layout/Section.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Секция с унифицированным вертикальным ритмом.
 * y: 'tight' | 'default' | 'loose'
 */
export function Section({
  as: Tag = 'section',
  y = 'default',
  className = '',
  children,
  ...rest
}) {
  const yMap = {
    tight:   'py-8  sm:py-10 lg:py-12',
    default: 'py-12 sm:py-16 lg:py-20',
    loose:   'py-16 sm:py-20 lg:py-24',
  };

  return (
    <Tag className={twMerge(yMap[y] || yMap.default, className)} {...rest}>
      {children}
    </Tag>
  );
}