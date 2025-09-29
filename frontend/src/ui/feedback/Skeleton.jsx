// frontend/src/ui/feedback/Skeleton.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Простой скелетон-блок.
 * Пример: <Skeleton className="h-6 w-40" />
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-white/10',
        className
      )}
    />
  );
}

/**
 * Набор строк как «карточка-скелетон».
 * Пример: <SkeletonLines lines={3} />
 */
export function SkeletonLines({ lines = 3, gap = '0.5rem' }) {
  return (
    <div style={{ display: 'grid', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
