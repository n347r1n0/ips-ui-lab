// frontend/src/demo/tournaments/RegistrationConfirmationModal.jsx
import React, { useState } from 'react';
import { NeoModal } from '@/ui/patterns/modals/NeoModal';
import { Button } from '@/ui/primitives/Button';
import { Card } from '@/ui/surfaces/Card';
import { BuyInSummary } from './BuyInSummary';
import { BlindsStructureViewer } from './BlindsStructureViewer';

export function RegistrationConfirmationModal({ t, open, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const date = new Date(t.date);
  const fmtDate = date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const fmtTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const handleConfirm = async () => {
    setLoading(true);
    try { await new Promise(r => setTimeout(r, 500)); onConfirm?.(); } finally { setLoading(false); }
  };

  return (
    <NeoModal
      title="Подтверждение регистрации"
      onClose={onClose}
      size="xl"
      headerDeco
      headerVariant="solid"
      footerVariant="solid"
      footer={
        <>
          <Button variant="glass" onClick={onClose} disabled={loading}>Отмена</Button>
          <Button variant="clay" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Регистрация…' : 'Подтвердить регистрацию'}
          </Button>
        </>
      }
    >
      <div className="text-sm text-[--fg] opacity-80 mt-1">
        {t.name} • {fmtDate} • {fmtTime}
      </div>

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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card variant="glass" padding="md">
          <Card.Header>
            <h3 className="text-lg font-semibold text-[--fg-strong]">📅 Информация о турнире</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div><span className="text-[--fg] opacity-70 text-sm">Название:</span><p className="text-[--fg-strong] font-medium">{t.name}</p></div>
              <div><span className="text-[--fg] opacity-70 text-sm">Формат:</span><p className="text-[--fg-strong]">{t.format || 'Freezeout'}</p></div>
              <div>
                <span className="text-[--fg] opacity-70 text-sm">Дата и время:</span>
                <p className="text-[--fg-strong]">{fmtDate}</p>
                <p className="text-[--fg-strong]">{fmtTime}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <BuyInSummary settings={t.settings?.buyInSettings} format={t.format} cost={t.settings?.buyInCost} />
      </div>

      <div className="mt-6">
        <BlindsStructureViewer structure={t.settings?.blinds || []} />
      </div>
    </NeoModal>
  );
}
