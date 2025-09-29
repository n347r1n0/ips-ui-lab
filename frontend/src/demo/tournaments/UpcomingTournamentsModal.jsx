// frontend/src/demo/tournaments/UpcomingTournamentsModal.jsx

import React, { useState } from 'react';
import { Modal } from '@/ui/surfaces/Modal';
import { Button } from '@/ui/primitives/Button';
import { TournamentCard } from './TournamentCard';
import { RegistrationConfirmationModal } from './RegistrationConfirmationModal';
import { useToast } from '@/ui/surfaces/Toast';


export function UpcomingTournamentsModal({ items = [], onClose }) {
  const [registered, setRegistered] = useState(new Set());
  const [confirm, setConfirm] = useState(null); // t для подтверждения
  const toast = useToast();

  const isReg = (id) => registered.has(id);
  const addReg = (id) => setRegistered((prev) => new Set(prev).add(id));
  const removeReg = (id) =>
    setRegistered((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  return (
    <>
      <Modal open={true} onClose={onClose} size="xl" aria-labelledby="upcoming-title">
        <Modal.Header onClose={onClose}>
          <span id="upcoming-title" className="font-brand">Ближайшие турниры</span>
        </Modal.Header>

        <Modal.Body className="[scrollbar-gutter:stable_both-edges]">
          {items.length === 0 ? (
            <div className="text-[--fg] opacity-80">Нет предстоящих турниров</div>
          ) : (
            <div className="space-y-3">
              {items.map((t) => (
                <TournamentCard
                  key={t.id}
                  t={t}
                  registered={isReg(t.id)}
                  onRegister={() => setConfirm(t)}         // сначала подтверждение
                  onCancel={() => removeReg(t.id)}         // отмена сразу
                />
              ))}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="glass" onClick={onClose}>Закрыть</Button>
          <Button onClick={onClose}>Готово</Button>
        </Modal.Footer>
      </Modal>

      {/* Подтверждение */}
      {confirm && (
        <RegistrationConfirmationModal
          t={confirm}
          open={true}
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

