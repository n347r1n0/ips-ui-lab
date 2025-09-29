import React from 'react';
import { Button } from '@/ui/primitives/Button';

export function SiteHeader({ onOpenTournaments }) {
  return (
    <header className="sticky top-0 z-50 bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border-b border-[--glass-border]">
      <div className="mx-auto max-w-[var(--page-max-w)] px-5 py-3 flex items-center gap-4">
        {/* Логотип */}
        <div className="font-brand text-xl text-[--fg-strong]">IPS</div>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-4 text-sm text-[--fg]">
          <a href="#home" className="hover:text-[--fg-strong]">Главная</a>
          <a href="#calendar" className="hover:text-[--fg-strong]">Календарь</a>
          <a href="#rating" className="hover:text-[--fg-strong]">Рейтинг</a>
          <a href="#gallery" className="hover:text-[--fg-strong]">Галерея</a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="glass" onClick={onOpenTournaments}>Ближайшие турниры</Button>
          <Button variant="glass">Вход</Button>
          <Button>Админ-панель</Button>
        </div>
      </div>
    </header>
  );
}
