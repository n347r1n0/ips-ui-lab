// frontend/src/demo/tournaments/UpcomingTournamentsModal.jsx
import React, { useState } from 'react';
import { GlassModal } from '@/ui/patterns/modals/GlassModal';
import { Button } from '@/ui/primitives/Button';
import { TournamentCard } from './TournamentCard';
import { RegistrationConfirmationModal } from './RegistrationConfirmationModal';
import { useToast } from '@/ui/surfaces/Toast';

export function UpcomingTournamentsModal({ items = [], onClose }) {
  const [registered, setRegistered] = useState(new Set());
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const isReg = (id) => registered.has(id);
  const addReg = (id) => setRegistered((p) => new Set(p).add(id));
  const removeReg = (id) => setRegistered((p) => { const n = new Set(p); n.delete(id); return n; });

  return (
    <>
      <GlassModal
        title="Ближайшие турниры"
        onClose={onClose}
        size="xl"
        headerDeco
        headerVariant="solid"
        footerVariant="glass"
        footer={
          <>
            <Button variant="glass" onClick={onClose}>Закрыть</Button>
            <Button onClick={onClose}>Готово</Button>
          </>
        }
      >
        {items.length === 0 ? (
          <div className="text-[--fg] opacity-80">Нет предстоящих турниров</div>
        ) : (
          <div className="space-y-3">
            {items.map((t) => (
              <TournamentCard
                key={t.id}
                t={t}
                registered={isReg(t.id)}
                onRegister={() => setConfirm(t)}
                onCancel={() => removeReg(t.id)}
              />
            ))}
          </div>
        )}
      </GlassModal>

      {confirm && (
        <RegistrationConfirmationModal
          t={confirm}
          open
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            addReg(confirm.id);
            toast.success(`Вы записаны: ${confirm.name}`);
            setConfirm(null);
          }}
        />
      )}
    </>
  );
}
