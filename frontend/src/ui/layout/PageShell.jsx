import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Центрирующая «материнская» обёртка страницы.
 * По умолчанию ограничивает ширину токеном --page-max-w
 * и добавляет горизонтальные поля (px-4 sm:px-6).
 */
export function PageShell({
  as: Tag = 'div',
  padded = true,
  maxW = 'token', // 'token' | '7xl' | '6xl' | '5xl' | 'full'
  className = '',
  children,
  ...rest
}) {
  const maxWClass =
    maxW === 'token'
      ? 'max-w-[var(--page-max-w)]'
      : maxW === '7xl'
      ? 'max-w-7xl'
      : maxW === '6xl'
      ? 'max-w-6xl'
      : maxW === '5xl'
      ? 'max-w-5xl'
      : 'max-w-full';

  const gutters = padded ? 'px-4 sm:px-6' : '';

  return (
    <Tag className={twMerge('mx-auto w-full', maxWClass, gutters, className)} {...rest}>
      {children}
    </Tag>
  );
}
