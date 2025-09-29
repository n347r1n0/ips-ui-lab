// frontend/src/demo/tournaments/RegistrationConfirmationModal.jsx

import React, { useState } from 'react';
import { Modal } from '@/ui/surfaces/Modal';
import { Button } from '@/ui/primitives/Button';
import { DollarSign, CalendarDays, Clock } from 'lucide-react';
import { BuyInSummary } from './BuyInSummary';
import { BlindsStructureViewer } from './BlindsStructureViewer';

export function RegistrationConfirmationModal({ t, open, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const date = new Date(t.date);
  const fmtDate = date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fmtTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // демо: небольшая задержка
      await new Promise((r) => setTimeout(r, 500));
      onConfirm?.();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} size="xl" aria-labelledby="reg-confirm-title">
      <Modal.Header onClose={onClose}>
        <span id="reg-confirm-title" className="font-brand">Подтверждение регистрации</span>
      </Modal.Header>

      <Modal.Body className="[scrollbar-gutter:stable_both-edges]">
        {/* Турнир — краткая сводка */}
        <div className="bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] rounded-[var(--radius)] p-4 md:p-5 mb-4">
          <div className="text-[--fg-strong] text-lg font-semibold mb-1">{t.name}</div>
          <div className="flex items-center gap-4 text-sm text-[--fg] opacity-80">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {fmtDate}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {fmtTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Формат: {t.format || 'Freezeout'}
            </span>
          </div>
        </div>

        {/* Две стеклянные карточки рядом на lg, в столбик на sm */}
        <div className="grid lg:grid-cols-2 gap-4">
          <BuyInSummary
            settings={t.settings?.buyInSettings}
            format={t.format}
            cost={t.settings?.buyInCost}
          />
          <BlindsStructureViewer structure={t.settings?.blinds || []} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="glass" onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          {loading ? 'Регистрация…' : 'Подтвердить регистрацию'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
