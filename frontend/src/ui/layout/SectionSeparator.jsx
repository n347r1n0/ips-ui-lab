// frontend/src/ui/layout/SectionSeparator.jsx

import React from 'react';
import { ArtDecoDivider } from './ArtDecoDivider';

/**
 * SectionSeparator — токен-драйвовый разделитель секций.
 *
 * Props:
 * - variant: 'deco' | 'glass' | 'none'      // по умолчанию 'deco'
 * - width:   'content' | 'full' | 'sm' | 'md' | 'lg'  // ширина линии
 * - margin:  'none' | 'sm' | 'md' | 'lg' | 'xl'       // вертикальные отступы вокруг
 * - className: string
 *
 * Зависит от токенов в tokens.css:
 *   --divider-accent-strong, --divider-glow-color, --divider-thickness, --divider-glow-radius
 *   --glass-border
 *
 * Примечание:
 *  - 'deco' использует тот же визуал, что и модалки (тонкая линия + мягкое свечение к краям)
 *  - 'glass' — простая тонкая линия на стеклянном бордере (с постепенным затуханием к краям)
 *  - 'none' — ничего не рендерит
 */


export function SectionSeparator({
  variant = 'deco',
  width = 'content',
  margin = 'lg',
  thickness = '2.4px',
  className = '',
}) {
  if (variant === 'none') return null;

  const WIDTH = {
    full: 'w-full',
    content: 'max-w-4xl w-full',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-96',
  };
  const MARGIN = {
    none: 'py-0',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12',
  };

  const wrap = `${MARGIN[margin] ?? MARGIN.lg} ${className}`;
  const innerWidth = WIDTH[width] ?? WIDTH.content;

  if (variant === 'glass') {
    // Тонкая стеклянная линия с затуханием к краям (через градиент на glass-border)
    return (
      <div className={`flex items-center justify-center ${wrap}`}>
        <div
          className={`${innerWidth} h-px`}
          style={{
            background:
              'linear-gradient(to right, transparent, var(--glass-border), transparent)',
            opacity: 0.7,
          }}
        />
      </div>
    );
  }

  // variant === 'deco' — низкоуровневый примитив, ширину/отступы даём тут
  return (
    <div className={`flex items-center justify-center ${wrap}`}>
      <ArtDecoDivider
        className={`${innerWidth}`}
        style={{ '--divider-thickness': thickness }}
      />
    </div>
  );

}

export default SectionSeparator;
