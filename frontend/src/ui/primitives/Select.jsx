// frontend/src/ui/primitives/Select.jsx
import React, { useId } from 'react';
import { twMerge } from 'tailwind-merge';

export function Select({
  id,
  label,
  hint,
  error,
  className,
  variant = 'solid', // 'solid' | 'glass'
  size = 'md',       // 'sm' | 'md' | 'lg'
  disabled = false,
  required = false,
  children,
  ...props
}) {
  const reactId = useId();
  const selectId = id || `sel-${reactId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

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

  const selectClasses = twMerge(
    'block w-full pr-10 pl-3 rounded-[var(--radius)] text-[--fg] outline-none transition appearance-none',
    'placeholder:text-[--fg-dim]',
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
          htmlFor={selectId}
          className="text-sm text-[--fg] opacity-90 select-none"
        >
          {label}{required ? ' *' : ''}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          required={required}
          {...props}
        >
          {children}
        </select>

        {/* визуальная стрелка */}
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>

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
}
