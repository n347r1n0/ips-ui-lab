// frontend/src/ui/surfaces/Drawer.jsx

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Drawer — выезжающая панель.
 *
 * props:
 * - open: boolean
 * - onClose: () => void
 * - side: 'right' | 'left' | 'bottom' (default: 'right')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - children: слот, где можно использовать Drawer.Header/Body/Footer
 *
 * Стили и токены согласованы с Modal/GlassPanel.
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  size = 'md',
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const axis = side === 'bottom' ? 'y' : 'x';

  const sizes =
    side === 'bottom'
      ? {
          sm: 'h-[40vh] max-h-[560px]',
          md: 'h-[55vh] max-h-[720px]',
          lg: 'h-[75vh] max-h-[900px]',
        }
      : {
          sm: 'w-[280px] max-w-[85vw]',
          md: 'w-[360px] max-w-[90vw]',
          lg: 'w-[480px] max-w-[95vw]',
        };

  const placement =
    side === 'right'
      ? 'right-0 top-0 h-full'
      : side === 'left'
      ? 'left-0 top-0 h-full'
      : 'bottom-0 left-0 w-full';

  const from =
    side === 'right'
      ? { x: 40 }
      : side === 'left'
      ? { x: -40 }
      : { y: 40 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          {...rest}
        >
          {/* подложка */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* контейнер */}
          <motion.div
            initial={{ ...from, opacity: 0 }}
            animate={{ [axis]: 0, opacity: 1 }}
            exit={{ ...from, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={`absolute ${placement} outline-none`}
            tabIndex={-1}
            ref={ref}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={[
                // стекло + границы, как у Modal
                'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)]',
                'border border-[--glass-border] shadow-[var(--shadow-m)]',

                side === 'bottom'
                  ? 'rounded-t-[var(--radius)] rounded-b-none'
                  : side === 'right'
                    ? 'rounded-l-[var(--radius)] rounded-r-none'
                    : 'rounded-r-[var(--radius)] rounded-l-none',
                sizes[size],
              ].join(' ')}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Слоты
Drawer.Header = function DrawerHeader({ children, onClose }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[--glass-border]">
      <h3 className="text-lg font-semibold text-[--fg-strong]">{children}</h3>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-[--fg] hover:text-[--fg-strong]"
        >
          ×
        </button>
      )}
    </div>
  );
};

Drawer.Body = function DrawerBody({ children }) {
  return <div className="p-5 text-[--fg]">{children}</div>;
};

Drawer.Footer = function DrawerFooter({ children }) {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-[--glass-border]">
      {children}
    </div>
  );
};
