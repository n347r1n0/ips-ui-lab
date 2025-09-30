// frontend/src/app/pages/Home.jsx

import React from 'react';
import { Hero } from '@/app/sections/Hero';
import { ValueProps } from '@/app/sections/ValueProps';
import { CalendarPreview } from '@/app/sections/CalendarPreview';
import { RatingPreview } from '@/app/sections/RatingPreview';
import { GalleryCta } from '@/app/sections/GalleryCta';
import { SectionSeparator } from '@/ui/layout/SectionSeparator';

export function Home({ onOpenTournaments }) {
  return (
    <div className="space-y-0">
      <Hero onOpenTournaments={onOpenTournaments} />
      
      <SectionSeparator />
      <ValueProps />
      
      <SectionSeparator />
      <CalendarPreview onOpenTournaments={onOpenTournaments} />
      
      <SectionSeparator />
      <RatingPreview />
      
      <SectionSeparator />
      <GalleryCta />
    </div>
  );
}
