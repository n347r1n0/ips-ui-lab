//  frontend/src/demo/tournaments/BlindsStructureViewer.jsx

import React from 'react';
import { TrendingUp, Coffee, Clock } from 'lucide-react';

export function BlindsStructureViewer({ structure = [] }) {
  const box = 'bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] rounded-[var(--radius)] p-4';
  if (!structure.length) return (
    <div className={box}>
      <h4 className="text-[--fg-strong] mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold-accent"/>Структура блайндов</h4>
      <p className="text-[--fg] opacity-70">Структура блайндов не настроена</p>
    </div>
  );

  const mins = (m)=> m>=60? `${Math.floor(m/60)}ч ${m%60||''}м`.trim(): `${m}м`;
  const total = structure.reduce((s,l)=>s+(l.duration||0),0);

  let levelIndex=0;
  return (
    <div className={box}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[--fg-strong] flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold-accent"/>Структура блайндов</h4>
        <div className="text-xs text-[--fg] opacity-70">~{mins(total)}</div>
      </div>
      <div className="max-h-64 overflow-y-auto [scrollbar-gutter:stable] space-y-2">
        {structure.map((l,i)=> l.is_break ? (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-200"><Coffee className="w-4 h-4"/>Перерыв</div>
            <div className="text-xs text-[--fg] opacity-80 flex items-center gap-1"><Clock className="w-3 h-3"/>{mins(l.duration||0)}</div>
          </div>
        ) : (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gold-accent/20 text-gold-accent text-xs font-bold flex items-center justify-center">{++levelIndex}</div>
              <div>
                <div className="text-[--fg-strong] text-sm">{l.sb}/{l.bb}{l.ante? <span className="text-[--fg] opacity-70 ml-2">(ante: {l.ante})</span>: null}</div>
                <div className="text-[--fg] opacity-70 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/>{mins(l.duration||0)}</div>
              </div>
            </div>
            <div className="text-right text-xs text-[--fg] opacity-80">SB: {l.sb} • BB: {l.bb}</div>
          </div>
        ))}
      </div>
    </div>
  );
}