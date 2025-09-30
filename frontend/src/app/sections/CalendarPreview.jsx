// frontend/src/app/sections/CalendarPreview.jsx

import React from 'react';
import { Button } from '@/ui/primitives/Button';
import { Card } from '@/ui/surfaces/Card';

export function CalendarPreview({ onOpenTournaments }) {
  return (
    <section id="calendar" className="mb-16">
      <Card variant="glass" padding="lg" elevation="s">
        <Card.Header className="mb-6">
          <h2 className="text-2xl font-bold text-[--fg-strong] font-brand tracking-wide">
            Календарь турниров
          </h2>
          <Button
            variant="glass"
            onClick={onOpenTournaments}
            className="px-6 py-2.5 font-medium"
            title="Ближайшие турниры"
          >
            Открыть ближайшие
          </Button>
        </Card.Header>

        <Card.Body>
          <div className="relative h-48 rounded-xl border border-[--glass-border] bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.08)] overflow-hidden">
            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-20" aria-hidden="true">
              <div className="grid grid-cols-7 h-full">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="border-r border-[--glass-border] last:border-r-0" />
                ))}
              </div>
            </div>

            {/* Calendar preview content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🗓️</div>
                <div className="text-lg font-medium text-[--fg-strong] mb-1">
                  Превью календаря
                </div>
                <div className="text-sm text-[--fg] opacity-75">
                  Визуализация ближайших событий
                </div>
              </div>
            </div>

            {/* Subtle accent decoration */}
            <div
              aria-hidden="true"
              className="absolute top-4 right-4 w-2 h-2 bg-[--gold] opacity-40 rounded-full"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-[--gold] opacity-30 rounded-full"
            />
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}
