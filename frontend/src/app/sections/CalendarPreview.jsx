import React from 'react';
import { Button } from '@/ui/primitives/Button';

export function CalendarPreview({ onOpenTournaments }) {
  return (
    <section id="calendar" className="mb-10">
      <div className="rounded-[var(--radius)] border border-[--glass-border] bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[--fg-strong]">Календарь турниров</h2>
          <Button variant="glass" onClick={onOpenTournaments}>Открыть ближайшие</Button>
        </div>
        <div className="mt-4 h-40 rounded-lg border border-[--glass-border] bg-white/5 grid place-items-center text-[--fg] opacity-80">
          Превью календаря (заглушка)
        </div>
      </div>
    </section>
  );
}
