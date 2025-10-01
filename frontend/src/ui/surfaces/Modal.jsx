// frontend/src/ui/surfaces/Modal.jsx

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Унифицированная модалка.
 *
 * size:    'md' | 'lg' | 'xl' | 'fullscreen'
 * variant: 'glass' | 'solid'
 * backdrop:'normal' | 'heavy'
 */
export function Modal({
  open,
  onClose,
  size = 'md',
  variant = 'glass',
  backdrop = 'normal',
  children,
  className = '',
  ...rest
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    contentRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const maxW =
    size === 'fullscreen' ? 'max-w-none'
    : size === 'xl'        ? 'max-w-4xl'
    : size === 'lg'        ? 'max-w-lg'
    :                        'max-w-md';

  const wrapperSizing =
    size === 'fullscreen'
      ? 'fixed inset-0'
      : 'relative min-h-full flex items-center justify-center p-4';

  const backdropStyle =
    backdrop === 'heavy'
      ? 'bg-[--backdrop-heavy] backdrop-blur-md'
      : 'bg-black/60 backdrop-blur-sm';

  const panelStyle =
    variant === 'solid'
      ? 'bg-[--neuro-bg] border border-[--neuro-border] [box-shadow:var(--neuro-shadow)]'
      : 'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] shadow-[var(--shadow-m)]';

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
          aria-labelledby={rest['aria-labelledby']}
          {...rest}
        >
          {/* Подложка */}
          <div
            className={twMerge('absolute inset-0', backdropStyle)}
            onClick={onClose}
          />

          {/* Контейнер */}
          <div className={wrapperSizing}>
            <motion.div
              initial={{ scale: size === 'fullscreen' ? 1 : 0.96, y: size === 'fullscreen' ? 0 : 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: size === 'fullscreen' ? 1 : 0.96, y: size === 'fullscreen' ? 0 : 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={twMerge(
                'w-full outline-none',
                size === 'fullscreen' ? 'h-full' : maxW,
                className
              )}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              ref={contentRef}
            >
              <div
                className={twMerge(
                  'flex flex-col',
                  panelStyle,
                  size === 'fullscreen'
                    ? 'h-full rounded-none'
                    : 'rounded-[var(--radius)] max-h-[90vh]'
                )}
              >
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Подкомпоненты с едиными отступами и границами
 *
 * Доп. пропсы:
 * - variant: 'glass' | 'solid' — влияет на цвет стандартного разделителя
 * - decoDivider: boolean — включает арт-деко-линию (тонкая + мягкое свечение)
 *
 * Примечание: можно включить decoDivider отдельно для Header или Footer.
 */

Modal.Header = function ModalHeader({
  children,
  onClose,
  className = '',
  variant = 'glass',
  decoDivider = false,
  style,
}) {
  return (
    <div
      className={twMerge(
        'sticky top-0 z-10 flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b',
        variant === 'solid' ? 'border-[--divider-weak]' : 'border-[--glass-border]',
        decoDivider && 'relative border-transparent', // чтобы не было второй линии
        // Один узкий псевдоэлемент с glow через box-shadow (чтобы не было «толстой плашки»)
        decoDivider &&
          "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-1px] " +
          "after:h-[var(--divider-thickness,1px)] after:pointer-events-none " +
          "after:bg-[linear-gradient(to_right,transparent,var(--divider-accent-strong),transparent)] " +
          "after:[box-shadow:0_0_var(--divider-glow-radius,12px)_var(--divider-glow-color,rgba(212,175,55,.35))]",
        className
      )}
      style={style}
    >
      <h3 className="text-lg md:text-xl font-semibold text-[--fg-strong]">{children}</h3>
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

Modal.Body = function ModalBody({ children, className = '' }) {
  return (
    <div
      className={twMerge(
        'flex-1 overflow-y-auto min-h-0 [scrollbar-gutter:stable_both-edges] px-6 py-5 md:px-8 md:py-6 text-[--fg]',
        className
      )}
    >
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({
  children,
  className = '',
  variant = 'glass',
  decoDivider = false,
  style,
}) {
  return (
    <div
      className={twMerge(
        'sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 md:px-8 md:py-5 border-t',
        variant === 'solid' ? 'border-[--divider-weak]' : 'border-[--glass-border]',
        decoDivider && 'relative border-transparent',
        decoDivider &&
          "after:content-[''] after:absolute after:left-0 after:right-0 after:top-[-1px] " +
          "after:h-[var(--divider-thickness,1px)] after:pointer-events-none " +
          "after:bg-[linear-gradient(to_right,transparent,var(--divider-accent-strong),transparent)] " +
          "after:[box-shadow:0_0_var(--divider-glow-radius,12px)_var(--divider-glow-color,rgba(212,175,55,.35))]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
