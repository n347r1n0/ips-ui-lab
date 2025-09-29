import React from 'react';

const Box = ({ title, children }) => (
  <div className="rounded-[var(--radius)] border border-[--glass-border] bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-5">
    <div className="text-lg font-semibold text-[--fg-strong]">{title}</div>
    <p className="mt-2 text-[--fg] opacity-85">{children}</p>
  </div>
);

export function ValueProps() {
  return (
    <section className="mb-10 grid gap-4 md:grid-cols-3">
      <Box title="Приватность">Лофт-пространство, закрытые события.</Box>
      <Box title="Игра">Сертифицированное оборудование и форматы.</Box>
      <Box title="Сообщество">Сильные участники и нетворкинг.</Box>
    </section>
  );
}
