// frontend/src/app/sections/RatingPreview.jsx

import React from 'react';
import { Card } from '@/ui/surfaces/Card';

export function RatingPreview() {
  const rows = [
    { pos: 1, tag: 'АП', name: 'Александр П.', pts: 1540, win: '68%' },
    { pos: 2, tag: 'МИ', name: 'Максим И.', pts: 1512, win: '64%' },
    { pos: 3, tag: 'ЕС', name: 'Елена С.', pts: 1498, win: '72%' },
  ];

  const getPositionAccent = (pos) => {
    if (pos === 1) return 'bg-[--gold] text-[--bg-0]';
    if (pos === 2) return 'bg-gray-400 text-[--bg-0]';
    if (pos === 3) return 'bg-amber-600 text-[--bg-0]';
    return 'bg-[--glass-bg] text-[--fg]';
  };

  return (
    <section className="mb-16">
      <Card variant="glass" padding="lg" elevation="s">
        <Card.Header className="mb-6">
          <h2 className="text-2xl font-bold text-[--fg-strong] font-brand tracking-wide">
            Рейтинг игроков клуба
          </h2>
          <span className="text-sm text-[--fg] opacity-70 bg-[--glass-bg] px-3 py-1 rounded-full border border-[--glass-border]">
            демо
          </span>
        </Card.Header>
        
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[--glass-border]">
                  <th className="text-left py-4 pr-6 text-sm font-semibold text-[--fg] opacity-80 uppercase tracking-wider">
                    Позиция
                  </th>
                  <th className="text-left py-4 pr-6 text-sm font-semibold text-[--fg] opacity-80 uppercase tracking-wider">
                    Игрок
                  </th>
                  <th className="text-right py-4 pr-6 text-sm font-semibold text-[--fg] opacity-80 uppercase tracking-wider">
                    Очки
                  </th>
                  <th className="text-right py-4 text-sm font-semibold text-[--fg] opacity-80 uppercase tracking-wider">
                    Винрейт
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr 
                    key={r.pos} 
                    className={`border-b border-[--glass-border] hover:bg-white/5 transition-colors duration-200 ${
                      idx === rows.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 pr-6">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getPositionAccent(r.pos)}`}>
                        {r.pos}
                      </div>
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[--glass-bg] border border-[--glass-border] font-bold text-sm text-[--fg-strong] mr-3">
                          {r.tag}
                        </span>
                        <span className="font-medium text-[--fg-strong] text-base">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span className="font-bold text-lg text-[--fg-strong]">{r.pts}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-semibold text-base text-[--success]">{r.win}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}
