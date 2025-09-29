// frontend/src/ui/surfaces/Card.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Card — универсальная «карточка»/панель.
 * variant: 'solid' | 'glass'
 * padding: 'sm' | 'md' | 'lg'
 * elevation: 'none' | 's' | 'm'
 */
export function Card({
  variant = 'solid',
  padding = 'md',
  elevation = 's',
  className = '',
  children,
  ...rest
}) {
  const pad =
    padding === 'lg'
      ? 'p-6 md:p-8'
      : padding === 'sm'
      ? 'p-3'
      : 'p-4 md:p-6';

  const surf =
    variant === 'glass'
      ? 'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border]'
      : 'bg-[--bg-1] border border-[--glass-border]';

  const shadow =
    elevation === 'm' ? 'shadow-[var(--shadow-m)]'
    : elevation === 's' ? 'shadow-[var(--shadow-s)]'
    : '';

  return (
    <div
      className={twMerge(
        'rounded-[var(--radius)]',
        surf,
        shadow,
        pad,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className = '', children, ...rest }) {
  return (
    <div
      className={twMerge(
        'mb-3 flex items-center justify-between',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({ className = '', children, ...rest }) {
  return (
    <div className={twMerge('text-[--fg]', className)} {...rest}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ className = '', children, ...rest }) {
  return (
    <div
      className={twMerge('mt-4 flex items-center justify-end gap-2', className)}
      {...rest}
    >
      {children}
    </div>
  );
};