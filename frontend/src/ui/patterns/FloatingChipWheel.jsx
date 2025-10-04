// frontend/src/ui/patterns/FloatingChipWheel.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * FloatingChipWheel — «круговая фишка»-навигация с дуговым свайпом и снапом.
 *
 * Ключевые регулировки (сохраняют прошлый API):
 *  — size (диаметр круга, px)
 *  — radius (радиус дорожки иконок, px)
 *  — centerAngle (градусы активной иконки; иначе — дефолт от dock)
 *  — stepDeg (шаг между иконками; иначе 360/N)
 *  — offset {x,y} (сдвиг центра диска от угла, px)
 *  — iconSize, chipSize (размер глифа и «пятачка» иконки)
 *  — labelOffset {x,y}, labelClassName (позиция/стили подписи)
 *  — dock: 'br'|'bl'|'tr'|'tl'
 *  — hideOnDesktop
 *
 * Жесты:
 *  — enableSwipe (вкл/выкл)
 *  — deadzonePx (порог старта вращения)
 *  — dragToDeg (коэффициент px→deg)
 *
 * UX-решения:
 *  — Полное блокирование скролла под колесом во время жеста (touch-action: none + preventDefault после deadzone)
 *  — Снап к ближайшей иконке при отпускании (без «отката» за счёт pendingIndex)
 *  — Подсветка превью-иконки в процессе перетяжки (previewIndex)
 *  — Без инерции (сделаем позже, чтобы не вносить дрожание)
 */

export function FloatingChipWheel({
  items = [],
  activeId,
  onSelect,
  dock = 'br',

  // Геометрия и размеры
  size = 230,
  radius = 95,
  centerAngle,
  stepDeg,
  offset = { x: -40, y: -25 },

  // Визуал и подпись
  iconSize = 15,
  chipSize = 15,
  labelOffset = { x: -20, y: -22 },
  labelClassName = '',
  className = '',
  hideOnDesktop = true,

  // Жесты
  enableSwipe = true,
  deadzonePx = 6,
  dragToDeg = 0.5,
}) {
  const clean = useMemo(() => items.filter(Boolean), [items]);
  const N = clean.length;
  if (N === 0) return null;

  // Шаг/центр
  const autoStep = 360 / N;
  const step = typeof stepDeg === 'number' ? stepDeg : autoStep;
  const defaultCenter = { br: 215, bl: 325, tr: 145, tl: 35 }[dock] ?? 215;
  const center = typeof centerAngle === 'number' ? centerAngle : defaultCenter;

  // Индекс активного из внешнего мира
  const activeIndexProp = Math.max(0, clean.findIndex((i) => i.id === activeId));

  // pendingIndex позволяет «заморозить» выбранный сектор сразу после окончания жеста,
  // чтобы колесо не «откатывалось» назад, пока onSelect/scroll не обновит activeId.
  const [pendingIndex, setPendingIndex] = useState(null);

  // Временный поворот всей короны иконок (в градусах) во время жеста
  const [angularOffsetDeg, _setAngularOffsetDeg] = useState(0);
  const angleFrameRef = useRef(null);
  const angleTargetRef = useRef(0);

  // previewIndex — какой сектор будет активен, если отпустить сейчас (для подсветки)
  const [previewIndex, setPreviewIndex] = useState(activeIndexProp);

  // dragging/started — управление жестом
  const [dragging, setDragging] = useState(false);
  const startedRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // Блокировка скролла под колесом
  const rootRef = useRef(null);

  // Текущая «база» — откуда считаем геометрию: либо pendingIndex (если уже выбрали),
  // либо внешний activeIndex (когда нет локально зафиксированного выбора)
  const baseIndex = pendingIndex ?? activeIndexProp;

  // Утилиты
  const normIndex = (i) => ((i % N) + N) % N;
  const angleFor = (i, extra = 0) => center + (i - baseIndex) * step + extra;

  // Отрисовка иконки с заданным iconSize
  const renderIcon = (it) => {
    if (it.icon) {
      return React.cloneElement(it.icon, {
        style: { width: iconSize, height: iconSize, ...(it.icon.props?.style || {}) },
        'aria-hidden': true,
      });
    }
    if (it.Icon) {
      return <it.Icon style={{ width: iconSize, height: iconSize }} aria-hidden="true" />;
    }
    return null;
  };

  // RAФ-батчинг для угла — чтобы убрать «двоение» и лишние рендеры
  const setAngularOffsetDeg = (next) => {
    angleTargetRef.current = next;
    if (angleFrameRef.current) return;
    angleFrameRef.current = requestAnimationFrame(() => {
      _setAngularOffsetDeg(angleTargetRef.current);
      angleFrameRef.current = null;
    });
  };

  useEffect(() => () => angleFrameRef.current && cancelAnimationFrame(angleFrameRef.current), []);

  // Когда внешний activeId обновился, если мы были в «локальном выборе» — синхронизируемся
  useEffect(() => {
    if (pendingIndex != null && pendingIndex === activeIndexProp) {
      setPendingIndex(null);
      setAngularOffsetDeg(0); // возвращаем локальный угол к нулю
    }
    // Если pendingIndex != activeIndexProp — ждём, пока доскроллит/догонит
  }, [activeIndexProp, pendingIndex]);

  // Подсчёт превью-индекса по текущему angularOffsetDeg
  useEffect(() => {
    const deltaSteps = Math.round(-angularOffsetDeg / step);
    setPreviewIndex(normIndex(baseIndex + deltaSteps));
  }, [angularOffsetDeg, baseIndex, step]);

  // Блокируем скролл страницы под колесом во время жеста
  // Важное: touch-action: none + preventDefault после deadzone.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // CSS-уровень
    root.style.touchAction = 'none';
    return () => {
      root.style.touchAction = '';
    };
  }, []);

  // Жесты на всём диске (а не только на иконках)
  useEffect(() => {
    if (!enableSwipe) return;
    const root = rootRef.current;
    if (!root) return;

    const onPointerDown = (e) => {
      // Начинаем трекинг, но ПОКА НЕ мешаем скроллу — до прохождения deadzone
      setDragging(true);
      startedRef.current = false;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      root.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;

      const dx = e.clientX - lastPointRef.current.x;
      const dy = e.clientY - lastPointRef.current.y;

      // Геометрия: берём локальную касательную к окружности через текущую точку
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const vx = e.clientX - cx;
      const vy = e.clientY - cy;
      const dist = Math.hypot(vx, vy) || 1;
      const tx = -vy / dist; // касательная (по часовой)
      const ty = vx / dist;

      const proj = dx * tx + dy * ty;

      if (!startedRef.current) {
        if (Math.abs(proj) < deadzonePx) {
          // До deadzone — НЕ вызываем preventDefault, даём странице скроллиться
          lastPointRef.current = { x: e.clientX, y: e.clientY };
          return;
        }
        startedRef.current = true;
      }

      // После deadzone — блокируем скролл жестко
      e.preventDefault?.();

      const deg = proj * dragToDeg;
      setAngularOffsetDeg((prev) => prev + deg);
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      if (!dragging) return;
      setDragging(false);

      // Снап к ближайшей секции
      // 1) сколько шагов мы «накрутили»?
      const totalDeg = angularOffsetDeg;
      const deltaSteps = Math.round(-totalDeg / step); // знак минус — т.к. вращаем «корону»
      if (deltaSteps === 0) {
        // Вернуть угол к 0, если почти не сдвинулись
        setAngularOffsetDeg(0);
        return;
      }

      const nextIndex = normIndex(baseIndex + deltaSteps);

      // 2) Мгновенно доворачиваем UI к центру выбранной секции
      //    (т.е. компенсируем текущий угол до идеального шага)
      const snapTargetDeg = -deltaSteps * step; // куда должен был повернуться angularOffsetDeg
      setAngularOffsetDeg(snapTargetDeg);

      // 3) Фиксируем локально выбор, чтобы не было «отката»,
      //    и дергаем onSelect (скролл секции). Когда activeId догонит —
      //    useEffect выше сбросит pendingIndex и угол в 0.
      setPendingIndex(nextIndex);

      const id = clean[nextIndex]?.id;
      if (id && onSelect) onSelect(id);
    };

    const onPointerCancel = () => {
      setDragging(false);
      // Без снапа — просто возвращаем угол к 0 (ничего не выбрали)
      setAngularOffsetDeg(0);
    };

    root.addEventListener('pointerdown', onPointerDown, { passive: true });
    root.addEventListener('pointermove', onPointerMove, { passive: false });
    root.addEventListener('pointerup', onPointerUp, { passive: false });
    root.addEventListener('pointercancel', onPointerCancel, { passive: false });
    root.addEventListener('pointerleave', onPointerUp, { passive: false });

    return () => {
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerCancel);
      root.removeEventListener('pointerleave', onPointerUp);
    };
  }, [enableSwipe, dragging, deadzonePx, dragToDeg, angularOffsetDeg, baseIndex, step, clean, onSelect]);

  // Кто сейчас считается «активным» с точки зрения подсветки:
  // — во время перетягивания показываем previewIndex
  // — после снапа/клика — pendingIndex (если есть), иначе внешний activeIndexProp
  const visualActiveIndex = dragging ? previewIndex : (pendingIndex ?? activeIndexProp);

  const visibilityClass = hideOnDesktop ? 'sm:hidden' : '';

  return (
    <div
      ref={rootRef}
      className={twMerge(
        'fixed z-50 select-none pointer-events-auto', // перехватываем жесты и клики
        visibilityClass,
        { br: 'bottom-0 right-0', bl: 'bottom-0 left-0', tr: 'top-0 right-0', tl: 'top-0 left-0' }[dock],
        className
      )}
      style={{
        width: size,
        height: size,
        // Смещение центра «фишки» от угла внутрь страницы
        transform: `translate(calc(${(dock === 'br' || dock === 'tr') ? 50 : -50}% + ${(dock === 'br' || dock === 'tr') ? (offset.x ?? 0) : -(offset.x ?? 0)}px),
                             calc(${(dock === 'br' || dock === 'bl') ? 50 : -50}% + ${(dock === 'br' || dock === 'bl') ? (offset.y ?? 0) : -(offset.y ?? 0)}px))`,
        touchAction: 'none', // важный дубль на всякий случай
      }}
      aria-hidden={false}
    >
      {/* Диск / фишка */}
      <div
        className={twMerge(
          'relative rounded-full',
          'bg-[--bg-1]/80 backdrop-blur-[var(--glass-blur)]',
          'border border-[--glass-border]',
          'shadow-[var(--shadow-m)]'
        )}
        style={{ width: size, height: size }}
      >
        {/* Центральная подпись (использует визуально активный индекс) */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translate(${labelOffset.x || 0}px, ${labelOffset.y || 0}px)`,
            pointerEvents: 'none',
          }}
        >
          <div
            className={twMerge(
              'text-center px-4 py-2 rounded-full',
              'bg-white/10 border border-white/15 text-[--fg-strong]',
              labelClassName
            )}
          >
            {clean[visualActiveIndex]?.label}
          </div>
        </div>

        {/* Иконки по окружности (поворот через angularOffsetDeg) */}
        {clean.map((it, i) => {
          const a = angleFor(i, angularOffsetDeg);
          const isActive = i === visualActiveIndex;
          const near =
            Math.abs(i - visualActiveIndex) === 1 ||
            Math.abs(i - visualActiveIndex) === N - 1;

          return (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                // Клик — сразу фиксируем локально и дёргаем onSelect.
                setPendingIndex(i);
                setAngularOffsetDeg(0);
                onSelect?.(it.id);
              }}
              className={twMerge(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'rounded-full',
                'bg-white/10 border border-white/15',
                // Без CSS transition по transform — чтобы не дёргалось во время драга
                isActive ? 'shadow-[var(--shadow-s)]' : ''
              )}
              style={{
                transform: `translate(-50%, -50%) rotate(${a}deg) translate(${radius}px) rotate(${-a}deg)`,
                width: chipSize,
                height: chipSize,
                pointerEvents: 'auto',
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={it.label}
              title={it.label}
            >
              <div
                className={twMerge(
                  'w-full h-full grid place-items-center rounded-full transition-colors',
                  isActive ? 'bg-white/20' : near ? 'bg-white/10' : 'bg-white/5'
                )}
                style={{
                  // Небольшой масштаб активной
                  transform: isActive ? 'scale(1.1)' : undefined,
                }}
              >
                {renderIcon(it)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FloatingChipWheel;
