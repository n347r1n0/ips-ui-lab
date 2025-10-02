// frontend/src/ui/navigation/ChipNav.jsx

import React, { useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * ChipNav — круглая «фишка»-навигация.
 * props:
 *  - items: Array<{ id, label, icon?: ReactNode, href?: string }>
 *  - activeId: string
 *  - onChange?: (id) => void   // вызывается при перелистывании
 *  - onSelect?: (item) => void // вызывается по тапу (по умолчанию скроллит к #id или переходит по href)
 *  - neighbors: 0 | 1 | 2      // сколько соседей показывать с подписями (по умолчанию 1)
 *  - className
 */
export function ChipNav({
  items = [],
  activeId,
  onChange,
  onSelect,
  neighbors = 1,
  className = '',
}) {
  const idx = Math.max(0, items.findIndex(i => i.id === activeId));
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);

  const current = items[idx] || null;
  const prev = items[(idx - 1 + items.length) % items.length];
  const next = items[(idx + 1) % items.length];

  // жест: вертикальный свайп переключает prev/next
  const threshold = 22; // px
  const onPointerDown = (e) => {
    start.current = { y: e.clientY ?? e.touches?.[0]?.clientY };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    if (!dragging || !start.current) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    const dy = y - start.current.y;
    if (Math.abs(dy) > threshold) {
      const dir = dy > 0 ? 1 : -1; // вниз = следующий
      const nextIndex = (idx + dir + items.length) % items.length;
      onChange?.(items[nextIndex].id);
      start.current = { y }; // «пошаговое» листание
    }
  };
  const endDrag = () => { setDragging(false); start.current = null; };

  const handleTap = () => {
    if (onSelect) return onSelect(current);
    if (!current) return;
    if (current.href) {
      window.location.href = current.href;
    } else {
      // по умолчанию — скролл к #id
      const el = document.getElementById(current.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Ободок делений — можно позже заменить на SVG
  const ring = <div
    aria-hidden
    className="absolute inset-0 rounded-full"
    style={{
      background: 'var(--chip-ring)',
      mask: 'radial-gradient(circle at center, transparent 58%, black 59%)',
      WebkitMask: 'radial-gradient(circle at center, transparent 58%, black 59%)',
      opacity: .9
    }}
  />;

  return (
    <div
      className={twMerge(
        'relative select-none',
        'rounded-full border',
        'bg-[var(--chip-bg)] border-[var(--chip-border)] shadow-[var(--chip-shadow)]',
        'text-[--fg-strong]',
        className
      )}
      style={{ width: 'var(--chip-size)', height: 'var(--chip-size)' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={endDrag}
      role="button"
      aria-label={`Навигация: ${current?.label ?? ''}`}
      onClick={handleTap}
    >
      {ring}

      {/* Активный */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-tight">
          <div className="flex items-center justify-center gap-1 text-[--chip-accent]">
            {current?.icon ? <span className="inline-flex">{current.icon}</span> : null}
          </div>
          <div className="font-brand text-sm [text-shadow:0_0_8px_rgba(0,0,0,.35)]">
            {current?.label}
          </div>
        </div>
      </div>

      {/* Соседи (верх/низ) */}
      {neighbors >= 1 && (
        <>
          <div className="absolute left-1/2 -translate-x-1/2 top-[6%] text-[10px] text-[--fg] opacity-75">
            {prev?.label}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%] text-[10px] text-[--fg] opacity-75">
            {next?.label}
          </div>
        </>
      )}

      {/* Дальние — иконки по периметру (минимум). Оставим задел: показываем еще две. */}
      <DistantIcons items={items} activeIndex={idx} />
    </div>
  );
}

function DistantIcons({ items, activeIndex }) {
  const radiusPct = 78; // проценты от половины
  const count = Math.min(6, items.length - 3); // не перебарщиваем
  if (count <= 0) return null;

  // берем равномерно распределённые элементы «по кругу» вокруг активного
  const spread = [];
  let step = Math.floor(items.length / (count + 1));
  step = Math.max(1, step);
  for (let k = 1; k <= count; k++) {
    spread.push((activeIndex + k * step) % items.length);
  }

  return (
    <>
      {spread.map((i, n) => {
        const angle = (n / count) * Math.PI * 2; // 0..2π
        const x = 50 + Math.cos(angle) * radiusPct/2;
        const y = 50 + Math.sin(angle) * radiusPct/2;
        const item = items[i];
        return (
          <div
            key={i}
            className="absolute text-[--fg] opacity-55"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', fontSize: 12 }}
            aria-hidden
            title={item.label}
          >
            {item.icon ?? '•'}
          </div>
        );
      })}
    </>
  );
}
