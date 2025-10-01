// frontend/src/demo/tournaments/TournamentListForDay.jsx

import React, { useMemo, useState } from 'react';
import { Modal } from '@/ui/surfaces/Modal';
import { Button } from '@/ui/primitives/Button';
import { TournamentCard } from './TournamentCard';

export function TournamentListForDay({ items = [], onClose }) {
  const [registered, setRegistered] = useState(new Set());

  // Заголовок: дата из первого элемента (если есть)
  const { titleDate, list } = useMemo(() => {
    if (!items.length) return { titleDate: null, list: [] };
    const first = new Date(items[0].date);
    const sameDay = items.filter(t => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === first.getFullYear() &&
        d.getMonth() === first.getMonth() &&
        d.getDate() === first.getDate()
      );
    });
    const title =
      first.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    return { titleDate: title, list: sameDay };
  }, [items]);

  const register = (id) => setRegistered(prev => new Set(prev).add(id));
  const cancel = (id) => setRegistered(prev => { const s=new Set(prev); s.delete(id); return s; });

  return (
    <Modal open={true} onClose={onClose} size="lg" aria-labelledby="day-title">
      <Modal.Header onClose={onClose}>
        <span id="day-title" className="font-brand">
          Турниры на {titleDate ?? 'выбранный день'}
        </span>
      </Modal.Header>

      <Modal.Body className="[scrollbar-gutter:stable_both-edges]">
        {list.length === 0 ? (
          <div className="text-[--fg] opacity-80">На этот день турниров нет</div>
        ) : (
          <div className="space-y-3">
            {list.map(t => (
              <TournamentCard
                key={t.id}
                t={t}
                registered={registered.has(t.id)}
                onRegister={() => register(t.id)}
                onCancel={() => cancel(t.id)}
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
  );
}
