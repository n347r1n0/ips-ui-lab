// frontend/src/ui/icons/index.js
// Barrel для иконок + единообразный wrapper по размерам/толщине

export * from 'lucide-react';

/**
 * Icon — обёртка для любых иконок (включая lucide-react).
 * Пример:
 *   import { Icon, Inbox } from '@/ui/icons';
 *   <Icon as={Inbox} size="sm" />
 */
import React from 'react';

const SIZE = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

export function Icon({ as: As, size = 'sm', className = '', strokeWidth = 1.75, ...rest }) {
  if (!As) return null;
  return <As className={[SIZE[size] || SIZE.sm, className].join(' ')} strokeWidth={strokeWidth} {...rest} />;
}
