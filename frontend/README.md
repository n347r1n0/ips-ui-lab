# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# FloatingChipWheel — план улучшений

## P1 · UX-полировка (ощущение и отклик)

* [ ] Мягкий **щелчок-снап**
  *Что:* короткий haptic/звук + `scale`-pulse активной ячейки.
  *Как:* `onSnapCommit(id)` → `navigator.vibrate(8)` (если доступно) + опциональный аудио-хук; активная иконка на `transform: scale(1.06–1.10)` c 120–160 ms ease-out.
  *Готово когда:* тактильный/звуковой отклик не накладывается при быстрых сериях; pulse не «раздувает» хит-зону.

* [ ] **Активная ячейка** как единственный акцент
  *Что:* убрать фон у неактивных; активной — мягкая подсветка/тень.
  *Как:* вариант скина: `decorateIcon({isActive})`; токены интенсивности.
  *Готово когда:* на любом фоне читаема активная, визуального «шума» у остальных нет.

* [ ] **Дуга-индикатор** при драге
  *Что:* тонкая золотая «наводка» в центральной зоне; плавное появление/затухание.
  *Как:* отдельный слой `conic-gradient` с `opacity` анимируемой через CSS; включается только при активном жесте.
  *Готово когда:* без рывков, не перекрывает иконки.

* [ ] **Кликабельная подпись** секции
  *Что:* тап по лейблу открывает компактный список/радиальный селектор; выбор → `snapTo(id)` **без** внешней синхры.
  *Как:* локальный popover (портал), навигация клавиатурой; закрытие — по выбору/blur/escape.
  *Готово когда:* не конфликтует со свайпом, не вызывает «флики».

---

## P2 · Визуал/скины

* [ ] Стеклянная палитра в токены
  *Что:* `--chip-glass-red`, `--chip-glass-ivory`, `--chip-glass-gap`, интенсивности/blur.
  *Готово когда:* все цвета/альфы вне JSX; легко крутятся темой.

* [ ] Настройка «визуальных клиньев»
  *Что:* `visualWedgeDeg` (по умолчанию = `stepDeg`), чтобы узор можно было делать чаще/реже пунктов без ломки логики.
  *Готово когда:* узор стабильный при любом значении; шва не видно.

* [ ] Лёгкий anti-bleed
  *Что:* микросмещение/оверлап клиньев на 0.5–1° и аккуратные разделители.
  *Готово когда:* нет «просветов» на ретине и при масштабировании.

---

## P2 · Надёжность/синхронизация

* [ ] «Единый источник правды» зафиксировать в API
  *Что:* `onSnapCommit(id)` (момент выбора пользователем) и `onExternalSync(id)` (подвод к внешнему состоянию).
  *Готово когда:* внешние апдейты игнорируются во время интеракции/settle, фликов нет.

* [ ] Тест-матрица шва
  *Что:* автопроверки для разных `stepDeg` (кратно/некратно 360), `dock`, плотности пикселей.
  *Готово когда:* визуальные артефакты не воспроизводятся.

---

## P3 · Доступность

* [ ] Полная ARIA навигация
  *Что:* `role="tablist"` у колеса, `role="tab"` у иконок, `aria-selected`, клавиши `←/→/Enter/Escape`.
  *Готово когда:* WCAG-навигация проходит без мыши.

* [ ] Reduced-motion дружелюбность
  *Что:* все анимации уважают `prefers-reduced-motion`.
  *Готово когда:* на RMP переходы мгновенные.

---

## P3 · Производительность/Dev-опыт

* [ ] Безопасные градиенты
  *Что:* максимум 3–4 слоёв conic/radial; никаких DOM-узлов «на сектор».
  *Готово когда:* FPS стабильный на бюджетных девайсах.

* [ ] Playground для скинов
  *Что:* маленькая страница с лайв-контроллами (`stepDeg`, `phaseDeg`, альфы стекла).
  *Готово когда:* можно воспроизвести и диагностировать «шов»/сдвиг за 10 сек.

---

### Примечания к текущему состоянию

* Временно используем костыль `stepDeg={36}` (чётное число визуальных клиньев) — стабильная, «без скачков» конфигурация.
* Фаза узора непрерывная: `phase = center + phaseDeg - stepF*stepDeg`; тонкая подстройка совпадения — `phaseDeg`.
