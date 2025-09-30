// frontend/src/app/sections/GalleryCta.jsx

import React from 'react';
import { Card } from '@/ui/surfaces/Card';

export function GalleryCta() {
  return (
    <section id="gallery" className="mb-16">
      <Card variant="glass" padding="lg" elevation="s">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[--fg-strong] font-brand tracking-wide">
              Галерея
            </h2>
            <p className="text-lg text-[--fg] opacity-90 leading-relaxed">
              Эксклюзивные фотоотчёты с турниров и ивентов клуба. Атмосфера высокого уровня и незабываемые моменты.
            </p>
            <div className="flex items-center pt-2">
              <div className="w-12 h-0.5 bg-[--gold] opacity-40 rounded-full mr-4" aria-hidden="true" />
              <span className="text-sm text-[--fg] opacity-70 font-medium">
                Скоро доступно
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="h-40 rounded-xl border border-[--glass-border] bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.12)] overflow-hidden relative">
              {/* Photo grid simulation */}
              <div className="absolute inset-4 grid grid-cols-3 gap-2" aria-hidden="true">
                <div className="bg-[rgba(255,255,255,0.10)] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-[rgba(255,255,255,0.20)] rounded" />
                </div>
                <div className="bg-[rgba(255,255,255,0.08)] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-[rgba(255,255,255,0.15)] rounded" />
                </div>
                <div className="bg-[rgba(255,255,255,0.12)] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-[rgba(255,255,255,0.25)] rounded" />
                </div>
                <div className="bg-[rgba(255,255,255,0.06)] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-[rgba(255,255,255,0.18)] rounded" />
                </div>
                <div className="col-span-2 bg-[rgba(255,255,255,0.14)] rounded-lg flex items-center justify-center">
                  <div className="text-2xl opacity-40">📸</div>
                </div>
              </div>

              {/* Overlay with subtle gold accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-[--gold] opacity-50 rounded-full animate-pulse" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
