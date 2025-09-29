// frontend/src/ui/primitives/Button.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '../feedback/Spinner';

const sizes = {
  sm: 'h-9 px-3 rounded-lg text-sm',
  md: 'h-10 px-4 rounded-xl',
  lg: 'h-12 px-6 rounded-2xl text-lg',
};

const variants = {
  primary:
    'bg-[--brand-crimson] text-[--fg-strong] hover:bg-[--brand-crimson-600] active:bg-[--brand-crimson-700] ' +
    'shadow-[var(--shadow-s)] focus:[box-shadow:var(--ring-brand)]',
  glass:
    'bg-[--glass-bg] border border-[--glass-border] text-[--fg] ' +
    'backdrop-blur-[var(--glass-blur)] hover:bg-white/10 focus:[box-shadow:var(--ring)]',
  neutral:
    'bg-white/10 text-[--fg] hover:bg-white/15 focus:[box-shadow:var(--ring)]',
  danger:
    'bg-[--danger] text-white hover:brightness-110 focus:[box-shadow:0_0_0_2px_rgba(239,68,68,0.6)]',
  ghost:
    'bg-transparent text-[--fg] hover:bg-white/5 focus:[box-shadow:var(--ring)]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  loading = false,
  block = false,
  disabled,
  type = 'button',
  leftIcon,
  rightIcon,
  ...props
}) {
  const isDisabled = disabled || loading;

  const base =
    'inline-flex items-center justify-center font-medium transition-colors select-none ' +
    'outline-none focus-visible:[box-shadow:var(--ring)]';

  const width = block ? 'w-full' : '';

  const state =
    isDisabled
      ? 'opacity-60 pointer-events-none cursor-not-allowed'
      : '';

  return (
    <button
      type={type}
      aria-busy={loading ? 'true' : undefined}
      disabled={isDisabled}
      className={twMerge(base, sizes[size], variants[variant], width, state, className)}
      {...props}
    >
      {/* left icon / spinner */}
      {loading ? (
        <Spinner className="mr-2" />
      ) : (
        leftIcon ? <span className="mr-2 inline-flex">{leftIcon}</span> : null
      )}

      {children}

      {/* right icon */}
      {rightIcon ? <span className="ml-2 inline-flex">{rightIcon}</span> : null}
    </button>
  );
}
