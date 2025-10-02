// frontend/src/app/pages/Home.jsx

import React from 'react';
import { Hero } from '@/app/sections/Hero';
import { ValueProps } from '@/app/sections/ValueProps';
import { CalendarPreview } from '@/app/sections/CalendarPreview';
import { RatingPreview } from '@/app/sections/RatingPreview';
import { GalleryCta } from '@/app/sections/GalleryCta';
import { SectionSeparator } from '@/ui/layout/SectionSeparator';
import { MobileChipTabs } from '@/ui/patterns/MobileChipTabs';
import { SectionAnchor } from '@/ui/patterns/SectionAnchor';
import { useSectionNav } from '@/hooks/useSectionNav';
import { SECTIONS } from '@/ui/navigation/sections';

export function Home({ onOpenTournaments }) {
  // 1. Сохраняем ваш работающий хук
  const ids = SECTIONS.map(s => s.id);
  const { activeId, scrollTo, register } = useSectionNav(ids);

  // 2. Преобразуем данные специально для MobileChipTabs, добавляя JSX с иконками
  const mobileChipItems = SECTIONS.map(s => ({
    id: s.id,
    label: s.label,
    icon: s.Icon ? <s.Icon className="w-4 h-4" aria-hidden="true" /> : null,
  }));


  return (
    <div className="space-y-0">
      {/* 3. Сохраняем ваши компоненты SectionAnchor */}
      <SectionAnchor id="hero" register={register}>
        <Hero onOpenTournaments={onOpenTournaments} />
      </SectionAnchor>

      <SectionSeparator thickness="2px" />
      <SectionAnchor id="about" register={register}>
        <ValueProps />
      </SectionAnchor>

      <SectionSeparator thickness="2px" />
      <SectionAnchor id="calendar" register={register}>
        <CalendarPreview onOpenTournaments={onOpenTournaments} />
      </SectionAnchor>

      <SectionSeparator thickness="2px" />
      <SectionAnchor id="rating" register={register}>
        <RatingPreview />
      </SectionAnchor>

      <SectionSeparator thickness="2px" />
      <SectionAnchor id="gallery" register={register}>
        <GalleryCta />
      </SectionAnchor>

      {/* 4. Передаем в мобильные табы новый, преобразованный массив */}
      <div className="sm:hidden">
        <MobileChipTabs
          items={mobileChipItems}
          activeId={activeId}
          onTabClick={scrollTo}
        />
      </div>
    </div>
  );
}

