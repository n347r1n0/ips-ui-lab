// frontend/src/ui/primitives/Button.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Spinner } from '../feedback/Spinner';

/**
 * Button — унифицированная кнопка.
 *
 * props:
 * - variant: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger' | 'clay'
 * - size: 'sm' | 'md' | 'lg'
 * - loading: boolean — показывает спиннер и дизейблит кнопку
 * - block: boolean — занимает всю ширину
 * - leftIcon / rightIcon: ReactNode — иконки по краям
 */
const SIZE = {
  sm: 'h-9 px-3 rounded-lg text-sm gap-2',
  md: 'h-10 px-4 rounded-xl gap-2.5',
  lg: 'h-12 px-6 rounded-2xl text-lg gap-3',
};

const VARIANT = {
  primary:
    'bg-[--brand-crimson] text-[--fg-strong] ' +
    'hover:bg-[--brand-crimson-600] active:bg-[--brand-crimson-700] ' +
    'shadow-[var(--shadow-s)] focus:[box-shadow:var(--ring-brand)]',
  secondary:
    'bg-[--bg-2] text-[--fg] border border-[--glass-border] ' +
    'hover:bg-white/10 focus:[box-shadow:var(--ring)]',
  glass:
    'bg-[--glass-bg] text-[--fg] border border-[--glass-border] ' +
    'backdrop-blur-[var(--glass-blur)] hover:bg-white/10 focus:[box-shadow:var(--ring)]',
  ghost:
    'text-[--fg] hover:bg-white/5 focus:[box-shadow:var(--ring)]',
  danger:
    'bg-[--danger] text-white hover:brightness-110 ' +
    'focus:[box-shadow:0_0_0_2px_color-mix(in_oklab,var(--danger),white_25%)]',
  clay:
    'text-[--fg-strong] bg-[--clay-bg] rounded-2xl ' +
    '[box-shadow:var(--clay-ledge),var(--clay-inset),var(--clay-shadow)] ' +
    'border-[0] [border:var(--clay-border)] ' +         /* использует --clay-border */
    'hover:[filter:brightness(1.05)] active:translate-y-[1px] ' +
    'font-semibold tracking-wide',


};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  block = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}) {
  const isDisabled = disabled || loading;

  const base =
    'inline-flex items-center justify-center font-medium select-none ' +
    'transition-colors outline-none';

  return (
    <button
      className={twMerge(
        base,
        SIZE[size],
        VARIANT[variant],
        block ? 'w-full' : '',
        isDisabled ? 'opacity-70 cursor-not-allowed' : '',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {leftIcon ? <span className="-ml-0.5 flex items-center">{leftIcon}</span> : null}
      {loading && (
        <span className="mr-2">
          <Spinner className="!mr-0" />
        </span>
      )}
      <span>{children}</span>
      {rightIcon ? <span className="-mr-0.5 flex items-center">{rightIcon}</span> : null}
    </button>
  );
}
