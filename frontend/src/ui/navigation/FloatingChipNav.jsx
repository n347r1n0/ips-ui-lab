import React from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { ChipNav } from './ChipNav';

/**
 * FloatingChipNav — док к углу + учёт safe-area.
 * props:
 *  - corner: 'br' | 'bl' | 'tr' | 'tl'
 *  - style/className: доп. стили
 *  - ...ChipNav props
 */
export function FloatingChipNav({
  corner = 'br',
  className = '',
  style,
  ...chipProps
}) {
  if (typeof document === 'undefined') return null;

  const pos =
    corner === 'br' ? 'bottom-0 right-0' :
    corner === 'bl' ? 'bottom-0 left-0'  :
    corner === 'tr' ? 'top-0 right-0'    :
                      'top-0 left-0';

  // фишка «торчит» за край — трансформация зависит от угла
  const shift =
    corner === 'br' ? 'translate-x-[var(--chip-offset)] translate-y-[var(--chip-offset)]' :
    corner === 'bl' ? '-translate-x-[var(--chip-offset)] translate-y-[var(--chip-offset)]' :
    corner === 'tr' ? 'translate-x-[var(--chip-offset)] -translate-y-[var(--chip-offset)]' :
                      '-translate-x-[var(--chip-offset)] -translate-y-[var(--chip-offset)]';

  return createPortal(
    <div
      className={twMerge(
        'fixed z-50 pointer-events-auto',
        pos,
        // отступы безопасной зоны
        'p-[max(8px,env(safe-area-inset-bottom))]',
        className
      )}
      style={style}
    >
      <div className={twMerge(shift)}>
        <ChipNav {...chipProps} />
      </div>
    </div>,
    document.body
  );
}
