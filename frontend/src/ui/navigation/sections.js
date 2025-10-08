// frontend/src/ui/navigation/sections.js
import React from 'react';
import { Home, Info, CalendarDays, Images } from 'lucide-react';

// Локальная иконка "Пьедестал" без JSX (safe для .js)
export const PodiumIcon = (props) =>
  React.createElement(
    'svg',
    {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      ...props,
    },
    React.createElement('rect', { x: 9,  y: 6,  width: 6,  height: 12, rx: 1 }),
    React.createElement('rect', { x: 3,  y: 9,  width: 6,  height: 9,  rx: 1 }),
    React.createElement('rect', { x: 15, y: 11, width: 6,  height: 7,  rx: 1 }),
  );

export const SECTIONS = [
  { id: 'hero',     label: 'Главная',  Icon: Home },
  { id: 'about',    label: 'О клубе',  Icon: Info },
  { id: 'calendar', label: 'Турниры',  Icon: CalendarDays }, // было "Календарь"
  { id: 'rating',   label: 'Рейтинг',  Icon: PodiumIcon },   // локальный "подиум"
  { id: 'gallery',  label: 'Галерея',  Icon: Images },
];
