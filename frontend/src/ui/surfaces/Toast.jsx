// frontend/src/ui/surfaces/Toast.jsx

import React, { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const ToastCtx = createContext(null);

function borderBy(v) {
  switch (v) {
    case 'success': return 'border-green-500/40';
    case 'warning': return 'border-amber-500/40';
    case 'danger':  return 'border-red-500/40';
    default:        return 'border-[--glass-border]';
  }
}
function dotBy(v) {
  switch (v) {
    case 'success': return 'bg-green-400';
    case 'warning': return 'bg-amber-400';
    case 'danger':  return 'bg-red-400';
    default:        return 'bg-sky-400';
  }
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const remove = useCallback(id => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback(({ message, title, variant = 'info', duration = 3000 }) => {
    const id = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
    setItems(prev => [...prev, { id, message, title, variant, duration }]);
    if (duration) setTimeout(() => remove(id), duration);
  }, [remove]);

  const api = {
    push,
    info:    (m, o) => push({ message: m, variant: 'info',    ...o }),
    success: (m, o) => push({ message: m, variant: 'success', ...o }),
    warning: (m, o) => push({ message: m, variant: 'warning', ...o }),
    danger:  (m, o) => push({ message: m, variant: 'danger',  ...o }),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {createPortal(
          <>
            {/* Невидимый live-region для screen readers */}
            <div
              role="region"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Notifications"
              className="sr-only"
            >
              {/* дублируем тексты, чтобы SR их «услышал» */}
              {items.map(t => (
                <div key={t.id}>
                  {t.title ? `${t.title}: ` : ''}{t.message}
                </div>
              ))}
            </div>

            {/* Видимый контейнер тостов (без ARIA, без sr-only) */}
            <div className="fixed z-[60] top-4 right-4 space-y-2 pointer-events-none">
              <AnimatePresence initial={false}>
                {items.map(t => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`pointer-events-auto min-w-[260px] max-w-[360px]
                      rounded-lg border p-3 shadow-[var(--shadow-s)]
                      bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] ${borderBy(t.variant)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${dotBy(t.variant)}`} />
                      <div className="flex-1 text-sm text-[--fg]">
                        {t.title && <div className="font-medium text-[--fg-strong]">{t.title}</div>}
                        <div>{t.message}</div>
                      </div>
                      <button
                        onClick={() => remove(t.id)}
                        className="shrink-0 text-[--fg] hover:text-[--fg-strong]"
                        aria-label="Закрыть уведомление"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>,
          document.body
      )}


    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
