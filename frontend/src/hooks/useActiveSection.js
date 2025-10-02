import { useEffect, useState } from 'react';

/**
 * Следит за видимостью секций и возвращает id активной.
 * Секциям назначаем id и атрибут id="section-<id>" на контейнере.
 */
export function useActiveSection(ids = []) {
  const [active, setActive] = useState(ids[0] || null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(`section-${id}`))
      .filter(Boolean);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // берём ту, у которой наибольшая видимая площадь и центр в зоне
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const el = visible[0].target;
          const id = el.getAttribute('data-nav-id');
          if (id) setActive(id);
        }
      },
      {
        root: null,
        // зона интереса: верхние 20% экрана игнорим, нижние 20% игнорим
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids.join('|')]);

  return active;
}
