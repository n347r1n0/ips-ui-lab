import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * size: 'md' | 'lg' | 'xl' | 'fullscreen'
 * - md -> max-w-md (форма/подтверждение)
 * - lg -> max-w-lg (средняя)
 * - xl -> max-w-4xl (большая, как в PROD)
 * - fullscreen -> во весь экран
 */
export function Modal({ open, onClose, size = 'md', children, ...rest }) {
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
    size === 'fullscreen'
      ? 'max-w-none'
      : size === 'xl'
      ? 'max-w-4xl'
      : size === 'lg'
      ? 'max-w-lg'
      : 'max-w-md';

  const wrapperSizing =
    size === 'fullscreen'
      ? 'fixed inset-0'
      : 'relative min-h-full flex items-center justify-center p-4';

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
          <div className={wrapperSizing}>
            <motion.div
              initial={{ scale: size === 'fullscreen' ? 1 : 0.96, y: size === 'fullscreen' ? 0 : 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: size === 'fullscreen' ? 1 : 0.96, y: size === 'fullscreen' ? 0 : 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={tw(
                'w-full outline-none',
                size === 'fullscreen' ? 'h-full' : maxW
              )}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              ref={contentRef}
            >
              <div className={tw(
                'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] ' +
                'rounded-[var(--radius)] shadow-[var(--shadow-m)]',
                size === 'fullscreen' ? 'h-full rounded-none' : ''
              )}>
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

// Примитивные подкомпоненты
Modal.Header = function ModalHeader({ children, onClose }) {
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

Modal.Body = function ModalBody({ children }) {
  return <div className="p-5 text-[--fg]">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-[--glass-border]">
      {children}
    </div>
  );
};

// ——— helpers ———
function tw(...classes) {
  return classes.filter(Boolean).join(' ');
}
