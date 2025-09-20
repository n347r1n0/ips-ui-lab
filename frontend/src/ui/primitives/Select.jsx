// src/ui/primitives/Select.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Select({
  id,
  label,
  hint,
  error,
  className,
  variant = 'solid', // 'solid' | 'glass'
  size = 'md',       // 'sm' | 'md' | 'lg'
  children,
  ...props
}) {
  const sizes = {
    sm: 'h-9 text-sm',
    md: 'h-10',
    lg: 'h-12 text-base',
  }[size];

  const variants = {
    solid:
      'bg-[--bg-1] border border-[--glass-border] focus:[box-shadow:var(--ring)]',
    glass:
      'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] focus:[box-shadow:var(--ring)]',
  }[variant];

  const invalid =
    error
      ? 'border-[--danger]/70 focus:[box-shadow:0_0_0_2px_var(--danger)]'
      : '';

  const selectClasses = twMerge(
    'block w-full pr-10 pl-3 rounded-[var(--radius)] text-[--fg] outline-none transition appearance-none',
    'placeholder:text-[--fg-dim]',
    sizes,
    variants,
    invalid,
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-[--fg] opacity-90 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select id={id} className={selectClasses} {...props}>
          {children}
        </select>
        {/* стрелка */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70">
          ▾
        </span>
      </div>

      {hint && !error && (
        <div className="text-xs text-[--fg] opacity-60">{hint}</div>
      )}
      {error && (
        <div className="text-xs" style={{ color: 'var(--danger)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
