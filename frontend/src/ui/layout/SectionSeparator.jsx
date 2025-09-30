import React from 'react';

export function SectionSeparator({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[--glass-border] to-[--gold] opacity-30" />
        <div className="w-2 h-2 bg-[--gold] opacity-40 rounded-full" />
        <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-[--glass-border] to-[--gold] opacity-30" />
      </div>
    </div>
  );
}