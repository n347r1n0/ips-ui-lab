// src/ui/primitives/Input.jsx

import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(function Input(
  {
    id,
    label,
    hint,
    error,
    className,
    variant = 'solid', // 'solid' | 'glass'
    size = 'md',       // 'sm' | 'md' | 'lg'
    ...props
  },
  ref
) {
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

  const inputClasses = twMerge(
    'block w-full px-3 rounded-[var(--radius)] text-[--fg] placeholder:text-[--fg-dim] outline-none transition',
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

      <input id={id} ref={ref} className={inputClasses} {...props} />

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
});
