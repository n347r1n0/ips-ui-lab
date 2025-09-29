import React from 'react';

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[--glass-border] bg-[--bg-1]">
      <div className="mx-auto max-w-[var(--page-max-w)] px-5 py-6 text-sm text-[--fg] opacity-80 flex flex-wrap items-center gap-3">
        <span>© {new Date().getFullYear()} IPS Club</span>
        <span className="mx-2">•</span>
        <a href="#" className="hover:text-[--fg-strong]">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}
