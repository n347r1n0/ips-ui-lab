// frontend/src/ui/patterns/MobileChipTabs.jsx

import React, { useRef, useEffect, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * MobileChipTabs — нижняя навигационная лента для мобильных.
 * props:
 *  - items: [{ id: 'calendar', label: 'Календарь', icon?: ReactNode }]
 *  - activeId: string        // текущая секция (из useActiveSection)
 *  - onTabClick?: (id) => void
 */
export function MobileChipTabs({ items = [], activeId, onTabClick }) {
  const scrollerRef = useRef(null);

  // авто-скролл активного пилла в видимую область
  useEffect(() => {
    if (!activeId || !scrollerRef.current) return;
    const el = scrollerRef.current.querySelector(`[data-id="${activeId}"]`);
    if (el) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [activeId]);

  const chips = useMemo(() => items.filter(Boolean), [items]);

  return (
    <div
      className={twMerge(
        // фиксируем у нижней кромки; safe-area; не перекрываем клики на контент
        'fixed inset-x-0 bottom-0 z-40 pointer-events-none',
        'pb-[max(8px,env(safe-area-inset-bottom))]'
      )}
      aria-hidden={chips.length === 0}
    >
      <div className="mx-auto max-w-[var(--page-max-w)] px-[var(--page-gutter)]">
        <div className="relative pointer-events-auto">
          {/* edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[var(--bg-0)] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[var(--bg-0)] to-transparent" />

          <div
            ref={scrollerRef}
            role="tablist"
            aria-label="Навигация по секциям"
            className={twMerge(
              'flex gap-2 overflow-x-auto snap-x snap-mandatory',
              'rounded-[calc(var(--radius)*0.75)]',
              'border border-[--glass-border] bg-[--glass-bg] backdrop-blur-[var(--glass-blur)]',
              'px-3 py-2'
            )}
          >
            {chips.map(({ id, label, icon }) => {
              const active = id === activeId;
              return (
                <button
                  key={id}
                  data-id={id}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`section-${id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => onTabClick?.(id)}
                  className={twMerge(
                    'snap-start whitespace-nowrap select-none',
                    'px-3 h-9 rounded-xl text-sm font-medium',
                    'transition-colors outline-none',
                    active
                      ? 'bg-white/15 text-[--fg-strong] shadow-[var(--shadow-s)]'
                      : 'text-[--fg] hover:bg-white/10',
                    'focus:[box-shadow:var(--ring)]'
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {icon ? <span className="shrink-0">{icon}</span> : null}
                    <span>{label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
