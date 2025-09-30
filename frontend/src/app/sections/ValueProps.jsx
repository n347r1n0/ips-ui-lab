// frontend/src/app/sections/ValueProps.jsx

import React from 'react';
import { Card } from '@/ui/surfaces/Card';

const ValueBox = ({ title, children, accent = false }) => (
  <Card variant="glass" padding="md" elevation="s" className="relative group hover:shadow-[var(--shadow-m)] transition-all duration-300">
    {/* Subtle gold accent for middle card */}
    {accent && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[--gold] opacity-30 rounded-full" />
    )}
    
    <div className="pt-2">
      <h3 className="text-xl font-bold text-[--fg-strong] font-brand tracking-wide">
        {title}
      </h3>
      <p className="mt-4 text-[--fg] opacity-90 leading-relaxed">
        {children}
      </p>
    </div>
  </Card>
);

export function ValueProps() {
  return (
    <section className="mb-16 grid gap-6 md:grid-cols-3">
      <ValueBox title="Приватность">
        Лофт-пространство, закрытые события для избранных участников.
      </ValueBox>
      <ValueBox title="Игра" accent>
        Сертифицированное оборудование и профессиональные форматы.
      </ValueBox>
      <ValueBox title="Сообщество">
        Сильные участники, нетворкинг и атмосфера высокого уровня.
      </ValueBox>
    </section>
  );
}
