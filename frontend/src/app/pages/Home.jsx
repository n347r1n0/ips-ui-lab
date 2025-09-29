import React from 'react';
import { Hero } from '@/app/sections/Hero';
import { ValueProps } from '@/app/sections/ValueProps';
import { CalendarPreview } from '@/app/sections/CalendarPreview';
import { RatingPreview } from '@/app/sections/RatingPreview';
import { GalleryCta } from '@/app/sections/GalleryCta';

export function Home({ onOpenTournaments }) {
  return (
    <>
      <Hero onOpenTournaments={onOpenTournaments} />
      <ValueProps />
      <CalendarPreview onOpenTournaments={onOpenTournaments} />
      <RatingPreview />
      <GalleryCta />
    </>
  );
}
