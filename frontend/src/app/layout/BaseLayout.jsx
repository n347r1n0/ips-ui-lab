// frontend/src/app/layout/BaseLayout.jsx

import React from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function BaseLayout({ children, onOpenTournaments }) {
  return (
    <div id="home" className="min-h-screen bg-[--bg-0]">
      <SiteHeader onOpenTournaments={onOpenTournaments} />
      <main className="mx-auto max-w-[var(--page-max-w)] px-5 py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
