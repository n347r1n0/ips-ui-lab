// frontend/src/ui/patterns/AccordionPill.jsx

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * AccordionPill — «пилюля», раскрывающаяся вверх.
 *
 * Упрощённая и надёжная фиксация: создаём левую половину контейнера (50% ширины секции),
 * внутрь кладём пилюлю и прижимаем её к правому краю этой половины. Пилюля никогда
 * не выйдет вправо за центр секции и расширяется только влево.
 */
export function AccordionPill({
  items = ['Главная', 'О клубе', 'Турниры', 'Рейтинг', 'Галерея'],
  initialIndex = 0,
  rowHeight = 40,   // px
  maxRows = 6,      // визуальный предел высоты списка
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initialIndex);

  // Обёртка пилюли и шапка
  const wrapperRef = useRef(null);
  const labelRef = useRef(null);

  // Геометрия «шапки»
  const [labelH, setLabelH] = useState(0);

  // Динамическая ширина
  const [labelW, setLabelW] = useState(0); // ширина активного лейбла
  const [maxW, setMaxW] = useState(0);     // максимальная ширина из всех лейблов
  const measureBoxRef = useRef(null);      // offscreen-измеритель

  // Закрытие по клику вне и Esc
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDocDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDocDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Высота шапки
  useEffect(() => {
    if (labelRef.current) setLabelH(labelRef.current.offsetHeight || 0);
  }, [open]);

  // Ширина активного лейбла — по offscreen-измерителю (естественная ширина с паддингами)
  useLayoutEffect(() => {
    const box = measureBoxRef.current;
    if (!box) return;
    const n = box.querySelector(`[data-idx="${active}"]`);
    if (!n) return;
    setLabelW(Math.ceil(n.scrollWidth || 0));
  }, [active, items]);

  // Максимальная ширина среди всех лейблов
  useLayoutEffect(() => {
    const box = measureBoxRef.current;
    if (!box) return;
    const nodes = box.querySelectorAll('[data-measure="label"]');
    if (!nodes.length) return;
    let max = 0;
    nodes.forEach((n) => { max = Math.max(max, Math.ceil(n.scrollWidth || 0)); });
    setMaxW(max);
  }, [items]);

  // Высота раскрытия контента
  const rows = Math.min(items.length - 1, maxRows);
  const listMaxH = Math.max(0, rows * rowHeight);

  const visibleCount = Math.max(0, items.length - 1);
  const needScrollbar = visibleCount > maxRows;

  return (
    <div
      className={twMerge('h-[44px] relative', className)}
      aria-live="polite"
    >
      {/* Offscreen-измеритель ширины лейблов */}
      <div
        aria-hidden
        className="absolute opacity-0 pointer-events-none -z-10 top-0 left-0"
      >
        <div ref={measureBoxRef} className="whitespace-nowrap">
          {items.map((label, idx) => (
            <div
              key={`m-${label}`}
              data-measure="label"
              data-idx={idx}
              className="inline-block px-4 py-2.5"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ЛЕВАЯ ПОЛОВИНА СЕКЦИИ (50%) — жёсткая «коробка», из которой нельзя выйти вправо */}
      <div
        className="absolute left-0 bottom-0 w-1/2 h-full"
        aria-hidden={false}
      >
        {/* Пилюля: прижата к ПРАВОМУ краю половины, расширяется только влево */}
        <div
          ref={wrapperRef}
          className={twMerge(
            'absolute right-0 bottom-0 z-[45]',
            'flex flex-col-reverse',
            'rounded-2xl border border-[--glass-border]',
            'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] shadow-[var(--shadow-s)]',
            'transition-[max-height,width] duration-200 ease-out'
          )}
          style={{
            maxHeight: open ? labelH + listMaxH : labelH || 44,
            width: `${(open ? Math.max(labelW, maxW) : labelW) + 2}px`, // +2px запас
            overflow: 'hidden',
            transformOrigin: 'bottom',
            willChange: 'max-height',
          }}
          role="group"
          aria-label="Навигация (пилюля)"
        >
          {/* Шапка / текущая секция */}
          <button
            ref={labelRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={twMerge(
              'w-auto inline-flex min-w-0 text-left',
              'px-4 py-2.5',
              'flex items-center gap-2',
              'text-[--fg-strong]',
              'hover:bg-white/8 focus:outline-none focus:[box-shadow:var(--ring)]',
            )}
            aria-expanded={open}
            aria-controls="accordion-pill-list"
          >
            <span className="whitespace-nowrap">{items[active]}</span>
          </button>

          {/* Контент аккордеона — увеличиваем только высоту контейнера */}
          <div
            id="accordion-pill-list"
            className="w-full"
            aria-hidden={!open}
          >
            <div
              className={twMerge(needScrollbar ? 'overflow-y-auto' : 'overflow-hidden')}
              style={{
                maxHeight: open ? listMaxH : 0,
                transition: 'max-height 200ms ease-out',
              }}
              role="listbox"
            >
              {items.map((label, idx) => {
                if (idx === active) return null; // активный в шапке
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setActive(idx);
                      setOpen(false);
                    }}
                    className={twMerge(
                      'w-full flex items-center gap-3 px-4 text-left',
                      'text-[--fg] hover:bg-white/8 focus:bg-white/8',
                      'focus:outline-none focus:[box-shadow:var(--ring)]'
                    )}
                    role="option"
                    style={{ height: rowHeight }}
                  >
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* /Пилюля */}
      </div>
      {/* /Левая половина */}
    </div>
  );
}

export default AccordionPill;
