// frontend/src/ui/patterns/FloatingChipWheel.jsx

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { pokerSkin } from '@/ui/skins/wheels/pokerSkin';

/**
 * FloatingChipWheel — круговая навигация с дуговым свайпом и снапом.
 *
 * ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ:
 *  • Во время жеста «правда» = snapCandidateRef (то, что на экране).
 *  • Отпустили палец — коммитим committedStepRef и колесо доснапивается.
 *  • Внешняя синхронизация игнорируется, пока идёт взаимодействие/анимация/settle.
 *
 * Угол иконки: angle = center + (logicalStep - stepF) * stepDeg.
 */

export function FloatingChipWheel({
  // ───────────────────────────────────────────────────────────────
  // 📦 ДАННЫЕ / API
  items = [],           // массив { id, label, icon | Icon }
  activeId,             // id активной секции (внешняя правда страницы)
  onSelect,             // (id) => void — сообщаем наружу выбор шага

  // ───────────────────────────────────────────────────────────────
  // 📍 РАЗМЕЩЕНИЕ
  dock = 'br',          // 'br' | 'bl' | 'tr' | 'tl'
  offset = { x: -36, y: -15 }, // смещение фишки от угла (px)
  hideOnDesktop = true, // скрывать на ≥sm
  className = '',       // доп. классы контейнера

  // ───────────────────────────────────────────────────────────────
  // 📐 ГЕОМЕТРИЯ / ВИЗУАЛ
  size = 230,           // ⌀ фишки (px)
  radius = 99,          // радиус дорожки иконок (px)
  centerAngle,          // угол «центра» (deg); если не задан — из dock
  stepDeg,              // шаг между иконками (deg); иначе 360/N
  iconSize = 17,        // размер глифа иконки (px)
  chipSize = 25,        // размер слота иконки (px)
  labelOffset = { x: -12, y: -18 }, // смещение подписи от гео-центра (px)
  labelClassName = '',  // доп. классы подписи

  // ───────────────────────────────────────────────────────────────
  // ✋ ЖЕСТЫ / ПОВЕДЕНИЕ
  enableSwipe = true,   // включить свайп по дуге
  deadzonePx = 6,       // порог старта драга (deg)
  snapDurationMs = 160, // длительность «доводки» (ms)
  showDragIndicator = true, // дуга при перетягивании (для простых скинов)

  // ───────────────────────────────────────────────────────────────
  // 🎨 СКИН
  skin = 'poker',       // 'glass' | 'poker'
  skinProps = {},       // параметры скина (цвета/ширины/центр/акцент активной иконки и пр.)
}) {
  // ───────────────────────────────────────────────────────────────
  // Подготовка данных
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

  // ───────────────────────────────────────────────────────────────
  // Источник правды — stepF (дробный шаг)
  const [stepFState, setStepFState] = useState(0);
  const stepF = useRef(0);
  const setStepF = (v) => { stepF.current = v; setStepFState(v); };

  const snapCandidateRef = useRef(0);    // ближайший целый «под пальцем»
  const committedStepRef = useRef(null); // зафиксированный шаг на время снапа

  // Ввод/анимация
  const rootRef = useRef(null);
  const draggingRef = useRef(false);
  const startedRef = useRef(false);
  const startAngleRef = useRef(0);
  const startStepRef = useRef(0);

  const rafRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  // Лок внешней синхры на ожидаемый id + settle-пауза
  const lockTargetIdRef = useRef(null);
  const lockTimerRef = useRef(null);
  const interactionLockRef = useRef(false);
  const interactionTimerRef = useRef(null);
  const settleMs = 250;

  const pickStep = (s) => Math.round(s);

  // ───────────────────────────────────────────────────────────────
  // Анимация
  const animateStepTo = (targetStep, durMs, onDone) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = stepF.current;
    const delta = targetStep - start;

    if (Math.abs(delta) < 1e-3 || durMs <= 0) {
      setStepF(targetStep);
      onDone?.();
      return;
    }

    setAnimating(true);
    const t0 = performance.now();

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / durMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setStepF(start + delta * eased);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setStepF(targetStep);
        setAnimating(false);
        onDone?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const snapTo = (logicalStep) => {
    committedStepRef.current = logicalStep;

    const id = clean[((logicalStep % N) + N) % N]?.id || null;
    lockTargetIdRef.current = id;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      lockTargetIdRef.current = null;
      lockTimerRef.current = null;
    }, 1200);

    interactionLockRef.current = true;
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);

    if (id && id !== activeId) onSelect?.(id);

    animateStepTo(logicalStep, snapDurationMs, () => {
      interactionTimerRef.current = setTimeout(() => {
        interactionLockRef.current = false;
        committedStepRef.current = null;
        interactionTimerRef.current = null;
      }, settleMs);
    });
  };

  // ───────────────────────────────────────────────────────────────
  // Жесты
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
      if (animating) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      root.setPointerCapture?.(e.pointerId);
      draggingRef.current = true;
      startedRef.current = false;

      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      startAngleRef.current = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
      startStepRef.current = stepF.current;

      snapCandidateRef.current = pickStep(stepF.current);
    };

    const onMove = (e) => {
      if (!draggingRef.current || animating) return;

      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angNow = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;

      let deltaDeg = angNow - startAngleRef.current;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;

      // по часовой — вперёд по ленте
      deltaDeg = -deltaDeg;

      if (!startedRef.current) {
        if (Math.abs(deltaDeg) < deadzonePx) return;
        startedRef.current = true;
        lockBody();
      }

      e.preventDefault?.();

      const deltaStep = deltaDeg / step;
      const nextStepF = startStepRef.current + deltaStep;

      setStepF(nextStepF);
      snapCandidateRef.current = pickStep(nextStepF);
    };

    const onEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      if (startedRef.current) {
        const targetStep = snapCandidateRef.current;
        snapTo(targetStep);
      }

      startedRef.current = false;
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
  }, [enableSwipe, deadzonePx, snapDurationMs, step, N, clean, activeId, onSelect, animating]);

  // ───────────────────────────────────────────────────────────────
  // Внешняя синхронизация
  useEffect(() => {
    if (interactionLockRef.current || animating) return;

    if (lockTargetIdRef.current) {
      if (activeId === lockTargetIdRef.current) {
        lockTargetIdRef.current = null;
        if (lockTimerRef.current) { clearTimeout(lockTimerRef.current); lockTimerRef.current = null; }
      } else {
        return;
      }
    }

    const targetIdx = clean.findIndex(it => it.id === activeId);
    if (targetIdx < 0) return;

    const s = stepF.current;
    let best = targetIdx;
    let bestDist = Infinity;
    for (let k = -1; k <= 1; k++) {
      const cand = targetIdx + k * N;
      const dist = Math.abs(cand - s);
      if (dist < bestDist) { bestDist = dist; best = cand; }
    }

    if (bestDist > 1e-3) {
      animateStepTo(best, snapDurationMs);
    }
  }, [activeId, clean, N, snapDurationMs, animating]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  // ───────────────────────────────────────────────────────────────
  // Окно иконок
  const visibleIcons = useMemo(() => {
    const base = Math.floor(stepF.current);
    const arr = [];
    for (let offset = -2; offset <= 2; offset++) {
      const logicalStep = base + offset;
      const idx = ((logicalStep % N) + N) % N;
      const angle = center + (logicalStep - stepF.current) * step;
      arr.push({ key: `${clean[idx].id}:${logicalStep}`, idx, angle, logicalStep });
    }
    return arr;
  }, [stepFState, step, center, N, clean]);

  const currentIndex = useMemo(() => {
    const refStep =
      (committedStepRef.current !== null)
        ? committedStepRef.current
        : (draggingRef.current ? snapCandidateRef.current : Math.round(stepF.current));
    return ((refStep % N) + N) % N;
  }, [stepFState, N]);

  // Геометрия для скина
  const base = Math.floor(stepF.current);
  const frac = stepF.current - base;
  const geometry = {
    size,
    radius,
    center,
    stepDeg: step,
    stepF: stepF.current,
    base,
    frac,
    currentIndex,
    items: clean,
  };

  const skinImpl =
    skin === 'poker'
      ? pokerSkin
      : {
          beforeIcons: () => null,
          afterIcons: () => null,
          CenterLabelWrap: (_g, _p, children) => (
            <div className="bg-white/10 border border-white/15 rounded-full">{children}</div>
          ),
          decorateIcon: (node/*, ctx*/) => node,
        };

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

  const visibilityClass = hideOnDesktop ? 'sm:hidden' : '';

  return (
    <div
      ref={rootRef}
      className={twMerge('fixed z-50 select-none pointer-events-auto', visibilityClass, anchor.corner, className)}
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
        {/* skin: фон/обод/клинья до иконок */}
        {skinImpl.beforeIcons?.(geometry, skinProps)}

        {/* Подпись — через скин (он обрамит центром) */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) translate(${labelOffset.x || 0}px, ${labelOffset.y || 0}px)`,
            pointerEvents: 'none',
          }}
        >
          {skinImpl.CenterLabelWrap
            ? skinImpl.CenterLabelWrap(
                geometry,
                skinProps,
                <div className={twMerge('text-center px-4 py-2 rounded-full text-[--fg-strong]', labelClassName)}>
                  {clean[currentIndex]?.label}
                </div>
              )
            : (
                <div className={twMerge('text-center px-4 py-2 rounded-full text-[--fg-strong]', labelClassName)}>
                  {clean[currentIndex]?.label}
                </div>
              )}
        </div>

        {/* Иконки — бесшовная лента c декорацией скина */}
        {visibleIcons.map(({ key, idx, angle, logicalStep }) => {
          const isActive = idx === currentIndex;

          const iconNode = (
            <div
              className={twMerge(
                'w-full h-full grid place-items-center rounded-full transition-transform',
                isActive ? 'scale-[1.06]' : ''
              )}
            >
              {renderIcon(clean[idx])}
            </div>
          );

          return (
            <button
              key={key}
              type="button"
              onClick={() => { if (!animating && !draggingRef.current) snapTo(logicalStep); }}
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
              {skinImpl.decorateIcon
                ? skinImpl.decorateIcon(iconNode, { isActive, geometry, skinProps })
                : iconNode}
            </button>
          );
        })}

        {/* skin: поверх иконок */}
        {skinImpl.afterIcons?.(geometry, skinProps)}

        {/* Индикатор при активном драге (в poker-скине не нужен) */}
        {showDragIndicator && draggingRef.current && startedRef.current && skin !== 'poker' && (
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
