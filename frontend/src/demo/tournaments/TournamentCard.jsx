// frontend/src/demo/tournaments/TournamentCard.jsx
import React from 'react';
import { Trophy, Star, Zap, Target, Clock, Check } from 'lucide-react';
import { Button } from '@/ui/primitives/Button';

const mapIcon = (type) => ({
  'Стандартный': Target,
  'Специальный': Star,
  'Фриролл': Zap,
  'Рейтинговый': Trophy,
}[type] || Target);

const mapColor = (type) => ({
  'Стандартный': 'text-[--info]',
  'Специальный': 'text-gold-accent',
  'Фриролл': 'text-[--danger]',
  'Рейтинговый': 'text-gold-accent',
}[type] || 'text-[--fg]');

export function TournamentCard({ t, registered, onRegister, onCancel }) {
  const Icon = mapIcon(t.visualType);
  const color = mapColor(t.visualType);
  const date = new Date(t.date);

  return (
    <div className="bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] rounded-[var(--radius)] p-4 md:p-5 shadow-[var(--shadow-s)] transition-[box-shadow,background] hover:bg-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${color} shrink-0`} />
            <h3 className="text-[--fg-strong] font-medium truncate">{t.name}</h3>
            {t.visualType && (
              <span className={`text-xs px-2 py-0.5 rounded-full bg-black/20 ${color} shrink-0`}>
                {t.visualType}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[--fg] opacity-80 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {date.toLocaleDateString('ru-RU', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
            <span>•</span>
            <span>
              {date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {t.settings?.buyInCost != null && (
            <div className="mt-2 text-gold-accent text-sm">
              Вступительный взнос: ${t.settings.buyInCost}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {registered ? (
            <>
              <span className="text-xs text-gold-accent bg-gold-accent/10 px-2 py-1 rounded">
                ✓ Зарегистрированы
              </span>
              <Button variant="glass" size="sm" onClick={onCancel}>
                Отменить
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onRegister}>
              <Check className="w-4 h-4 mr-1" />
              Записаться
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
