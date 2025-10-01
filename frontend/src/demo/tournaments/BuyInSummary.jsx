// frontend/src/demo/tournaments/BuyInSummary.jsx

import React from 'react';
import { DollarSign, RefreshCw, Plus, Clock } from 'lucide-react';

export function BuyInSummary({ settings, format, cost }) {
  const box = 'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] rounded-[var(--radius)] p-4';

  if (!settings || Object.keys(settings).length === 0) {
    return (
      <div className={box}>
        <h4 className="text-[--fg-strong] mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5 text-gold-accent"/>Вступительный взнос</h4>
        <div className="flex justify-between text-sm"><span className="text-[--fg]">Основной взнос:</span><span className="text-gold-accent font-semibold">${cost || 0}</span></div>
        <p className="text-xs text-[--fg] opacity-70 mt-2">
          {format === 'Freezeout' && 'Турнир на выбывание — без докупок'}
          {format === 'Re-buy' && 'Возможны докупки в течение регистрации'}
          {format === 'Re-entry' && 'Возможен повторный вход до окончания регистрации'}
        </p>
      </div>
    );
  }

  const { rebuy_cost, rebuy_period, addon_cost, addon_period, reentry_cost, reentry_period, late_registration_fee } = settings;

  return (
    <div className={box}>
      <h4 className="text-[--fg-strong] mb-3 flex items-center gap-2"><DollarSign className="w-5 h-5 text-gold-accent"/>Структура взносов</h4>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between border-b border-[--glass-border] pb-2"><span className="text-[--fg]">Основной взнос:</span><span className="text-gold-accent font-semibold">${cost || 0}</span></div>
        {(format==='Re-buy' || rebuy_cost) && (
          <div className="rounded-lg p-3 bg-blue-500/10">
            <div className="flex items-center gap-2 mb-1 text-blue-300"><RefreshCw className="w-4 h-4"/>Докупки</div>
            <div className="flex justify-between"><span className="text-[--fg]">Стоимость:</span><span className="text-[--fg-strong]">${rebuy_cost ?? cost ?? 0}</span></div>
            {rebuy_period && <div className="flex justify-between"><span className="text-[--fg]">Период:</span><span className="text-[--fg-strong]">{rebuy_period} мин</span></div>}
          </div>
        )}
        {(format==='Re-entry' || reentry_cost) && (
          <div className="rounded-lg p-3 bg-green-500/10">
            <div className="flex items-center gap-2 mb-1 text-green-300"><Plus className="w-4 h-4"/>Повторный вход</div>
            <div className="flex justify-between"><span className="text-[--fg]">Стоимость:</span><span className="text-[--fg-strong]">${reentry_cost ?? cost ?? 0}</span></div>
            {reentry_period && <div className="flex justify-between"><span className="text-[--fg]">Период:</span><span className="text-[--fg-strong]">{reentry_period} мин</span></div>}
          </div>
        )}
        {addon_cost && (
          <div className="rounded-lg p-3 bg-purple-500/10">
            <div className="flex items-center gap-2 mb-1 text-purple-300"><Plus className="w-4 h-4"/>Дополнительные фишки</div>
            <div className="flex justify-between"><span className="text-[--fg]">Стоимость:</span><span className="text-[--fg-strong]">${addon_cost}</span></div>
            {addon_period && <div className="flex justify-between"><span className="text-[--fg]">Доступно:</span><span className="text-[--fg-strong]">{addon_period} мин</span></div>}
          </div>
        )}
        {late_registration_fee && (
          <div className="rounded-lg p-3 bg-orange-500/10">
            <div className="flex items-center gap-2 mb-1 text-orange-300"><Clock className="w-4 h-4"/>Поздняя регистрация</div>
            <div className="flex justify-between"><span className="text-[--fg]">Сбор:</span><span className="text-[--fg-strong]">${late_registration_fee}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}