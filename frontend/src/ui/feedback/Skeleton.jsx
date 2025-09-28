// frontend/src/ui/feedback/Skeleton.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

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

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={twMerge('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={twMerge(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}
