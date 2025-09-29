import React from 'react';

export function GalleryCta() {
  return (
    <section id="gallery" className="mb-10">
      <div className="rounded-[var(--radius)] border border-[--glass-border] bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-5 grid md:grid-cols-2 gap-5 items-center">
        <div>
          <h2 className="text-xl font-semibold text-[--fg-strong]">Галерея</h2>
          <p className="mt-2 text-[--fg] opacity-85">Фотоотчёты с ивентов клуба.</p>
        </div>
        <div className="h-28 rounded-lg border border-[--glass-border] bg-white/5 grid place-items-center text-[--fg] opacity-80">
          Баннер (заглушка)
        </div>
      </div>
    </section>
  );
}
