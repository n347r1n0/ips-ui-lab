// frontend/src/ui/patterns/FloatingChipWheel.jsx
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * FloatingChipWheel — «круговая фишка»-навигация (MVP, токен-драйв).
 *
 * ────────────────────────────────────────────────────────────────────
 * ПУБЛИЧНЫЕ ПРОПЫ (все опциональны, кроме items/activeId):
 *
 * items: Array<{ id: string, label: string, icon?: JSX, Icon?: ReactComponent }>
 *   Набор пунктов. Иконку можно передать:
 *     • как готовый JSX в поле icon, или
 *     • как компонент в поле Icon (мы сами поставим width/height).
 *
 * activeId: string
 *   Текущая активная секция (для подсветки и выравнивания).
 *
 * onSelect: (id: string) => void
 *   Колбэк по клику на иконку.
 *
 * dock: 'br' | 'bl' | 'tr' | 'tl'   (по умолчанию 'br')
 *   Угол «стыковки» круга к странице:
 *   br — снизу-справа, bl — снизу-слева, tr — сверху-справа, tl — сверху-слева.
 *
 * size: number  (по умолчанию 320)
 *   Диаметр круга в px. Влияет на физический размер «фишки».
 *
 * radius: number  (по умолчанию 120)
 *   Радиус «дорожки» иконок (расстояние от центра, px).
 *
 * centerAngle: number | undefined
 *   Угол (в градусах), где располагается **активная** иконка.
 *   Если не задан, берём дефолт для выбранного dock:
 *     br=225, bl=315, tr=135, tl=45  (центр видимой четверти).
 *
 * stepDeg: number | undefined
 *   Фиксированный шаг между иконками (в градусах).
 *   По умолчанию равномерное распределение: 360 / items.length.
 *   Полезно, если хотите плотнее (например, 45°) на видимой дуге.
 *
 * offset: { x: number, y: number }  (по умолчанию {x: 0, y: 0})
 *   Сдвиг центра «фишки» **внутрь** страницы (px).
 *   Положительные x/y — смещают от угла к центру экрана.
 *
 * iconSize: number  (по умолчанию 20)
 *   Размер глифа иконки (px).
 *
 * chipSize: number  (по умолчанию 40)
 *   Диаметр подложки под иконку (px).
 *
 * labelOffset: { x: number, y: number } (по умолчанию {x:0, y:0})
 *   Сдвиг **текста активной секции** от геометрического центра (px).
 *   Например, {x: 40, y: 20} — чуть вправо и вниз внутри круга.
 *
 * labelClassName: string
 *   Доп. классы для подписи в центре (можно увеличить шрифт/паддинги и т.д.).
 *
 * className: string
 *   Доп. классы для внешнего контейнера (если нужно).
 *
 * hideOnDesktop: boolean (по умолчанию true)
 *   Скрывать ли на ≥sm. Если false — будет видно везде.
 * ────────────────────────────────────────────────────────────────────
 *
 * Замечания:
 *  • Визуал завязан на токены: bg-цвета, бордеры и blur берём из tokens.css.
 *  • Компонент pointer-events отключает у обёртки и включает у интерактивных
 *    элементов, чтобы «фишка» не перекрывала клики по странице.
 */

export function FloatingChipWheel({
  items = [],
  activeId,
  onSelect,
  dock = 'br',

  // ↓↓↓ РАЗМЕР КРУГА
  size = 230,          // диаметр «фишки» (px) — влияет на style width/height контейнера

  // ↓↓↓ ГЕОМЕТРИЯ РАЗМЕЩЕНИЯ ИКОНОК
  radius = 95,        // радиус дорожки иконок (px) — в translate(<radius>px)
  centerAngle,         // явный угол активной иконки (deg). Если не задан — берём дефолт для dock
  stepDeg,             // шаг между иконками (deg). Если не задан — равномерно 360/N

  // ↓↓↓ СДВИГ ЦЕНТРА КРУГА ОТ УГЛА ВНУТРЬ ЭКРАНА
  offset = { x: -40, y: -25 }, // px: положительные значения «толкают» круг к центру страницы

  // ↓↓↓ РАЗМЕРЫ ГРАФИКИ
  iconSize = 15,       // размер глифа иконки (px) — применяется в renderIcon()
  chipSize = 15,       // размер круглой подложки под иконку (px)

  // ↓↓↓ ТЕКСТ ВНУТРИ КРУГА
  labelOffset = { x: -20, y: -22 }, // позиция подписи относительно центра (px)
  labelClassName = '',          // шрифт/паддинги/размер подписи

  // ↓↓↓ ПРОЧЕЕ
  className = '',
  hideOnDesktop = true,
}) {
  const clean = useMemo(() => items.filter(Boolean), [items]);
  if (clean.length === 0) return null;

  // ── Индекс активного, шаг между иконками
  const activeIndex = Math.max(0, clean.findIndex(i => i.id === activeId));
  const autoStep = 360 / clean.length;                // ← базовый равномерный шаг
  const step = typeof stepDeg === 'number' ? stepDeg : autoStep; // ← кастомный шаг/авто

  // ── Центр видимой дуги (куда попадает активная иконка)
  const defaultCenter = {
    br: 215, // правый-нижний ↘
    bl: 325, // левый-нижний ↙
    tr: 145, // правый-верхний ↗
    tl: 35,  // левый-верхний ↖
  }[dock] ?? 215;

  const center = typeof centerAngle === 'number' ? centerAngle : defaultCenter; // ← УГОЛ АКТИВНОЙ
  const angleFor = (i) => center + (i - activeIndex) * step; // ← формула расположения иконок

  // ── Позиционирование круга у выбранного угла + сдвиг offset внутрь страницы
  const anchor = {
    br: { corner: 'bottom-0 right-0', tx:  1, ty:  1 },
    bl: { corner: 'bottom-0 left-0',  tx: -1, ty:  1 },
    tr: { corner: 'top-0 right-0',    tx:  1, ty: -1 },
    tl: { corner: 'top-0 left-0',     tx: -1, ty: -1 },
  }[dock];

  // ↓↓↓ именно здесь задаётся смещение центра «фишки»
  const translate = `translate(calc(${anchor.tx * 50}% + ${anchor.tx * (offset?.x ?? 0)}px),
                                calc(${anchor.ty * 50}% + ${anchor.ty * (offset?.y ?? 0)}px))`;

  // ── Рендер иконки (поддержка JSX и компонентной формы)
  const renderIcon = (it) => {
    if (it.icon) {
      return React.cloneElement(it.icon, {
        style: { width: iconSize, height: iconSize, ...(it.icon.props?.style || {}) }, // ← РАЗМЕР ИКОНОК
        'aria-hidden': true,
      });
    }
    if (it.Icon) {
      return <it.Icon style={{ width: iconSize, height: iconSize }} aria-hidden="true" />; // ← РАЗМЕР ИКОНОК
    }
    return null;
  };

  const visibilityClass = hideOnDesktop ? 'sm:hidden' : '';

  return (
    <div
      className={twMerge(
        'fixed z-50 pointer-events-none select-none',
        visibilityClass,
        anchor.corner,
        className
      )}
      style={{ width: size, height: size, transform: translate }} // ← РАЗМЕР КРУГА + СМЕЩЕНИЕ
      aria-hidden={false}
    >
      {/* «Фишка»: стеклянная поверхность */}
      <div
        className={twMerge(
          'relative rounded-full',
          'bg-[--bg-1]/80 backdrop-blur-[var(--glass-blur)]',
          'border border-[--glass-border]',
          'shadow-[var(--shadow-m)]'
        )}
        style={{ width: size, height: size }} // ← РАЗМЕР КРУГА
      >
        {/* Центральная подпись (активная секция) */}
        <div
          className="absolute left-1/2 top-1/2" // ставим в геом. центр…
          style={{
            transform: `translate(-50%, -50%) translate(${labelOffset.x || 0}px, ${labelOffset.y || 0}px)`, // …и смещаем labelOffset'ом
            pointerEvents: 'auto',
          }}
        >
          <div
            className={twMerge(
              'text-center px-4 py-2 rounded-full',
              'bg-white/10 border border-white/15 text-[--fg-strong]',
              labelClassName // ← СТИЛИ ТЕКСТА/РАЗМЕР ШРИФТА
            )}
          >
            {clean[activeIndex]?.label}
          </div>
        </div>

        {/* Иконки по окружности */}
        {clean.map((it, i) => {
          const a = angleFor(i);                      // ← УГОЛ КОНКРЕТНОЙ ИКОПКИ
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
                'rounded-full p-2',
                'bg-white/10 border border-white/15',
                'transition-all duration-200',
                isActive ? 'scale-110 shadow-[var(--shadow-s)]' : 'opacity-80'
              )}
              style={{
                // ↓↓↓ ВАЖНО: здесь используется radius (глубина), а также угол a
                transform: `translate(-50%, -50%) rotate(${a}deg) translate(${radius}px) rotate(${-a}deg)`,
                pointerEvents: 'auto',
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={it.label}
              title={it.label}
            >
              <div
                className={twMerge(
                  'grid place-items-center rounded-full',
                  isActive ? 'bg-white/20' : near ? 'bg-white/10' : 'bg-white/5'
                )}
                style={{ width: chipSize, height: chipSize }} // ← РАЗМЕР ЧИПА ПОД ИКОНКУ
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
