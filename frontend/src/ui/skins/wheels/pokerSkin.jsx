// frontend/src/ui/skins/wheels/pokerSkin.jsx
import React from 'react';

/**
 * Poker-chip (glass, seamless)
 * — без поштучных клиньев: один repeating-conic-gradient, фаза = center + phaseDeg - stepF*stepDeg
 * — стекло (blur+saturate+brightness) отдельным слоем под узором
 * — разделители — повторяющийся тонкий conic-градиент поверх
 * — кольцо ограничено единой рад. маской, «шва» нет, при прокрутке ничего не дорисовывается в кадре
 */
export const pokerSkin = {
  beforeIcons(geom, props = {}) {
    const { size, center, stepDeg, stepF } = geom;

    const {
      // геометрия
      rimWidth = 26,
      gapDeg = 2,
      wedgeFillDeg = null,      // по умолчанию stepDeg - gapDeg
      phaseDeg = 0,            // тонкая подстройка совмещения с иконкой

      // стекло
      blurPx = 8,
      saturate = 1.12,
      brighten = 1.04,
      tintAlphaRed = 0.46,
      tintAlphaIvory = 0.20,

      // разделители
      showGaps = true,
      gapAlpha = 0.28,

      // цвета (токены)
      red = 'color-mix(in oklab, var(--brand-crimson, #EE2346) 78%, black)',
      ivory = 'color-mix(in oklab, white 92%, var(--bg-0, #0B0D12) 8%)',

      // базовый диск
      showBase = true,
      baseDark = 'var(--bg-2, #141A22)',
      baseDark2 = 'var(--bg-0, #0B0D12)',
    } = props;

    const outerR = size / 2;
    const innerR = Math.max(0, outerR - rimWidth);
    const fill = Math.max(0, (wedgeFillDeg ?? (stepDeg - gapDeg))); // «чистая» ширина клина
    const period = 2 * stepDeg;                                     // красный + белый шаг
    const phase = center + phaseDeg - stepF * stepDeg;               // фаза узора, как у иконок

    // удобный способ задать «полупрозрачный цвет»
    const withAlpha = (color, a) => `color-mix(in oklab, ${color} ${Math.round(a * 100)}%, transparent)`;
    const redTint = withAlpha(red, tintAlphaRed);
    const ivoryTint = withAlpha(ivory, tintAlphaIvory);

    // маска кольца — всё рисуем только на ободе
    const ringMask = `radial-gradient(circle at 50% 50%, transparent ${innerR - 0.5}px, black ${innerR}px)`;

    // слой базы под стеклом
    const baseLayer = showBase ? (
      <div
        key="disk:base"
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(80% 80% at 50% 42%, ${baseDark} 0%, ${baseDark2} 72%, #000 100%)`,
          boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
        }}
      />
    ) : null;

    // стекло (размывает фон под кольцом равномерно, без «подтеков» между клиньями)
    const glassLayer = (
      <div
        key="ring:glass"
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          WebkitMask: ringMask,
          mask: ringMask,
          backdropFilter: `blur(${blurPx}px) saturate(${saturate}) brightness(${brighten})`,
        }}
      />
    );

    // основной узор: бесшовная «лента» красный/прозрачный/ivory/прозрачный на периоде 2*stepDeg
    const tintLayer = (
      <div
        key="ring:tint"
        className="absolute inset-0 rounded-full pointer-events-none"
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

    // тонкие разделители поверх (не зависят от антиалиасинга основного узора)
    const gapsLayer = showGaps ? (
      <div
        key="ring:gaps"
        className="absolute inset-0 rounded-full pointer-events-none"
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
    ) : null;

    // лёгкий внутренний объём
    const innerShadow = (
      <div
        key="ring:inner-shadow"
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          WebkitMask: ringMask,
          mask: ringMask,
          boxShadow: 'inset 0 10px 24px rgba(0,0,0,0.45)',
        }}
      />
    );

    return (
      <div className="absolute inset-0 rounded-full pointer-events-none">
        {baseLayer}
        {glassLayer}
        {tintLayer}
        {gapsLayer}
        {innerShadow}
      </div>
    );
  },

  afterIcons() {
    return null;
  },

  CenterLabelWrap(_g, _p, children) {
    return (
      <div className="relative z-[2] text-[--fg-strong] font-semibold tracking-wide">
        {children}
      </div>
    );
  },

  decorateIcon(node, { isActive }) {
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
