// frontend/src/app/pages/Home.jsx

import React from 'react';
import { Hero } from '@/app/sections/Hero';
import { ValueProps } from '@/app/sections/ValueProps';
import { CalendarPreview } from '@/app/sections/CalendarPreview';
import { RatingPreview } from '@/app/sections/RatingPreview';
import { GalleryCta } from '@/app/sections/GalleryCta';
import { SectionSeparator } from '@/ui/layout/SectionSeparator';
import { MobileChipTabs } from '@/ui/patterns/MobileChipTabs';
import { useActiveSection } from '@/hooks/useActiveSection';


export function Home({ onOpenTournaments }) {

  const navItems = [
    { id: 'hero',      label: 'Главная' },
    { id: 'about',     label: 'О клубе' },
    { id: 'rating',    label: 'Рейтинг' },
    { id: 'calendar',  label: 'Календарь' },
    { id: 'gallery',   label: 'Галерея' },
  ];
  const activeId = useActiveSection(navItems.map(i => i.id));
  const scrollTo = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };



  return (
    <div className="space-y-0">
      ---<Hero onOpenTournaments={onOpenTournaments} />
      <div id="section-hero" data-nav-id="hero"><Hero onOpenTournaments={onOpenTournaments} /></div>
      
      <SectionSeparator />
      ---<ValueProps />
      <div id="section-about" data-nav-id="about"><ValueProps /></div>


      <SectionSeparator />
      ---<CalendarPreview onOpenTournaments={onOpenTournaments} />
      <div id="section-calendar" data-nav-id="calendar"><CalendarPreview onOpenTournaments={onOpenTournaments} /></div>

      <SectionSeparator />
      ---<RatingPreview />
      <div id="section-rating" data-nav-id="rating"><RatingPreview /></div>

      <SectionSeparator />
      ---<GalleryCta />
      <div id="section-gallery" data-nav-id="gallery"><GalleryCta /></div>

      {/* Мобильная лента — показываем только на узких экранах */}
      <div className="sm:hidden">
        <MobileChipTabs
          items={navItems}
          activeId={activeId}
          onTabClick={scrollTo}
        />
      </div>

    </div>
  );
}
