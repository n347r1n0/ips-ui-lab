// frontend/src/demo/tournaments/RegistrationConfirmationModal.jsx

import React, { useState } from 'react';
import { Modal } from '@/ui/surfaces/Modal';
import { Button } from '@/ui/primitives/Button';
import { Card } from '@/ui/surfaces/Card';
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
    <Modal 
      open={open} 
      onClose={onClose} 
      size="xl" 
      variant="solid" 
      backdrop="heavy"
      aria-labelledby="reg-confirm-title"
    >
      <Modal.Header onClose={onClose}>
        <span id="reg-confirm-title" className="font-brand">Подтверждение регистрации</span>
        <div className="text-sm text-[--fg] opacity-80 mt-1">
          {t.name} • {fmtDate} • {fmtTime}
        </div>
      </Modal.Header>

      <Modal.Body className="[scrollbar-gutter:stable_both-edges]">
        {/* Player info - Glass Card */}
        <Card variant="glass" padding="md" className="mb-6">
          <Card.Body>
            <div className="text-center">
              <p className="text-[--fg] opacity-90">
                Вы регистрируетесь как: <span className="text-[--fg-strong] font-medium">Демо игрок</span>
              </p>
              <p className="text-[--gold] opacity-80 text-sm mt-1">Участник клуба</p>
            </div>
          </Card.Body>
        </Card>

        {/* Tournament details - Glass Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tournament info */}
          <Card variant="glass" padding="md">
            <Card.Header>
              <h3 className="text-lg font-semibold text-[--fg-strong]">📅 Информация о турнире</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div>
                  <span className="text-[--fg] opacity-70 text-sm">Название:</span>
                  <p className="text-[--fg-strong] font-medium">{t.name}</p>
                </div>
                <div>
                  <span className="text-[--fg] opacity-70 text-sm">Формат:</span>
                  <p className="text-[--fg-strong]">{t.format || 'Freezeout'}</p>
                </div>
                <div>
                  <span className="text-[--fg] opacity-70 text-sm">Дата и время:</span>
                  <p className="text-[--fg-strong]">{fmtDate}</p>
                  <p className="text-[--fg-strong]">{fmtTime}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Buy-in summary */}
          <BuyInSummary
            settings={t.settings?.buyInSettings}
            format={t.format}
            cost={t.settings?.buyInCost}
          />
        </div>

        {/* Blinds structure - Full width */}
        <div className="mt-6">
          <BlindsStructureViewer structure={t.settings?.blinds || []} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="glass" onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button variant="clay" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Регистрация…' : 'Подтвердить регистрацию'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
