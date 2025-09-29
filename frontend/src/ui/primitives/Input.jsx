// frontend/src/ui/primitives/Input.jsx
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Input — текстовое поле с лейблом/хинтом/ошибкой.
 *
 * props:
 * - variant: 'solid' | 'glass'
 * - size: 'sm' | 'md' | 'lg'
 * - error: string | boolean
 * - hint: string
 * - leftAddon / rightAddon: ReactNode (иконки/теги)
 * - disabled
 */
export const Input = forwardRef(function Input(
  {
    id,
    label,
    hint,
    error,
    className,
    variant = 'solid',
    size = 'md',
    leftAddon,
    rightAddon,
    disabled = false,
    ...props
  },
  ref
) {
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

  const inputClasses = twMerge(
    'block w-full rounded-[var(--radius)] text-[--fg] placeholder:text-[--fg-dim] ' +
      'outline-none transition px-3',
    SZ,
    VR,
    invalid,
    disabledCls,
    leftAddon ? 'pl-10' : '',
    rightAddon ? 'pr-10' : '',
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
        {leftAddon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-80">
            {leftAddon}
          </span>
        )}

        <input
          id={id}
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          {...props}
        />

        {rightAddon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-80">
            {rightAddon}
          </span>
        )}
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
});
