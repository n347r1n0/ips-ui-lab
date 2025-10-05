// frontend/src/ui/patterns/FloatingChipWheel.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * FloatingChipWheel — круговая навигация с дуговым свайпом, снапом и "визуальной правдой".
 * Устойчивый «шов»: окно строится через floor/frac, актив выбирается с гистерезисом.
 */

export function FloatingChipWheel({
  items = [],
  activeId,
  onSelect,
  dock = 'br',

  // геометрия/визуал
  size = 230,
  radius = 95,
  centerAngle,
  stepDeg,
  offset = { x: -40, y: -25 },
  iconSize = 15,
  chipSize = 15,
  labelOffset = { x: -20, y: -22 },
  labelClassName = '',
  className = '',
  hideOnDesktop = true,

  // жесты/поведение
  enableSwipe = true,
  deadzonePx = 6,
  snapDurationMs = 160,
  showDragIndicator = true,

  // тонкая настройка «шва»
  hysteresis = 0.08, // 0..0.2 — сколько «сдвигать» порог 0.5 шага в сторону последнего направления
}) {
  const clean = useMemo(() => items.filter(Boolean), [items]);
  const N = clean.length;
  if (N === 0) return null;

  const autoStep = 360 / N;
  const step = typeof stepDeg === 'number' ? stepDeg : autoStep;
  const defaultCenter = { br: 215, bl: 325, tr: 145, tl: 35 }[dock] ?? 215;
  const center = typeof centerAngle === 'number' ? centerAngle : defaultCenter;

  const anchor = {
    br: { corner: 'bottom-0 right-0', tx: +1, ty: +1 },
    bl: { corner: 'bottom-0 left-0',  tx: -1, ty: +1 },
    tr: { corner: 'top-0 right-0',    tx: +1, ty: -1 },
    tl: { corner: 'top-0 left-0',     tx: -1, ty: -1 },
  }[dock];
  const translate = `translate(calc(${anchor.tx * 50}% + ${anchor.tx * (offset?.x ?? 0)}px),
                                calc(${anchor.ty * 50}% + ${anchor.ty * (offset?.y ?? 0)}px))`;

  const normDeg = (d) => {
    let x = ((d + 180) % 360 + 360) % 360 - 180;
    return x === -180 ? 180 : x;
  };
  const shortestDelta = (to, from) => normDeg(to - from);
  const snapToStep = (deg) => Math.round(deg / step) * step;

  // rotation — единственный источник правды
  const [rotation, setRotation] = useState(0);
  const rotRef = useRef(0);
  const setRot = (v) => { rotRef.current = v; setRotation(v); };

  // направление последнего движения (для гистерезиса): -1 | 0 | +1
  const lastDirRef = useRef(0);

  // lock внешней синхры на время локального снапа
  const [locked, setLocked] = useState(false);
  const lockTargetIdRef = useRef(null);
  const lockTimerRef = useRef(null);

  // рендер иконки
  const renderIcon = (it) => {
    if (it.icon) {
      return React.cloneElement(it.icon, {
        style: { width: iconSize, height: iconSize, ...(it.icon.props?.style || {}) },
        'aria-hidden': true
      });
    }
    if (it.Icon) return <it.Icon style={{ width: iconSize, height: iconSize }} aria-hidden="true" />;
    return null;
  };

  // анимация rotation → target кратчайшей дугой
  const rafRef = useRef(null);
  const animateRotationTo = (targetDeg, durMs, onDone) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = rotRef.current;
    const delta = shortestDelta(targetDeg, start);

    if (Math.abs(delta) < 0.1 || durMs <= 0) {
      setRot(normDeg(targetDeg));
      onDone?.();
      return;
    }

    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / durMs);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setRot(normDeg(start + delta * eased));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setRot(normDeg(targetDeg));
        onDone?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // устойчивый nearest с гистерезисом
  const nearestStepWithHysteresis = (stepFloat, dir) => {
    // обычный порог 0.5, «сдвигаем» на hysteresis в сторону dir
    const bias = (typeof dir === 'number' ? dir : 0) * hysteresis;
    return Math.floor(stepFloat + 0.5 + bias);
  };

  // клики по иконке

  const selectIndex = (targetIdx) => {
    // найдём ближайший vitок к текущему дробному шагу
    const stepFloat = rotRef.current / step;
    // кандидаты targetIdx + k*N, k ∈ {-1,0,+1}
    let best = targetIdx;
    let bestDist = Infinity;
    for (let k = -1; k <= 1; k++) {
      const cand = targetIdx + k * N;
      const dist = Math.abs(cand - stepFloat);
      if (dist < bestDist) { bestDist = dist; best = cand; }
    }
    const targetRot = best * step;

    setLocked(true);
    const id = clean[((targetIdx % N) + N) % N]?.id || null;
    lockTargetIdRef.current = id;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      setLocked(false);
      lockTargetIdRef.current = null;
    }, 1000);

    animateRotationTo(targetRot, snapDurationMs, () => {
      if (id && id !== activeId) onSelect?.(id);
    });
  };

  // жесты
  const rootRef = useRef(null);
  const draggingRef = useRef(false);
  const startedRef = useRef(false);
  const startAngleRef = useRef(0);
  const startRotRef = useRef(0);

  // page scroll lock
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.touchAction = 'none';
    return () => { root.style.touchAction = ''; };
  }, []);

  useEffect(() => {
    if (!enableSwipe) return;
    const root = rootRef.current;
    if (!root) return;

    let prevBodyTA = '';
    let prevOver = '';
    const lockBody = () => {
      prevBodyTA = document.body.style.touchAction || '';
      prevOver = document.body.style.overscrollBehaviorY || '';
      document.body.style.touchAction = 'none';
      document.body.style.overscrollBehaviorY = 'none';
    };
    const unlockBody = () => {
      document.body.style.touchAction = prevBodyTA;
      document.body.style.overscrollBehaviorY = prevOver;
    };

    const onDown = (e) => {
      if (locked) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      root.setPointerCapture?.(e.pointerId);
      draggingRef.current = true;
      startedRef.current = false;

      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      startAngleRef.current = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
      startRotRef.current = rotRef.current;
      lastDirRef.current = 0;
    };

    const onMove = (e) => {
      if (!draggingRef.current || locked) return;

      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angNow = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;

      let delta = angNow - startAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      delta = -delta; // по часовой — вперёд по ленте

      if (!startedRef.current) {
        if (Math.abs(delta) < deadzonePx) return;
        startedRef.current = true;
        lockBody();
      }

      e.preventDefault?.();

      // направление движения по «ленте»
      lastDirRef.current = Math.sign(delta || 0);

      setRot(normDeg(startRotRef.current + delta));
    };

    const onEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      if (startedRef.current) {
        // дробный шаг в момент отпускания
        const stepFloat = rotRef.current / step;
        // целевой шаг — по устойчивой формуле
        const targetStep = nearestStepWithHysteresis(stepFloat, lastDirRef.current);
        const targetRot = targetStep * step;

        // lock до прихода нужного activeId
        setLocked(true);
        const finalIdx = ((targetStep % N) + N) % N;
        const id = clean[finalIdx]?.id || null;
        lockTargetIdRef.current = id;

        if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
        lockTimerRef.current = setTimeout(() => {
          setLocked(false);
          lockTargetIdRef.current = null;
        }, 1000);

        animateRotationTo(targetRot, snapDurationMs, () => {
          if (id && id !== activeId) onSelect?.(id);
        });
      }

      startedRef.current = false;
      lastDirRef.current = 0; // сброс направления
      unlockBody();
    };

    root.addEventListener('pointerdown', onDown, { passive: true });
    root.addEventListener('pointermove', onMove, { passive: false });
    root.addEventListener('pointerup', onEnd, { passive: false });
    root.addEventListener('pointercancel', onEnd, { passive: false });
    root.addEventListener('pointerleave', onEnd, { passive: false });

    return () => {
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onEnd);
      root.removeEventListener('pointercancel', onEnd);
      root.removeEventListener('pointerleave', onEnd);
    };
  }, [enableSwipe, deadzonePx, snapDurationMs, step, N, clean, activeId, onSelect, locked, hysteresis]);

  // внешняя синхра — только если не locked/не тянем/нет анимации
  useEffect(() => {
    if (locked || rafRef.current) return;
    const targetIdx = Math.max(0, clean.findIndex(it => it.id === activeId));
    if (targetIdx < 0) return;

    // целевой виток — ближайший к текущему дробному
    const stepFloat = rotRef.current / step;
    let best = targetIdx;
    let bestDist = Infinity;
    for (let k = -1; k <= 1; k++) {
      const cand = targetIdx + k * N;
      const dist = Math.abs(cand - stepFloat);
      if (dist < bestDist) { bestDist = dist; best = cand; }
    }
    const targetRot = best * step;
    if (Math.abs(shortestDelta(targetRot, rotRef.current)) > 0.5) {
      animateRotationTo(targetRot, snapDurationMs);
    }
  }, [activeId, clean, step, snapDurationMs, locked]);

  // если залочены и пришёл наш id — снимаем лок
  useEffect(() => {
    if (!locked) return;
    if (lockTargetIdRef.current && activeId === lockTargetIdRef.current) {
      setLocked(false);
      lockTargetIdRef.current = null;
      if (lockTimerRef.current) { clearTimeout(lockTimerRef.current); lockTimerRef.current = null; }
    }
  }, [activeId, locked]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
  }, []);

  // ОКНО ИКОНОК (бесшовно): floor & frac
  const visibleIcons = useMemo(() => {
    const stepFloat = rotRef.current / step;
    const base = Math.floor(stepFloat);
    const frac = stepFloat - base; // [0..1)
    const arr = [];

    for (let offset = -2; offset <= 2; offset++) {
      const logicalStep = base + offset;
      const idx = ((logicalStep % N) + N) % N;
      const angle = center + (offset - frac) * step; // = center + (logicalStep - stepFloat)*step
      arr.push({
        key: `${clean[idx].id}:${logicalStep}`,
        idx,
        angle,
      });
    }
    return arr;
  }, [rotation, step, center, N, clean]);

  // ТЕКУЩИЙ АКТИВ по устойчивой формуле (для подписи/подсветки)
  const currentIndex = useMemo(() => {
    const stepFloat = rotRef.current / step;
    const nearest = nearestStepWithHysteresis(stepFloat, lastDirRef.current);
    return ((nearest % N) + N) % N;
  }, [rotation, step, N]);

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
      style={{ width: size, height: size, transform: translate }}
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
        {/* Подпись — по устойчивому currentIndex */}
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
            {clean[currentIndex]?.label}
          </div>
        </div>

        {/* Иконки — бесшовная лента */}
        {visibleIcons.map(({ key, idx, angle }) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={key}
              type="button"
              onClick={() => { if (!locked) selectIndex(idx); }}
              className={twMerge(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'rounded-full',
                isActive ? 'shadow-[var(--shadow-s)]' : ''
              )}
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`,
                width: chipSize,
                height: chipSize,
                pointerEvents: 'auto',
                willChange: 'transform',
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={clean[idx].label}
              title={clean[idx].label}
            >
              <div
                className={twMerge(
                  'w-full h-full grid place-items-center rounded-full transition-colors',
                  isActive ? 'bg-white/20 border border-white/15' : 'bg-transparent'
                )}
              >
                {renderIcon(clean[idx])}
              </div>
            </button>
          );
        })}

        {/* Индикатор при активном драге */}
        {showDragIndicator && draggingRef.current && startedRef.current && (
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${center - 45}deg,
                transparent,
                rgba(212,175,55,0.12) ${center - 20}deg,
                rgba(212,175,55,0.22) ${center}deg,
                rgba(212,175,55,0.12) ${center + 20}deg,
                transparent)`
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

export default FloatingChipWheel;
