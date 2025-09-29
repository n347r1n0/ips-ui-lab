import React from 'react';
import { Button } from '@/ui/primitives/Button';

export function Hero({ onOpenTournaments }) {
  return (
    <section className="mb-10">
      <div className="rounded-[var(--radius)] border border-[--glass-border] bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-6 md:p-8 shadow-[var(--shadow-m)]">
        <h1 className="font-brand text-3xl md:text-4xl text-[--fg-strong]">International Poker Style</h1>
        <p className="mt-2 text-[--fg] opacity-85 max-w-2xl">
          Приватный клуб спортивного покера. Лучшие условия, стиль и сообщество.
        </p>
        <div className="mt-4 flex gap-2">
          <Button onClick={onOpenTournaments}>Ближайшие турниры</Button>
          <Button variant="glass" asChild>
            <a href="#calendar">Календарь</a>
          </Button>
        </div>
      </div>
    </section>
  );
}