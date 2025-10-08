// frontend/src/ui/skins/wheels/pokerSkin.jsx
import React from 'react';

/**
 * Poker-chip skin (стеклянные клинья + центр «чашка»)
 *
 * Принципы:
 *  • Никакой логики жестов — только отрисовка слоёв поверх двигателя колеса.
 *  • Визуальные клинья рисуем одним repeating-conic-gradient, БЕЗ поштучных DOM-нод.
 *  • Фаза узора синхронизирована с иконками: phase = center + phaseDeg − stepF*stepDeg.
 *  • Маска кольца единая, «шва» нет: ничего не дорисовывается/не мигает в зоне видимости.
 *  • Центр-«чашка» строго по центру колеса и НЕ перекрывает подпись (лейбл идёт поверх).
 *
 * API (skinProps):
 *  — Геометрия кольца:
 *      rimWidth         : px — ширина обода (кольца) от внешнего края к центру (default 26)
 *      gapDeg           : deg — ширина тонкого разделителя между клиньями (default 2)
 *      wedgeFillDeg     : deg — фактическая ширина «заливки» клина (по умолчанию stepDeg - gapDeg)
 *      phaseDeg         : deg — тонкая подстройка совмещения клиньев с иконками (default 0)
 *
 *  — «Стекло» (под узором):
 *      blurPx           : px — размытие backdropFilter
 *      saturate         : number — насыщенность
 *      brighten         : number — яркость
 *      tintAlphaRed     : 0..1 — интенсивность красного стекла
 *      tintAlphaIvory   : 0..1 — интенсивность светлого стекла
 *
 *  — Разделители:
 *      showGaps         : boolean — рисовать ли тонкие разделители поверх узора
 *      gapAlpha         : 0..1 — прозрачность разделителей
 *
 *  — Цвета (токены приветствуются):
 *      red              : css-color — базовый красный (будет превращен в полупрозрачный tint)
 *      ivory            : css-color — светлый стеклянный
 *      baseDark/baseDark2: css-color — подложка диска под кольцом
 *
 *  — Центр («чашка»):
 *      cupEnabled       : boolean — рисовать ли центр
 *      cupDiameterPct   : 0..1 — диаметр чашки относительно size (default 0.34)
 *      cupRimThicknessPx: px — толщина кромки чашки (default 6)
 *      cupRimColor      : css-color — цвет кромки (например, var(--metal-gold) / var(--metal-silver))
 *      cupRimGlow       : 0..1 — лёгкое свечение кромки
 *      cupFillPreset    : 'glass-dark' | 'glass-light' | 'metal-silver' | 'custom'
 *      cupFill          : css-gradient — если preset='custom'
 *      cupInnerShadow   : css-box-shadow — внутренняя тень чашки
 *
 *  — Эмблема/розетка в чашке:
 *      emblemEnabled        : boolean
 *      emblemSVG            : string — ваш SVG-контент (БЕЗ <svg> оболочки); берёт цвет из currentColor
 *      emblemOpacity        : 0..1
 *      emblemColor          : css-color
 *      emblemStroke         : px
 *      emblemScalePct       : 0..1 — размер эмблемы относительно диаметра чашки
 *      emblemCount          : number — кол-во лучей для дефолтной «розетки»
 *      emblemInnerRadiusPct : 0..1 — внутренний радиус для лучей (viewBox=24)
 *      emblemOuterRadiusPct : 0..1 — внешний радиус для лучей (viewBox=24)
 */

export const pokerSkin = {
  beforeIcons(geom, props = {}) {
    const { size, center, stepDeg, stepF } = geom;

    // ─────────────────────────────────────────────────────────────
    // Defaults (все управляемые, но с вменяемыми значениями)
    const {
      // геометрия
      rimWidth = 80,
      gapDeg = 2,
      wedgeFillDeg = null,
      phaseDeg = 0,

      // стекло
      blurPx = 8,
      saturate = 1.12,
      brighten = 1.04,
      tintAlphaRed = 0.46,
      tintAlphaIvory = 0.20,

      // разделители
      showGaps = true,
      gapAlpha = 0.28,

      // цвета
      red = 'color-mix(in oklab, var(--brand-crimson, #EE2346) 78%, black)',
      ivory = 'color-mix(in oklab, white 92%, var(--bg-0, #0B0D12) 8%)',

      // базовый диск
      showBase = true,
      baseDark = 'var(--bg-2, #141A22)',
      baseDark2 = 'var(--bg-0, #0B0D12)',

      // центр («чашка»)
      cupEnabled = true,
      cupDiameterPct = 0.64,     // диаметр чашки = 34% от size
      cupRimThicknessPx = 6,     // толщина кромки, px
      cupRimColor = 'var(--metal-gold, #D4AF37)',
      cupRimGlow = 0.30,         // интенсивность свечения кромки
      cupFillPreset = 'glass-dark', // пресеты: glass-dark | glass-light | metal-silver | custom
      cupFill = 'radial-gradient(70% 65% at 50% 40%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 38%, rgba(0,0,0,0.65) 100%)',
      cupInnerShadow = 'inset 0 8px 20px rgba(0,0,0,0.55)',

      // эмблема/розетка
      emblemEnabled = false,
      emblemSVG = null,
      emblemOpacity = 0.55,
      emblemColor = 'var(--metal-gold, #D4AF37)',
      emblemStroke = 1.4,
      emblemScalePct = 0.72,
      emblemCount = 8,
      emblemInnerRadiusPct = 0.26,
      emblemOuterRadiusPct = 0.42,
    } = props;

    // ─────────────────────────────────────────────────────────────
    // Удобные сокращения
    const outerR = size / 2;
    const innerR = Math.max(0, outerR - rimWidth);

    const fill = Math.max(0, (wedgeFillDeg ?? (stepDeg - gapDeg))); // «чистая» ширина клина
    const period = 2 * stepDeg;                                     // красный + светлый
    const phase = center + phaseDeg - stepF * stepDeg;              // фаза узора (как у иконок)

    // Утилита полупрозрачного цвета
    const withAlpha = (color, a) => `color-mix(in oklab, ${color} ${Math.round(a * 100)}%, transparent)`;
    const redTint = withAlpha(red, tintAlphaRed);
    const ivoryTint = withAlpha(ivory, tintAlphaIvory);

    // Маска кольца (вырезаем всё внутри innerR)
    const ringMask = `radial-gradient(circle at 50% 50%, transparent ${innerR - 0.5}px, black ${innerR}px)`;

    // ─────────────────────────────────────────────────────────────
    // Слои на кольце
    const layers = [];

    if (showBase) {
      layers.push(
        <span
          key="disk:base"
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(80% 80% at 50% 42%, ${baseDark} 0%, ${baseDark2} 72%, #000 100%)`,
            boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
          }}
        />
      );
    }

    // «Стекло» под узором (равномерное размытие фона под кольцом)
    layers.push(
      <span
        key="ring:glass"
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          WebkitMask: ringMask,
          mask: ringMask,
          backdropFilter: `blur(${blurPx}px) saturate(${saturate}) brightness(${brighten})`,
        }}
      />
    );

    // Основной узор: красный/прозрачный/ivory/прозрачный, повторяющийся с периодом 2*stepDeg
    layers.push(
      <span
        key="ring:tint"
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          WebkitMask: ringMask,
          mask: ringMask,
          background: `
            repeating-conic-gradient(
              from ${phase}deg,
              ${redTint} 0deg,
              ${redTint} ${fill}deg,
              transparent ${fill}deg,
              transparent ${fill + gapDeg}deg,
              ${ivoryTint} ${fill + gapDeg}deg,
              ${ivoryTint} ${fill + gapDeg + fill}deg,
              transparent ${fill + gapDeg + fill}deg,
              transparent ${period}deg
            )
          `,
        }}
      />
    );

    // Тонкие разделители поверх узора (не зависят от AA основного tint-градиента)
    if (showGaps) {
      layers.push(
        <span
          key="ring:gaps"
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            WebkitMask: ringMask,
            mask: ringMask,
            background: `
              repeating-conic-gradient(
                from ${phase}deg,
                transparent 0deg,
                transparent ${fill}deg,
                rgba(255,255,255,${gapAlpha}) ${fill}deg,
                rgba(255,255,255,${gapAlpha}) ${fill + gapDeg}deg,
                transparent ${fill + gapDeg}deg,
                transparent ${fill + gapDeg + fill}deg,
                rgba(255,255,255,${gapAlpha}) ${fill + gapDeg + fill}deg,
                rgba(255,255,255,${gapAlpha}) ${period}deg
              )
            `,
          }}
        />
      );
    }

    // Лёгкая внутренняя тень кольца
    layers.push(
      <span
        key="ring:inner-shadow"
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          WebkitMask: ringMask,
          mask: ringMask,
          boxShadow: 'inset 0 10px 24px rgba(0,0,0,0.45)',
        }}
      />
    );

    // ─────────────────────────────────────────────────────────────
    // Центр («чашка») — строго по центру колеса
    if (cupEnabled) {
      const cup = Math.round(size * cupDiameterPct);            // диаметр чашки
      const rimT = Math.max(1, Math.round(cupRimThicknessPx));  // толщина кромки
      const rimOuter = cup + rimT * 2;                          // внешний диаметр кромки

      const cupFillByPreset =
        cupFillPreset === 'glass-light'
          ? 'radial-gradient(70% 65% at 50% 40%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 42%, rgba(0,0,0,0.55) 100%)'
          : cupFillPreset === 'metal-silver'
          ? 'radial-gradient(65% 65% at 50% 45%, #E7EBF2 5%, #C9CED8 35%, #9FA6B2 70%, #5F6673 100%)'
          : cupFillPreset === 'glass-dark'
          ? 'radial-gradient(70% 65% at 50% 40%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 38%, rgba(0,0,0,0.65) 100%)'
          : cupFill; // custom

      // Кромка фиксированной толщины через маску (кольцо)
      layers.push(
        <span
          key="center:rim"
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: rimOuter,
            height: rimOuter,
            background: cupRimColor, // золото/серебро/любой цвет
            WebkitMask: `radial-gradient(circle at 50% 50%, transparent ${cup/2}px, black ${cup/2 + 0.5}px)`,
            mask:       `radial-gradient(circle at 50% 50%, transparent ${cup/2}px, black ${cup/2 + 0.5}px)`,
            filter: `drop-shadow(0 0 6px color-mix(in oklab, ${cupRimColor} ${Math.round(
              cupRimGlow * 100
            )}%, transparent))`,
          }}
        />
      );

      // Сама «чашка»
      layers.push(
        <span
          key="center:cup"
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: cup,
            height: cup,
            background: cupFillByPreset,
            boxShadow: cupInnerShadow,
          }}
        />
      );

      // Эмблема (под лейблом, над чашкой)
      if (emblemEnabled) {
        const emW = Math.round(cup * emblemScalePct);
        const emH = emW;

        if (emblemSVG && typeof emblemSVG === 'string') {
          layers.push(
            <span
              key="center:emblem-custom"
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: emW, height: emH, opacity: emblemOpacity, color: emblemColor }}
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="${emblemStroke}" stroke-linecap="round" stroke-linejoin="round">${emblemSVG}</svg>`
              }}
            />
          );
        } else {
          // дефолтная «розетка»: круг + N лучей
          layers.push(
            <span
              key="center:emblem-rays"
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: emW, height: emH, opacity: emblemOpacity, color: emblemColor }}
            >
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                fill="none"
                stroke="currentColor"
                strokeWidth={emblemStroke}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r={24 * emblemInnerRadiusPct * 0.5} />
                {Array.from({ length: emblemCount }).map((_, i) => {
                  const a = (i * (360 / emblemCount)) * Math.PI / 180;
                  const r1 = 24 * emblemInnerRadiusPct * 0.5;
                  const r2 = 24 * emblemOuterRadiusPct * 0.5;
                  const x1 = 12 + Math.cos(a) * r1;
                  const y1 = 12 + Math.sin(a) * r1;
                  const x2 = 12 + Math.cos(a) * r2;
                  const y2 = 12 + Math.sin(a) * r2;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                })}
              </svg>
            </span>
          );
        }
      }
    }

    // Вернём все слои одним контейнером (pointer-events:none — скин не мешает жестам)
    return (
      <div className="absolute inset-0 rounded-full pointer-events-none">
        {layers}
      </div>
    );
  },

  afterIcons() {
    // сейчас ничего поверх иконок не рисуем
    return null;
  },

  CenterLabelWrap(_g, _p, children) {
    // Лейбл идёт ПОСЛЕ beforeIcons → всегда сверху центра (и над эмблемой)
    return (
      <div className="relative z-[2] text-[--fg-strong] font-semibold tracking-wide">
        {children}
      </div>
    );
  },

  decorateIcon(node, { isActive }) {
    // Мягкий акцент активной иконки (без смены её цвета)
    if (!isActive) return node;
    return (
      <div
        className="rounded-full"
        style={{ boxShadow: '0 0 10px rgba(212,175,55,0.28), inset 0 0 6px rgba(255,255,255,0.12)' }}
      >
        {node}
      </div>
    );
  },
};
