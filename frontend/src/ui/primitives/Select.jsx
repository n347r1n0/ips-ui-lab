// frontend/src/ui/primitives/Select.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Select — выпадающий список с лейблом/хинтом/ошибкой.
 *
 * props:
 * - variant: 'solid' | 'glass'
 * - size: 'sm' | 'md' | 'lg'
 * - error: string | boolean
 * - disabled
 */
export function Select({
  id,
  label,
  hint,
  error,
  className,
  variant = 'solid',
  size = 'md',
  disabled = false,
  children,
  ...props
}) {
  const SZ = {
    sm: 'h-9 text-sm',
    md: 'h-10',
    lg: 'h-12 text-base',
  }[size];

  const VR = {
    solid: 'bg-[--bg-1] border border-[--glass-border]',
    glass:
      'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border]',
  }[variant];

  const invalid = error
    ? 'border-[--danger]/70 focus:[box-shadow:0_0_0_2px_var(--danger)]'
    : 'focus:[box-shadow:var(--ring)]';

  const disabledCls = disabled ? 'opacity-60 cursor-not-allowed' : '';

  const selectClasses = twMerge(
    'block w-full rounded-[var(--radius)] text-[--fg] outline-none transition appearance-none',
    'placeholder:text-[--fg-dim] px-3 pr-9',
    SZ,
    VR,
    invalid,
    disabledCls,
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
        <select
          id={id}
          className={selectClasses}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          {...props}
        >
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
          {typeof error === 'string' ? error : 'Ошибка'}
        </div>
      )}
    </div>
  );
}
