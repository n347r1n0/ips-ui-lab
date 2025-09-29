// frontend/src/demo/tournaments/fixtures.js

// базовые 3
const seed = [
  {
    id: 1,
    name: 'IPS Freeroll',
    date: '2025-10-05T19:00:00',
    visualType: 'Фриролл',
    status: 'upcoming',
    settings: {
      buyInCost: 0,
      buyInSettings: { rebuy_cost: 10, rebuy_period: 120 },
      blinds: [
        { sb: 25, bb: 50, ante: 0, duration: 20 },
        { sb: 50, bb: 100, ante: 0, duration: 20 },
        { is_break: true, duration: 10 },
      ],
    },
    format: 'Re-buy',
  },
  {
    id: 2,
    name: 'Weekly Deepstack',
    date: '2025-10-07T19:30:00',
    visualType: 'Рейтинговый',
    status: 'upcoming',
    settings: { buyInCost: 55 },
    format: 'Freezeout',
  },
  {
    id: 3,
    name: 'Saturday Special',
    date: '2025-10-11T18:00:00',
    visualType: 'Специальный',
    status: 'upcoming',
    settings: { buyInCost: 100, buyInSettings: { reentry_cost: 100, reentry_period: 150 } },
    format: 'Re-entry',
  },
];

// хелпер для генерации дат
const iso = (y, m, d, h = 19, min = 0) =>
  new Date(Date.UTC(y, m - 1, d, h, min)).toISOString();

// генерация ещё N штук
const generated = Array.from({ length: 17 }, (_, idx) => {
  const i = idx + 4; // id с 4
  const day = 10 + (i % 10); // просто разнести по числам месяца
  const visualType = i % 4 === 0 ? 'Стандартный' : i % 3 === 0 ? 'Фриролл' : 'Рейтинговый';
  const format = i % 3 === 0 ? 'Re-buy' : 'Freezeout';
  const cost = (i % 3) * 25;

  return {
    id: i,
    name: `Weekly #${i}`,
    date: iso(2025, 10, day, 19, 0),
    visualType,
    status: 'upcoming',
    settings: { buyInCost: cost },
    format,
  };
});

// итоговый экспорт — «база + сгенерённые»
export const tournaments = [...seed, ...generated];
