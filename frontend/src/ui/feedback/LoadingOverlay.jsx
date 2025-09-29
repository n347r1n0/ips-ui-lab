// frontend/src/ui/feedback/LoadingOverlay.jsx
import React from 'react';

/**
 * Полупрозрачная вуаль + спиннер поверх любого контейнера.
 * Родителю важно дать className="relative".
 */
export function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div
      className="absolute inset-0 z-20 grid place-items-center
                 bg-black/40 backdrop-blur-[2px] rounded-[inherit]"
      aria-hidden
    >
      <div className="inline-flex items-center gap-3 text-[--fg]">
        <span className="inline-block w-5 h-5 rounded-full border-2 border-white/30 [border-top-color:var(--brand-crimson)] animate-spin" />
        <span className="text-sm opacity-90">Загрузка…</span>
      </div>
    </div>
  );
}
