// frontend/src/ui/feedback/ErrorState.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../primitives/Button';

export function ErrorState({
  icon: Icon = AlertTriangle,
  title = 'Что-то пошло не так',
  message,
  error,                // строка с технической ошибкой (опционально)
  onRetry,              // функция для кнопки «Повторить» (опционально)
  retryLabel = 'Повторить',
  action,               // любой кастомный action-узел вместо/рядом с Retry
  className = '',
  ...rest
}) {
  return (
    <div
      role="alert"
      className={twMerge(
        'text-center rounded-[var(--radius)] border border-[--glass-border]',
        'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-8',
        className
      )}
      {...rest}
    >
      <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
        <Icon className="h-5 w-5 text-[--danger]" />
      </div>

      <div className="text-[--fg-strong] font-semibold">{title}</div>

      {message && (
        <div className="text-[--fg] opacity-80 mt-1">{message}</div>
      )}

      {error && (
        <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-black/30 p-3 text-left text-xs font-mono text-[--fg]">
          {String(error)}
        </pre>
      )}

      {(onRetry || action) && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {onRetry && (
            <Button onClick={onRetry}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
