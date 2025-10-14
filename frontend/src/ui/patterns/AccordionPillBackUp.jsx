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
























// frontend/src/ui/patterns/AccordionPill.jsx

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * AccordionPill — «пилюля», раскрывающаяся вверх.
 *
 * Якорная схема без ограничений ширины:
 * ─ создаём нулевую по ширине опорную линию (anchor) по центру секции: right:50%, width:0;
 * ─ пилюля прижата к правому краю anchor (right:0) ⇒ не может выйти вправо от центра,
 *   ширина растёт только влево. Никаких translate/left-1/2 нет.
 */



 /**
 * ───────────────────────────────────────────────────────────────────────────────
 * Не удалять — Важное!!!
 * AccordionPill — почему текущее решение работает и какие подходы оказались плохими
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * КОРОТКО (суть решения):
 * 1) Создаём «якорь-линию» по центру секции: абсолютный блок с right:50%, width:0, overflow:visible.
 *    Это нулевая по ширине вертикальная линия — геометрическая точка привязки.
 * 2) Пилюля позиционируется внутри якоря: position:absolute; right:0; bottom:0.
 *    ⇒ Правый край пилюли всегда совпадает с линией центра. Изменение width добавляет пиксели ТОЛЬКО влево.
 * 3) Ширину считаем программно: в закрытом состоянии = «естественная» ширина активного лейбла,
 *    в открытом = максимальная среди всех лейблов. Добавляем +2px буфера от субпикселей.
 *
 * ПОЧЕМУ ЭТО РАБОТАЕТ (без костылей):
 * • Привязка идёт не к центру блока (translateX), а к конкретному краю (right:0) внутри точки-якоря.
 * • Якорь нулевой ширины и не ограничивает пилюлю по max-width; overflow:visible у якоря
 *   позволяет пилюле уходить влево сколь угодно (пока родитель не режет слева).
 * • Нет трансформов, зависящих от текущей ширины. Точка привязки — чистый CSS-layout.
 *
 * ЧТО КАЗАЛОСЬ ОЧЕВИДНЫМ, НО ПЛОХО:
 * 1) Центрирование через left:50% + translateX(-50%) (+ «компенсации» extraW).
 *    — Это всегда крепит ЦЕНТР блока к точке. При изменении width блок растёт в обе стороны.
 *    — «Компенсации» через calc(-50% - extraW) хрупки: субпиксели, дрожание на transition, зависимость от измерений.
 *
 * 2) «Левая половина» контейнера (w-1/2) как жёсткая коробка.
 *    — Надёжно удерживает правый край, но вводит ИСКУССТВЕННЫЙ лимит ширины (не шире половины секции),
 *      усложняет верстку и создаёт лишнюю вложенность.
 *
 * 3) Вычислять правый якорь формулой (right = containerW - anchorX).
 *    — Работает, но избыточно: требует ResizeObserver/измерений, порядок эффектов, больше мест сломаться.
 *      То, что решается чистым CSS (right:50% у якоря), не надо переносить в JS.
 *
 * 4) Мерить ширину по offsetWidth у кнопки с w-full или с truncate на тексте.
 *    — w-full даёт ширину контейнера, а не «естественную» ширину текста.
 *    — truncate «подрезает» последний символ и ломает замер.
 *    — Правильно: offscreen-измеритель с теми же паддингами, без truncate; брать scrollWidth.
 *
 * ПРАКТИЧЕСКИЕ ПРАВИЛА:
 * • Нужно «расти только влево/вправо» — привязываем НУЖНЫЙ КРАЙ к опорной точке (right:0 или left:0)
 *   внутри якоря нулевой ширины. Не используем translateX для фиксации края.
 * • Измерения текста — только через offscreen-мерилку (одинаковые шрифты/паддинги), +1–2px буфера.
 * • Следить за родителями: overflow:hidden у внешних контейнеров может обрезать расширение слева —
 *   это уже вопрос макета, не пилюли.
 *
 * РАСШИРЕНИЕ НА БУДУЩЕЕ:
 * • Перенос опорной точки: заменить right:50% у якоря на вычисляемое значение или проп (anchorX/anchorPercent),
 *   сам принцип остаётся тем же (якорь width:0; пилюля right:0).
 *
 * ТРОБЛЬШУТИНГ:
 * • Видите «Главна..» → уберите truncate у активного лейбла, убедитесь в корректном offscreen-замере
 *   и оставьте +2px страховки к width.
 * • Пилюля «лезет вправо» → проверьте: якорь именно right:50%, width:0, пилюля right:0 (без translateX).
 * • Пилюля «режется слева» → ищите overflow:hidden у родителей и/или переносите якорь выше.
 * ───────────────────────────────────────────────────────────────────────────────
 */

export function AccordionPill({
  items = ['Главная', 'О клубе', 'Турниры', 'Рейтинг', 'Галерея'],
  initialIndex = 0,
  rowHeight = 40,   // px
  maxRows = 6,      // визуальный предел высоты списка
  className = '',

  /** Опционально: иконки для пунктов (той же длины, что items).
   *  В закрытом состоянии не показываются; при открытии — появляются слева.
   *  Если не передавать — всё работает как раньше, без иконок.
   */
  icons = null,
  iconSize = 18,     // px: визуальный размер глифа
  iconGap = 8,       // px: отступ между иконкой и текстом
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initialIndex);

  const labelRef = useRef(null);
  const wrapperRef = useRef(null);

  // Геометрия «шапки»
  const [labelH, setLabelH] = useState(0);

  // Динамическая ширина текста (без иконок)
  const [labelW, setLabelW] = useState(0); // ширина активного лейбла (text + paddings)
  const [maxW, setMaxW] = useState(0);     // максимальная ширина среди всех лейблов
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

  // Есть ли вообще хоть одна иконка
  const hasAnyIcon = Array.isArray(icons) && icons.some(Boolean);
  // Слот для иконки (фикс), добавляем только когда пилюля ОТКРЫТА и есть хотя бы одна иконка
  const iconSlot = open && hasAnyIcon ? (iconSize + iconGap) : 0;

  // Итоговая ширина «пилюли»
  const closedWidth = labelW + 2;                                   // +2px страховка
  const openWidth   = Math.max(labelW, maxW) + iconSlot + 2;        // резерв под иконки + буфер
  const pillWidth   = open ? openWidth : closedWidth;

  return (
    <div className={twMerge('h-[44px] relative', className)} aria-live="polite">
      {/* Offscreen-измеритель ширины ЛЕЙБЛОВ (без иконок!) */}
      <div aria-hidden className="absolute opacity-0 pointer-events-none -z-10 top-0 left-0">
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

      {/* Якорь-линия: по центру секции */}
      <div
        className="absolute bottom-0 right-1/2"
        style={{ width: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        {/* Пилюля: правый край приклеен к центру, рост ширины — только влево */}
        <div
          ref={wrapperRef}
          className={twMerge(
            'absolute right-0 bottom-0 z-[45] pointer-events-auto',
            'flex flex-col-reverse',
            'rounded-2xl border border-[--glass-border]',
            'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] shadow-[var(--shadow-s)]',
            'transition-[max-height,width] duration-200 ease-out'
          )}
          style={{
            maxHeight: open ? labelH + listMaxH : labelH || 44,
            width: `${pillWidth}px`,
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
              'w-full relative flex items-center justify-start text-left',
              'px-4 py-2.5',
              'text-[--fg-strong]',
              'hover:bg-white/8 focus:outline-none focus:[box-shadow:var(--ring)]',
            )}
            style={{
                paddingLeft: open && hasAnyIcon ? 16 + (iconSize + iconGap) : 16,
            }}
            aria-expanded={open}
            aria-controls="accordion-pill-list"
          >
            {/* Иконка у активного пункта — только когда ОТКРЫТО и иконки есть */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 -translate-y-1/2"
              style={{
                left: 16,                            // тот же «px-4»
                width: iconSize,
                height: iconSize,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: open && hasAnyIcon && icons?.[active] ? 1 : 0,
                transition: 'opacity 160ms ease-out',
              }}
            >
              {icons?.[active] ?? null}
            </span>
            <span className="whitespace-nowrap">{items[active]}</span>
          </button>

          {/* Контент аккордеона */}
          <div id="accordion-pill-list" className="w-full" aria-hidden={!open}>
            <div
              className={twMerge(needScrollbar ? 'overflow-y-auto' : 'overflow-hidden')}
              style={{ maxHeight: open ? listMaxH : 0, transition: 'max-height 200ms ease-out' }}
              role="listbox"
            >
              {items.map((label, idx) => {
                if (idx === active) return null; // активный в шапке
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { setActive(idx); setOpen(false); }}
                    className={twMerge(
                      'w-full relative flex items-center px-4 text-left',
                      'text-[--fg] hover:bg-white/8 focus:bg-white/8',
                      'focus:outline-none focus:[box-shadow:var(--ring)]'
                    )}
                    role="option"
                    style={{
                      height: rowHeight,
                      // в списке мы всегда в открытом состоянии → сразу резервируем место под иконку
                      paddingLeft: 16 + (hasAnyIcon ? (iconSize + iconGap) : 0),
                    }}
                  >
                    {/* Иконка слева — только когда открыто и иконка есть */}

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: 16,                           // тот же «px-4»
                        width: iconSize,
                        height: iconSize,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: hasAnyIcon && icons?.[idx] ? 1 : 0,
                        transition: 'opacity 160ms ease-out',
                      }}
                    >
                      {icons?.[idx] ?? null}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* /Пилюля */}
      </div>
      {/* /Anchor line */}
    </div>
  );
}

export default AccordionPill;

































// frontend/src/ui/patterns/AccordionPill.jsx

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * AccordionPill — «пилюля», раскрывающаяся вверх.
 *
 * Якорная схема без ограничений ширины:
 * ─ создаём нулевую по ширине опорную линию (anchor) по центру секции: right:50%, width:0;
 * ─ пилюля прижата к правому краю anchor (right:0) ⇒ не может выйти вправо от центра,
 *   ширина растёт только влево. Никаких translate/left-1/2 нет.
 */



 /**
 * ───────────────────────────────────────────────────────────────────────────────
 * Не удалять — Важное!!!
 * AccordionPill — почему текущее решение работает и какие подходы оказались плохими
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * КОРОТКО (суть решения):
 * 1) Создаём «якорь-линию» по центру секции: абсолютный блок с right:50%, width:0, overflow:visible.
 *    Это нулевая по ширине вертикальная линия — геометрическая точка привязки.
 * 2) Пилюля позиционируется внутри якоря: position:absolute; right:0; bottom:0.
 *    ⇒ Правый край пилюли всегда совпадает с линией центра. Изменение width добавляет пиксели ТОЛЬКО влево.
 * 3) Ширину считаем программно: в закрытом состоянии = «естественная» ширина активного лейбла,
 *    в открытом = максимальная среди всех лейблов. Добавляем +2px буфера от субпикселей.
 *
 * ПОЧЕМУ ЭТО РАБОТАЕТ (без костылей):
 * • Привязка идёт не к центру блока (translateX), а к конкретному краю (right:0) внутри точки-якоря.
 * • Якорь нулевой ширины и не ограничивает пилюлю по max-width; overflow:visible у якоря
 *   позволяет пилюле уходить влево сколь угодно (пока родитель не режет слева).
 * • Нет трансформов, зависящих от текущей ширины. Точка привязки — чистый CSS-layout.
 *
 * ЧТО КАЗАЛОСЬ ОЧЕВИДНЫМ, НО ПЛОХО:
 * 1) Центрирование через left:50% + translateX(-50%) (+ «компенсации» extraW).
 *    — Это всегда крепит ЦЕНТР блока к точке. При изменении width блок растёт в обе стороны.
 *    — «Компенсации» через calc(-50% - extraW) хрупки: субпиксели, дрожание на transition, зависимость от измерений.
 *
 * 2) «Левая половина» контейнера (w-1/2) как жёсткая коробка.
 *    — Надёжно удерживает правый край, но вводит ИСКУССТВЕННЫЙ лимит ширины (не шире половины секции),
 *      усложняет верстку и создаёт лишнюю вложенность.
 *
 * 3) Вычислять правый якорь формулой (right = containerW - anchorX).
 *    — Работает, но избыточно: требует ResizeObserver/измерений, порядок эффектов, больше мест сломаться.
 *      То, что решается чистым CSS (right:50% у якоря), не надо переносить в JS.
 *
 * 4) Мерить ширину по offsetWidth у кнопки с w-full или с truncate на тексте.
 *    — w-full даёт ширину контейнера, а не «естественную» ширину текста.
 *    — truncate «подрезает» последний символ и ломает замер.
 *    — Правильно: offscreen-измеритель с теми же паддингами, без truncate; брать scrollWidth.
 *
 * ПРАКТИЧЕСКИЕ ПРАВИЛА:
 * • Нужно «расти только влево/вправо» — привязываем НУЖНЫЙ КРАЙ к опорной точке (right:0 или left:0)
 *   внутри якоря нулевой ширины. Не используем translateX для фиксации края.
 * • Измерения текста — только через offscreen-мерилку (одинаковые шрифты/паддинги), +1–2px буфера.
 * • Следить за родителями: overflow:hidden у внешних контейнеров может обрезать расширение слева —
 *   это уже вопрос макета, не пилюли.
 *
 * РАСШИРЕНИЕ НА БУДУЩЕЕ:
 * • Перенос опорной точки: заменить right:50% у якоря на вычисляемое значение или проп (anchorX/anchorPercent),
 *   сам принцип остаётся тем же (якорь width:0; пилюля right:0).
 *
 * ТРОБЛЬШУТИНГ:
 * • Видите «Главна..» → уберите truncate у активного лейбла, убедитесь в корректном offscreen-замере
 *   и оставьте +2px страховки к width.
 * • Пилюля «лезет вправо» → проверьте: якорь именно right:50%, width:0, пилюля right:0 (без translateX).
 * • Пилюля «режется слева» → ищите overflow:hidden у родителей и/или переносите якорь выше.
 * ───────────────────────────────────────────────────────────────────────────────
 */

export function AccordionPill({
  items = ['Главная', 'О клубе', 'Турниры', 'Рейтинг', 'Галерея'],
  initialIndex = 0,
  rowHeight = 40,   // px
  maxRows = 6,      // визуальный предел высоты списка
  className = '',

  /** Опционально: иконки для пунктов (той же длины, что items).
   *  В закрытом состоянии не показываются; при открытии — появляются слева.
   *  Если не передавать — всё работает как раньше, без иконок.
   */
  icons = null,
  iconSize = 18,     // px: визуальный размер глифа
  iconGap = 8,       // px: отступ между иконкой и текстом
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(initialIndex);

  const labelRef = useRef(null);
  const wrapperRef = useRef(null);

  // Геометрия «шапки»
  const [labelH, setLabelH] = useState(0);

  // Динамическая ширина текста (без иконок)
  const [labelW, setLabelW] = useState(0); // ширина активного лейбла (text + paddings)
  const [maxW, setMaxW] = useState(0);     // максимальная ширина среди всех лейблов
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

  // Есть ли вообще хоть одна иконка
  const hasAnyIcon = Array.isArray(icons) && icons.some(Boolean);
  // Слот для иконки (фикс), добавляем только когда пилюля ОТКРЫТА и есть хотя бы одна иконка
  const iconSlot = open && hasAnyIcon ? (iconSize + iconGap) : 0;

  // Итоговая ширина «пилюли»
  const closedWidth = labelW + 2;                                   // +2px страховка
  const openWidth   = Math.max(labelW, maxW) + iconSlot + 2;        // резерв под иконки + буфер
  const pillWidth   = open ? openWidth : closedWidth;
  const ready = labelW > 0 && maxW > 0;

  return (
    <div className={twMerge('h-[44px] relative', className)} aria-live="polite">
      {/* Offscreen-измеритель ширины ЛЕЙБЛОВ (без иконок!) */}
      <div aria-hidden className="absolute opacity-0 pointer-events-none -z-10 top-0 left-0">
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

      {/* Якорь-линия: по центру секции */}
      <div
        className="absolute bottom-0 right-1/2"
        style={{ width: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        {/* Пилюля: правый край приклеен к центру, рост ширины — только влево */}
        <div
          ref={wrapperRef}
          className={twMerge(
            'absolute right-0 bottom-0 z-[45] pointer-events-auto',
            'flex flex-col-reverse',
            'rounded-2xl border border-[--glass-border]',
            'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] shadow-[var(--shadow-s)]',
            'transition-[max-height,width] duration-200 ease-out'
          )}
          style={{
            maxHeight: open ? labelH + listMaxH : labelH || 44,
            width: `${pillWidth}px`,
            overflow: 'hidden',
            transformOrigin: 'bottom',
            willChange: 'max-height',
            visibility: ready ? 'visible' : 'hidden',
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
              'w-full relative flex items-center justify-start text-left',
              'px-4 py-2.5',
              'text-[--fg-strong]',
              'hover:bg-white/8 focus:outline-none focus:[box-shadow:var(--ring)]',
            )}
            style={{
                paddingLeft: open && hasAnyIcon ? 16 + (iconSize + iconGap) : 16,
            }}
            aria-expanded={open}
            aria-controls="accordion-pill-list"
          >
            {/* Иконка у активного пункта — только когда ОТКРЫТО и иконки есть */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 -translate-y-1/2"
              style={{
                left: 16,                            // тот же «px-4»
                width: iconSize,
                height: iconSize,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: open && hasAnyIcon && icons?.[active] ? 1 : 0,
                transition: 'opacity 160ms ease-out',
              }}
            >
              {icons?.[active] ?? null}
            </span>
            <span className="whitespace-nowrap">{items[active]}</span>
          </button>

          {/* Контент аккордеона */}
          <div id="accordion-pill-list" className="w-full" aria-hidden={!open}>
            <div
              className={twMerge(needScrollbar ? 'overflow-y-auto' : 'overflow-hidden')}
              style={{ maxHeight: open ? listMaxH : 0, transition: 'max-height 200ms ease-out' }}
              role="listbox"
            >
              {items.map((label, idx) => {
                if (idx === active) return null; // активный в шапке
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { setActive(idx); setOpen(false); }}
                    className={twMerge(
                      'w-full relative flex items-center px-4 text-left',
                      'text-[--fg] hover:bg-white/8 focus:bg-white/8',
                      'focus:outline-none focus:[box-shadow:var(--ring)]'
                    )}
                    role="option"
                    style={{
                      height: rowHeight,
                      // в списке мы всегда в открытом состоянии → сразу резервируем место под иконку
                      paddingLeft: 16 + (hasAnyIcon ? (iconSize + iconGap) : 0),
                    }}
                  >
                    {/* Иконка слева — только когда открыто и иконка есть */}

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                      style={{
                        left: 16,                           // тот же «px-4»
                        width: iconSize,
                        height: iconSize,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: hasAnyIcon && icons?.[idx] ? 1 : 0,
                        transition: 'opacity 160ms ease-out',
                      }}
                    >
                      {icons?.[idx] ?? null}
                    </span>
                    <span className="whitespace-nowrap">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* /Пилюля */}
      </div>
      {/* /Anchor line */}
    </div>
  );
}

export default AccordionPill;


