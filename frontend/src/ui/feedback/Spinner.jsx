// src/ui/feedback/Spinner.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Spinner({ className }) {
  return (
    <span
      className={twMerge(
        'inline-block align-[-2px] animate-spin rounded-full',
        'w-4 h-4 border-2 border-white/20',
        '[border-top-color:var(--brand-crimson)]',
        className
      )}
    />
  );
}
