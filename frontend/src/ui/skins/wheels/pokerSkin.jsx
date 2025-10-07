// frontend/src/ui/skins/wheels/pokerSkin.jsx
import React from 'react';

/**
 * Poker-chip skin — клинья из бесконечной ленты, покрытие на весь круг.
 *  • seam = round(stepF) — опорный «шов» ленты.
 *  • Рисуем ровно столько клиньев, сколько нужно, чтобы покрыть 360° (ceil(360/stepDeg)+2).
 *  • Цвет клина стабилен: parity = (logicalStep - phase0) % 2 — НЕ зависит от «скользящего окна».
 *  • Каждый клин центрирован в angle = center + (logicalStep - stepF) * stepDeg.
 *  • Если клин пересекает 0°/360°, разбиваем на 2 слайса (wrap-safe).
 *  • Центр не рисуем (не перекрывает подпись).
 */
export const pokerSkin = {
  beforeIcons(geom, props = {}) {
    const { size, center, stepDeg, stepF, phase0 } = geom;
    const {
      rimWidth = 26,          // ширина кольца (px)
      gapDeg = 1,             // зазор между клиньями (deg)
      red = '#C54141',
      ivory = '#EFE6CF',
      showBase = true,
      baseDark = 'rgba(18,18,20,1)',
      baseDark2 = 'rgba(8,8,10,1)',
      wedgeFillDeg = null,    // если null → stepDeg - gapDeg
    } = props;

    const outerR = size / 2;
    const innerR = Math.max(0, outerR - rimWidth);
    const fill = Math.max(0, (wedgeFillDeg ?? (stepDeg - gapDeg)));
    const halfGap = Math.max(0, gapDeg / 2);
    const eps = 0.01;

    const ringMask = `radial-gradient(circle at 50% 50%, transparent ${innerR - 0.5}px, black ${innerR}px)`;
    const norm = (d) => ((d % 360) + 360) % 360;

    const layers = [];

    if (showBase) {
      layers.push(
        <div
          key="disk:base"
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(80% 80% at 50% 42%, ${baseDark} 0%, ${baseDark2} 70%, #000 100%)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}
        />
      );
    }

    const addSlice = (key, color, a, b) => {
      layers.push(
        <div
          key={key}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            mask: ringMask,
            WebkitMask: ringMask,
            background: `conic-gradient(
              from 0deg,
              transparent ${a}deg,
              ${color} ${a}deg ${b}deg,
              transparent ${b}deg
            )`,
          }}
        />
      );
    };

    const addGap = (key, a, b) => {
      if (gapDeg <= 0) return;
      layers.push(
        <div
          key={key}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            mask: ringMask,
            WebkitMask: ringMask,
            background: `conic-gradient(
              from 0deg,
              transparent ${a}deg,
              rgba(255,255,255,0.18) ${a}deg ${b}deg,
              transparent ${b}deg
            )`,
          }}
        />
      );
    };

    // 1) Считаем, сколько клиньев нужно для полного покрытия круга
    const needed = Math.ceil(360 / stepDeg) + 2; // запас по краям
    const seam = Math.round(stepF);
    const left = Math.floor((needed - 1) / 2);
    const right = needed - 1 - left;

    for (let o = -left; o <= right; o++) {
      const logicalStep = seam + o;

      // 2) Стабильный паритет (без «мигания»)
      const parityEven = ((logicalStep - phase0) % 2 + 2) % 2 === 0;
      const color = parityEven ? red : ivory;

      // 3) Центр клина и его диапазон
      const angle = center + (logicalStep - stepF) * stepDeg;

      let start = angle - fill / 2;
      let end   = angle + fill / 2;

      const gapA0 = start - halfGap;
      const gapA1 = start;
      const gapB0 = end;
      const gapB1 = end + halfGap;

      start = norm(start);
      end   = norm(end);

      const drawWedge = (k, a, b) => addSlice(`w:${logicalStep}:${k}`, color, a + eps, b - eps);
      const drawGap = (k, a, b) => addGap(`g:${logicalStep}:${k}`, a, b);

      if (end >= start) {
        // один слайс
        drawWedge('a', start, end);

        // разделители по краям (wrap-aware)
        if (gapDeg > 0.2) {
          const a0 = norm(gapA0), a1 = norm(gapA1), b0 = norm(gapB0), b1 = norm(gapB1);
          if (a1 >= a0) drawGap('A:a', a0, a1); else { drawGap('A:a1', a0, 360); drawGap('A:a2', 0, a1); }
          if (b1 >= b0) drawGap('B:a', b0, b1); else { drawGap('B:a1', b0, 360); drawGap('B:a2', 0, b1); }
        }
      } else {
        // wrap: два слайса
        drawWedge('a', start, 360);
        drawWedge('b', 0, end);

        if (gapDeg > 0.2) {
          const a0 = norm(gapA0), a1 = norm(gapA1), b0 = norm(gapB0), b1 = norm(gapB1);
          if (a1 >= a0) drawGap('A:a', a0, a1); else { drawGap('A:a1', a0, 360); drawGap('A:a2', 0, a1); }
          if (b1 >= b0) drawGap('B:a', b0, b1); else { drawGap('B:a1', b0, 360); drawGap('B:a2', 0, b1); }
        }
      }
    }

    return <div className="absolute inset-0 rounded-full pointer-events-none">{layers}</div>;
  },

  afterIcons() { return null; },

  CenterLabelWrap(_geom, _props, children) {
    // подпись не перекрываем
    return <div className="relative z-[2] text-[--fg-strong] font-semibold tracking-wide">{children}</div>;
  },

  decorateIcon(node, { isActive }) {
    if (!isActive) return node;
    return (
      <div
        className="rounded-full"
        style={{ boxShadow: '0 0 10px rgba(212,175,55,0.30), inset 0 0 6px rgba(255,255,255,0.12)' }}
      >
        {node}
      </div>
    );
  },
};
