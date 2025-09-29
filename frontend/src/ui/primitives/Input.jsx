// frontend/src/ui/primitives/Input.jsx

import React, { forwardRef, useId } from 'react';
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
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const reactId = useId();
  const inputId = id || `inp-${reactId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const sizeCls = {
    sm: 'h-9 text-sm',
    md: 'h-10',
    lg: 'h-12 text-base',
  }[size];

  const variantCls = {
    solid:
      'bg-[--bg-1] border border-[--glass-border] focus:[box-shadow:var(--ring)]',
    glass:
      'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] focus:[box-shadow:var(--ring)]',
  }[variant];

  const invalid =
    error
      ? 'border-[--danger]/70 focus:[box-shadow:0_0_0_2px_var(--danger)]'
      : '';

  const disabledCls = disabled ? 'opacity-60 cursor-not-allowed' : '';

  const inputClasses = twMerge(
    'block w-full px-3 rounded-[var(--radius)] text-[--fg] placeholder:text-[--fg-dim] outline-none transition',
    sizeCls,
    variantCls,
    invalid,
    disabledCls,
    className
  );

  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm text-[--fg] opacity-90 select-none"
        >
          {label}{required ? ' *' : ''}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        className={inputClasses}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        required={required}
        {...props}
      />

      {hint && !error && (
        <div id={hintId} className="text-xs text-[--fg] opacity-60">{hint}</div>
      )}
      {error && (
        <div id={errorId} className="text-xs" style={{ color: 'var(--danger)' }}>
          {error}
        </div>
      )}
    </div>
  );
});
