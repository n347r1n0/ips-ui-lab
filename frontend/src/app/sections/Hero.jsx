// frontend/src/app/sections/Hero.jsx

import React from 'react';
import { Button } from '@/ui/primitives/Button';
import { Card } from '@/ui/surfaces/Card';

export function Hero({ onOpenTournaments }) {
  return (
    <section className="mb-16">
      <Card variant="glass" padding="lg" elevation="m" className="relative overflow-hidden">
        {/* Subtle gold accent element */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-1 h-full bg-[--gold] opacity-20 rounded-l-[var(--radius)]"
        />
        
        <div className="relative">
          <h1 className="font-brand text-4xl md:text-5xl lg:text-6xl text-[--fg-strong] tracking-tight leading-tight">
            International Poker Style
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[--fg] opacity-90 max-w-3xl leading-relaxed">
            Приватный клуб спортивного покера. Лучшие условия, стиль и сообщество.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onOpenTournaments}
              className="text-base px-8 py-3 font-medium"
            >
              Ближайшие турниры
            </Button>
            <Button 
              variant="glass" 
              asChild
              className="text-base px-8 py-3 font-medium"
            >
              <a href="#calendar">Календарь</a>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}