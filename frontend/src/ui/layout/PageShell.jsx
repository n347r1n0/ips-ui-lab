// frontend/src/ui/layout/PageShell.jsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Центрирующая «материнская» обёртка страницы/контента.
 * maxW: 'token' | '7xl' | '6xl' | '5xl' | 'full'
 * padded: добавляет горизонтальные поля (gutters) из --page-gutter.
 */
export function PageShell({
  as: Tag = 'div',
  maxW = 'token',
  padded = true,
  className = '',
  children,
  ...rest
}) {
  const maxWClass =
    maxW === 'token' ? 'max-w-[var(--page-max-w)]'
    : maxW === '7xl'  ? 'max-w-7xl'
    : maxW === '6xl'  ? 'max-w-6xl'
    : maxW === '5xl'  ? 'max-w-5xl'
    : 'max-w-full';

  // Гаттеры управляются токеном --page-gutter
  const gutters = padded ? 'px-[var(--page-gutter)]' : '';

  return (
    <Tag
      className={twMerge('mx-auto w-full', maxWClass, gutters, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
