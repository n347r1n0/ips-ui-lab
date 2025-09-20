// frontend/src/ui/feedback/EmptyState.jsx

import React from 'react';

export function EmptyState({ icon: Icon, title = 'Пока пусто', subtitle, action }) {
  return (
    <div className="text-center rounded-[var(--radius)] border border-[--glass-border]
      bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-8">
      {Icon && <Icon className="mx-auto mb-3 h-8 w-8 text-[--fg-dim]" />}
      <div className="text-[--fg-strong] font-semibold">{title}</div>
      {subtitle && <div className="text-[--fg] opacity-80 mt-1">{subtitle}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
