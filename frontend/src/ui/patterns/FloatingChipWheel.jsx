// frontend/src/ui/patterns/FloatingChipWheel.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * FloatingChipWheel — круговая навигация с дуговым свайпом и снапом.
 *
 * ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ:
 *  • Во время жеста «правда» = snapCandidateRef (то, что на экране).
 *  • При отпускании «правда» коммитится в committedStepRef и колесо лишь доснапивается.
 *  • Никаких повторных пересчётов «что выбрать» после отпускания — берём то, что уже показано.
 *  • Внешняя синхронизация игнорируется пока идёт наше взаимодействие/снап/небольшая пауза.
 *
 * Геометрия:
 *  • Логика в шагах: stepF — дробный логический шаг (без нормализации).
 *  • Рендер: angle = center + (logicalStep - stepF) * stepDeg.
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
  deadzonePx = 6,           // в градусах — порог для старта драга
  snapDurationMs = 160,
  showDragIndicator = true,
}) {
  const clean = useMemo(() => items.filter(Boolean), [items]);
  const N = clean.length;
  if (N === 0) return null;

  // Шаг в градусах
  const autoStep = 360 / N;
  const step = typeof stepDeg === 'number' ? stepDeg : autoStep;

  // Центральный угол
  const defaultCenter = { br: 215, bl: 325, tr: 145, tl: 35 }[dock] ?? 215;
  const center = typeof centerAngle === 'number' ? centerAngle : defaultCenter;

  // Позиционирование виджета
  const anchor = {
    br: { corner: 'bottom-0 right-0', tx: +1, ty: +1 },
    bl: { corner: 'bottom-0 left-0',  tx: -1, ty: +1 },
    tr: { corner: 'top-0 right-0',    tx: +1, ty: -1 },
    tl: { corner: 'top-0 left-0',     tx: -1, ty: -1 },
  }[dock];

  const translate = `translate(calc(${anchor.tx * 50}% + ${anchor.tx * (offset?.x ?? 0)}px),
                                calc(${anchor.ty * 50}% + ${anchor.ty * (offset?.y ?? 0)}px))`;

  // ───────────────────────────────────────────────────────────────────────────────
  // Источник правды — stepF (дробный логический шаг)
  const [stepFState, setStepFState] = useState(0);
  const stepF = useRef(0);
  const setStepF = (v) => { stepF.current = v; setStepFState(v); };

  // Кандидат (то, что пользователь видит во время драга) и коммит после отпускания
  const snapCandidateRef = useRef(0);      // ближайший целочисленный шаг «под пальцем»
  const committedStepRef = useRef(null);   // зафиксированный шаг на время снапа

  // Ввод/анимация
  const rootRef = useRef(null);
  const draggingRef = useRef(false);
  const startedRef = useRef(false);
  const startAngleRef = useRef(0);
  const startStepRef = useRef(0);

  const rafRef = useRef(null);
  const [animating, setAnimating] = useState(false);

  // Лок внешней синхры на ожидаемый id + «settle»-пауза после снапа
  const lockTargetIdRef = useRef(null);
  const lockTimerRef = useRef(null);
  const interactionLockRef = useRef(false);
  const interactionTimerRef = useRef(null);
  const settleMs = 250; // пауза, чтобы IO не «щёлкал» на шве

  // Единая функция дискретизации шага для подписи/подсветки
  const pickStep = (s) => Math.round(s);

  // ───────────────────────────────────────────────────────────────────────────────
  // Анимация к целевому логическому шагу
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
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
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

  // Снап к указанному ВИТКУ (logicalStep): коммит + внешний скролл + визуальный доезд
  const snapTo = (logicalStep) => {
    // 1) Коммит визуальной правды (то, что увидел пользователь)
    committedStepRef.current = logicalStep;

    // 2) Жёстко локируем внешнюю синхру на нужный id
    const id = clean[((logicalStep % N) + N) % N]?.id || null;
    lockTargetIdRef.current = id;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      lockTargetIdRef.current = null;
      lockTimerRef.current = null;
    }, 1200);

    // 3) Лочим внешнюю обратную связь на время анимации + settle
    interactionLockRef.current = true;
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);

    // 4) Сразу говорим странице, куда скроллить (наружу)
    if (id && id !== activeId) onSelect?.(id);

    // 5) Колесо визуально доснапивается к коммиту
    animateStepTo(logicalStep, snapDurationMs, () => {
      interactionTimerRef.current = setTimeout(() => {
        interactionLockRef.current = false;
        committedStepRef.current = null; // отпускаем «заморозку»
        interactionTimerRef.current = null;
      }, settleMs);
    });
  };

  // ───────────────────────────────────────────────────────────────────────────────
  // Блокировка скролла страницы при перетаскивании
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.style.touchAction = 'none';
    return () => { root.style.touchAction = ''; };
  }, []);

  // Жесты
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

      // начальный кандидат = то, что видно сейчас
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
      snapCandidateRef.current = pickStep(nextStepF); // это и есть «что видит пользователь»
    };

    const onEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      if (startedRef.current) {
        // НИКАКИХ пересчётов: берём то, что уже было показано пользователю
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

  // ───────────────────────────────────────────────────────────────────────────────
  // Внешняя синхронизация с activeId:
  // • Полностью игнорим пока interactionLockRef/animating активны.
  // • Если ждём конкретный id — обрабатываем только его подтверждение.
  useEffect(() => {
    if (interactionLockRef.current || animating) return;

    if (lockTargetIdRef.current) {
      if (activeId === lockTargetIdRef.current) {
        // подтверждение получено — снимаем лок
        lockTargetIdRef.current = null;
        if (lockTimerRef.current) { clearTimeout(lockTimerRef.current); lockTimerRef.current = null; }
      } else {
        return; // всё ещё ждём наш id
      }
    }

    const targetIdx = clean.findIndex(it => it.id === activeId);
    if (targetIdx < 0) return;

    // Подводим колесо к ближайшему витку этого индекса
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
      // На время внешнего автоподвода НЕ коммитим — коммит только из ввода пользователя
    }
  }, [activeId, clean, N, snapDurationMs, animating]);

  // Очистка
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  // ───────────────────────────────────────────────────────────────────────────────
  // Окно иконок (бесшовно) через floor в пространстве шагов
  const visibleIcons = useMemo(() => {
    const base = Math.floor(stepF.current);
    const arr = [];

    for (let offset = -2; offset <= 2; offset++) {
      const logicalStep = base + offset;
      const idx = ((logicalStep % N) + N) % N;
      const angle = center + (logicalStep - stepF.current) * step; // == center + (offset - frac)*step
      arr.push({
        key: `${clean[idx].id}:${logicalStep}`,
        idx,
        angle,
        logicalStep,
      });
    }
    return arr;
  }, [stepFState, step, center, N, clean]);

  // Текущий актив: приоритет — коммит, затем кандидат, затем ближайший к stepF
  const currentIndex = useMemo(() => {
    const refStep =
      (committedStepRef.current !== null)
        ? committedStepRef.current
        : (draggingRef.current ? snapCandidateRef.current : pickStep(stepF.current));
    return ((refStep % N) + N) % N;
  }, [stepFState, N]);

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
        {/* Подпись — читает коммит/кандидат/nearest в указанном порядке */}
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
        {visibleIcons.map(({ key, idx, angle, logicalStep }) => {
          const isActive = idx === currentIndex;
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
