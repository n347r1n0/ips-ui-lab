import React from 'react';

export function RatingPreview() {
  const rows = [
    { pos: 1, tag: 'АП', name: 'Александр П.', pts: 1540, win: '68%' },
    { pos: 2, tag: 'МИ', name: 'Максим И.', pts: 1512, win: '64%' },
    { pos: 3, tag: 'ЕС', name: 'Елена С.', pts: 1498, win: '72%' },
  ];
  return (
    <section id="rating" className="mb-10">
      <div className="rounded-[var(--radius)] border border-[--glass-border] bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[--fg-strong]">Рейтинг игроков клуба</h2>
          <span className="text-sm text-[--fg] opacity-80">демо</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[--fg] opacity-70">
              <tr>
                <th className="text-left py-2 pr-4">#</th>
                <th className="text-left py-2 pr-4">Игрок</th>
                <th className="text-right py-2 pr-4">Очки</th>
                <th className="text-right py-2">Вин%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.pos} className="border-t border-[--glass-border]">
                  <td className="py-2 pr-4">{r.pos}</td>
                  <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded bg-white/10 mr-2">{r.tag}</span>{r.name}</td>
                  <td className="py-2 pr-4 text-right">{r.pts}</td>
                  <td className="py-2 text-right">{r.win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
