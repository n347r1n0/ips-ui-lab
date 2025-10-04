// frontend/src/ui/patterns/FloatingChipWheel.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

function normalizeDeg(d) {
  let x = d;
  while (x > 180) x -= 360;
  while (x < -180) x += 360;
  return x;
}
function wrapIndex(i, n) {
  return ((i % n) + n) % n;
}

export function FloatingChipWheel({
  items = [],
  activeId,
  onSelect,
  dock = 'br',

  // размеры/геометрия
  size = 230,
  radius = 95,
  centerAngle,
  stepDeg,
  offset = { x: -40, y: -25 },

  // графика
  iconSize = 15,
  chipSize = 15,

  // подпись
  labelOffset = { x: -20, y: -22 },
  labelClassName = '',

  // поведение/прочее
  hideOnDesktop = true,
  className = '',

  // свайп (упрощённый, предсказуемый)
  deadzoneDeg = 5,      // порог старта вращения (в градусах)
  dragGain = 1.0,       // чувствительность вращения
  showDragIndicator = true,
}) {
  const clean = useMemo(() => items.filter(Boolean), [items]);
  if (clean.length === 0) return null;

  const activeIndex = Math.max(0, clean.findIndex(i => i.id === activeId));
  const autoStep = 360 / clean.length;
  const step = typeof stepDeg === 'number' ? stepDeg : autoStep;

  const defaultCenter = { br: 215, bl: 325, tr: 145, tl: 35 }[dock] ?? 215;
  const center = typeof centerAngle === 'number' ? centerAngle : defaultCenter;

  const angleFor = (i, extra = 0) => center + (i - activeIndex) * step + extra;

  // позиционирование в углу + сдвиг внутрь
  const anchor = {
    br: { corner: 'bottom-0 right-0', tx:  1, ty:  1 },
    bl: { corner: 'bottom-0 left-0',  tx: -1, ty:  1 },
    tr: { corner: 'top-0 right-0',    tx:  1, ty: -1 },
    tl: { corner: 'top-0 left-0',     tx: -1, ty: -1 },
  }[dock];
  const translate = `translate(calc(${anchor.tx * 50}% + ${anchor.tx * (offset?.x ?? 0)}px),
                                calc(${anchor.ty * 50}% + ${anchor.ty * (offset?.y ?? 0)}px))`;

  // рендер иконки
  const renderIcon = (it) => {
    if (it.icon) {
      return React.cloneElement(it.icon, {
        style: { width: iconSize, height: iconSize, ...(it.icon.props?.style || {}) },
        'aria-hidden': true,
      });
    }
    if (it.Icon) return <it.Icon style={{ width: iconSize, height: iconSize }} aria-hidden="true" />;
    return null;
  };

  // состояние свайпа
  const rootRef = useRef(null);
  const [angularOffsetDeg, setAngularOffsetDeg] = useState(0);
  const rotatingRef = useRef(false);
  const pointerDownRef = useRef(false);
  const startAngleRef = useRef(0);
  const lastAngleRef = useRef(0);

  const getTouchAngleDeg = (x, y) => {
    const root = rootRef.current;
    if (!root) return 0;
    const r = root.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return Math.atan2(y - cy, x - cx) * (180 / Math.PI);
  };

  // «пончик» — зона для свайпа
  const isInDonut = (x, y) => {
    const root = rootRef.current;
    if (!root) return false;
    const r = root.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = x - cx, dy = y - cy;
    const dist = Math.hypot(dx, dy);
    const R = size / 2;
    return dist >= R * 0.35 && dist <= R * 0.98;
  };

  // снап к ближайшей секции
  const snapToNearest = () => {
    const n = clean.length;
    if (n === 0) return;

    const stepsFloat = angularOffsetDeg / step;
    const steps = Math.round(stepsFloat);
    if (steps !== 0) {
      const targetIdx = wrapIndex(activeIndex - steps, n);
      const target = clean[targetIdx];
      if (target?.id) onSelect?.(target.id);
    }
    setAngularOffsetDeg(0);
  };

  // слушатели — только на корневом круге, без глобалей
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerDown = (e) => {
      // мгновенно блокируем нативный скролл на самом колесе
      // (touch-action: none уже стоит на контейнере, но preventDefault усиливает)
      if (!isInDonut(e.clientX, e.clientY)) return;

      pointerDownRef.current = true;
      rotatingRef.current = false;

      const a = getTouchAngleDeg(e.clientX, e.clientY);
      startAngleRef.current = a;
      lastAngleRef.current = a;

      // важно: остановить нативный скролл до его старта
      e.preventDefault?.();
      try { root.setPointerCapture?.(e.pointerId); } catch {}
    };

    const onPointerMove = (e) => {
      if (!pointerDownRef.current) return;

      const ang = getTouchAngleDeg(e.clientX, e.clientY);
      const fromStart = normalizeDeg(ang - startAngleRef.current);

      if (!rotatingRef.current) {
        if (Math.abs(fromStart) >= deadzoneDeg) {
          rotatingRef.current = true;
        } else {
          return; // ещё dead-zone — даём шанс клику
        }
      }

      let d = normalizeDeg(ang - lastAngleRef.current);
      const add = d * dragGain;
      setAngularOffsetDeg(prev => prev + add);
      lastAngleRef.current = ang;

      // блокируем прокрутку уверенно, без Intervention (touch-action: none помогает)
      e.preventDefault?.();
    };

    const onPointerUp = () => {
      if (rotatingRef.current) {
        snapToNearest();
      }
      pointerDownRef.current = false;
      rotatingRef.current = false;
      try { root.releasePointerCapture?.(); } catch {}
    };

    const onPointerCancel = () => {
      pointerDownRef.current = false;
      rotatingRef.current = false;
      try { root.releasePointerCapture?.(); } catch {}
      setAngularOffsetDeg(0); // мягкий откат
    };

    root.addEventListener('pointerdown', onPointerDown, { passive: false });
    root.addEventListener('pointermove', onPointerMove, { passive: false });
    root.addEventListener('pointerup', onPointerUp, { passive: false });
    root.addEventListener('pointercancel', onPointerCancel, { passive: false });

    return () => {
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [deadzoneDeg, dragGain, step, clean.length, activeIndex, angularOffsetDeg]);

  const visibilityClass = hideOnDesktop ? 'sm:hidden' : '';

  return (
    <div
      ref={rootRef}
      className={twMerge(
        'fixed z-50 select-none pointer-events-auto',
        visibilityClass,
        anchor.corner,
        className
      )}
      style={{
        width: size,
        height: size,
        transform: translate,
        // критично: **навсегда** запрещаем нативный пан/зум на колесе
        touchAction: 'none',
        // не отдаём скролл за пределы
        overscrollBehavior: 'contain',
      }}
      aria-hidden={false}
    >
      <div
        className={twMerge(
          'relative rounded-full',
          'bg-[--bg-1]/80 backdrop-blur-[var(--glass-blur)]',
          'border border-[--glass-border]',
          'shadow-[var(--shadow-m)]'
        )}
        style={{ width: size, height: size }}
      >
        {/* подпись активной секции */}
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
            {clean[activeIndex]?.label}
          </div>
        </div>

        {/* иконки */}
        {clean.map((it, i) => {
          const a = angleFor(i, angularOffsetDeg);
          const isActive = i === activeIndex;
          const near =
            Math.abs(i - activeIndex) === 1 ||
            Math.abs(i - activeIndex) === clean.length - 1;

          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onSelect?.(it.id)}
              className={twMerge(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'rounded-full bg-white/10 border border-white/15',
                'transition-all duration-150',
                isActive ? 'scale-110 shadow-[var(--shadow-s)]' : 'opacity-80'
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
                  'w-full h-full grid place-items-center rounded-full',
                  isActive ? 'bg-white/20' : near ? 'bg-white/10' : 'bg-white/5'
                )}
              >
                {renderIcon(it)}
              </div>
            </button>
          );
        })}

        {/* индикатор дуги при реальном вращении */}
        {showDragIndicator && rotatingRef.current && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${center - 45}deg,
                transparent,
                rgba(212,175,55,0.15) ${center - 20}deg,
                rgba(212,175,55,0.25) ${center}deg,
                rgba(212,175,55,0.15) ${center + 20}deg,
                transparent)`,
              pointerEvents: 'none',
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

export default FloatingChipWheel;
