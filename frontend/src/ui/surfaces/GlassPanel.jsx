// src/ui/surfaces/GlassPanel.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

export function GlassPanel({ className = '', ...props }) {
  const base =
    'rounded-[var(--radius)] border border-[--glass-border] bg-[--glass-bg] ' +
    'backdrop-blur-[var(--glass-blur)]';
  return <div className={twMerge(base, className)} {...props} />;
}
