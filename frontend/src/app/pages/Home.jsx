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
import { FloatingChipWheel } from '@/ui/patterns/FloatingChipWheel';

export function Home({ onOpenTournaments }) {
  const ids = SECTIONS.map(s => s.id);
  const { activeId, scrollTo, register } = useSectionNav(ids);

  // Таб-лента для мобилы: id, подпись и готовый JSX с иконкой
  const mobileChipItems = SECTIONS.map(s => ({
    id: s.id,
    label: s.label,
    icon: s.Icon ? <s.Icon className="w-4 h-4" aria-hidden="true" /> : null,
  }));

  return (
    <div className="space-y-0">
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

      {/* Мобильные табы (прямая альтернатива кругу) */}
      <div className="sm:hidden">
        <MobileChipTabs
          items={mobileChipItems}
          activeId={activeId}
          onTabClick={scrollTo}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────
         КРУГОВАЯ «ФИШКА» (FloatingChipWheel)
         — все ключевые настройки сведены в одном месте.
         — дефолты живут в FloatingChipWheel.jsx и pokerSkin.jsx,
           а здесь мы переопределяем то, что нужно для экрана.
         ─────────────────────────────────────────────────────────────── */}
      <FloatingChipWheel
        /* 📦 ДАННЫЕ / API */
        items={mobileChipItems}     // список секций { id, label, icon }
        activeId={activeId}         // текущая активная секция (внешняя правда)
        onSelect={scrollTo}         // клик/снап → скролл к секции

        /* 📍 РАЗМЕЩЕНИЕ */
        dock="br"                   // угол привязки: 'br' | 'bl' | 'tr' | 'tl'
        // offset={{ x: -36, y: -15 }} // смещение от угла (px); дефолт устроил
        // hideOnDesktop={true}         // скрывать на ≥sm (дефолт true)
        // className=""                 // при необходимости можно добавить классы

        /* 📐 ГЕОМЕТРИЯ / ВИЗУАЛ ОБЩИЙ */
        // size={230}                  // ⌀ фишки, px (дефолт 230)
        // radius={99}                 // радиус дорожки иконок, px (дефолт 99)
        // centerAngle                 // если не задан — вычислим из dock
        stepDeg={36}                 // фикс: чётное число клиньев — стабильнее
        // iconSize={17}              // размер глифа иконки, px (дефолт 17)
        // chipSize={25}              // размер «слота» иконки, px (дефолт 25)
        // labelOffset={{ x: -12, y: -18 }} // смещение подписи (дефолт)
        labelClassName="text-left text-m px-2 py-1"


        /* 🔉 Щелчки */
//        sound={{ src: '/sounds/snap-click.mp3', volume: 0.05 }}
        sound={{ enabled: true, snap: 0.15, tick: 0.02 }}




        /* ✋ ЖЕСТЫ / ПОВЕДЕНИЕ */
        // enableSwipe={true}         // свайп по дуге (дефолт true)
        // deadzonePx={6}             // порог старта драга (дефолт 6)
        // snapDurationMs={160}       // длительность доводки снапа (дефолт 160ms)
        // showDragIndicator={true}   // дуга-подсказка (в poker-скине не используется)

        /* 🎨 СКИН */
        skin="poker"                 // визуальная оболочка
        skinProps={{
          /* 🎨 Палитра скина (токены/градиенты)
             'titanium' | 'glassRedIvory' | 'silver'
             Можно задать свои цвета через объект palette в пресетах. */
          palette: 'silver',

          /* ⚪ Центр: тип визуала
             'bezel' — центральный диск + нижний диск-подложка с inset-тенями
             'bowl'  — мягкая вогнутая чаша (как раньше, без изменений) */
          center: 'bezel',

          /* ⚪ Геометрия центра */
          cupInnerR: 75,            // радиус центрального диска, px

          /* ⭕ Нижний диск-подложка (видимая «полка» вокруг центрального)
             — enabled: включение слоя
             — match: 'red'|'ivory'|'none' — подгон цвета как у клиньев (через те же tint-альфы);
                      если нужен свой цвет/градиент — используйте underDiskFill
             — extraPx: насколько нижний диск больше центрального (создает ширину «полки»)
             — brightness: равномерно осветлить/затемнить подложку
             — inset-тени: тёмная и тонкий светлый кант по внутренней кромке */
          underDiskEnabled: true,
          underDiskMatch: 'red',
          underDiskExtraPx: 11,
          underDiskBlurPx: 12,
          underDiskInsetDark: 0.65,
          underDiskInsetLight: 0.24,
          underDiskBrightness: 1.2,
          // underDiskFill: 'var(--brand-crimson)', // вместо match — задать сплошной или градиент

          /* 💡 Центральный диск: тонкий внутренний светлый кант + вариант шейдинга */
          centerInsetLight: 0.12,   // 0..1 — тонкий «ободок» изнутри
          centerInvertShading: false, // false: светлее из центра; true: свет по краям

          /* 🌫 Drop-тени ОТ центрального НА нижний
             — мягкая тёмная и лёгкая светлая (для «парения» диска) */
          // centerDropDarkAlpha: 0.28,  // по умолчанию из скина
          // centerDropDarkBlur: 16,
          centerDropLightAlpha: 0.12,
          centerDropLightBlur: 12,

          /* 🪟 «Стекло» и клинья обода */
          rimWidth: 30,             // толщина цветного обода (кольца) в px
          gapDeg: 1,                // ширина разделителя между клиньями, deg
          // visualWedgeDeg: null,  // если задать — частота «визуальных клиньев» ≠ stepDeg
          phaseDeg: 0,              // тонкая подстройка совмещения клина с иконкой
          overlapDeg: 0.0,          // небольшой оверлап клиньев против «щелей»
          blurPx: 8,                // сила размытия стекла
          saturate: 1.12,           // насыщенность фона под стеклом
          brighten: 1.04,           // яркость фона под стеклом
          showGaps: true,           // рисовать тонкие разделители поверх узора
          gapAlpha: 0.28,           // прозрачность разделителей






          /* ✨ Активная иконка — настройки в pokerSkin.jsx (activeIcon):
             по умолчанию: золотая мягкая подложка, лёгкий glow и scale.
             — Переопределять можно так:
             activeIcon: {
               ringEnabled: true,
               ringAlpha: 0.18,
               ringRadiusPx: 20,
               ringSoftPx: 10,
               scale: 1.2,
               glow: 0.30,
               insetGlow: 0.12,
               glyph: 'inherit', // 'inherit' | 'gold' | 'custom'
               activeGlyphColor: 'var(--gold, #D4AF37)',
             }
          */
        }}

        /* ─────────────── НЕИСПОЛЬЗУЕМЫЕ ЗДЕСЬ / ДЕФОЛТНЫЕ (для шпаргалки) ───────────────
           — Включать по необходимости: раскомментируйте и поменяйте значение.
           skinProps:
             // visualWedgeDeg={null}   // «частота» декоративных клиньев
             // palette={'titanium'}    // другая базовая палитра скина
             // center={'bowl'}         // вернуть чашу
             // centerDropDarkAlpha={0.28}
             // centerDropDarkBlur={16}
             // underDiskFill={'#RRGGBB' | 'radial-gradient(...)'}
        */
      />
    </div>
  );
}
