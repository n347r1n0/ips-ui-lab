import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Верхняя панель/таскбар внутри секции/панели.
 * sticky: делает панель липкой (sticky top-0).
 */
export function Toolbar({
  className = '',
  sticky = false,
  children,
  ...rest
}) {
  const base =
    'h-[var(--toolbar-h)] rounded-[calc(var(--radius)*0.75)] ' +
    'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] ' +
    'px-3 sm:px-4 flex items-center gap-3';
  const stick = sticky ? 'sticky top-0 z-50' : '';
  return (
    <div className={twMerge(base, stick, className)} {...rest}>
      {children}
    </div>
  );
}
