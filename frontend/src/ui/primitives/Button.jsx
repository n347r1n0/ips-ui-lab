// src/ui/primitives/Button.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  sm: 'h-9 px-3 rounded-lg text-sm',
  md: 'h-10 px-4 rounded-xl',
  lg: 'h-12 px-6 rounded-2xl text-lg',
};

const variants = {
  primary:
    'bg-[--brand-crimson] text-[--fg-strong] hover:bg-[--brand-crimson-600] ' +
    'shadow-[var(--shadow-s)] transition-colors',
  glass:
    'bg-[--glass-bg] border border-[--glass-border] text-[--fg] ' +
    'backdrop-blur-[var(--glass-blur)] hover:bg-white/10 transition-colors',
  neutral: 'bg-white/10 text-[--fg] hover:bg-white/15 transition-colors',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium';
  return (
    <button
      className={twMerge(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
