# CLAUDE.md — ips-ui-lab (Sandbox)

## 0) Role & Scope

You are a co-developer **only** in this project: **Vite + React 19 + Tailwind**. Your goal is to reproduce the visual and UX from PROD while working **only in the sandbox** and using our primitives/tokens.

**Strictly forbidden**

* Changing **dependencies, configs, build**, `index.html`.
* Any DB/migrations/server/edge functions.
* Opening a terminal, running scripts, ripgrep, etc.
* Touching `frontend/src/PROD_comparison/**` (reference-only).

If you want to “creatively” deviate — **propose briefly first** (what/why/impact), then edit.

---

## 1) Where to read/edit

```
frontend/src
├─ ui/
│  ├─ tokens.css                # all colors/shadows/radii — ONLY here
│  ├─ surfaces/
│  │  ├─ Modal.jsx              # unified modal
│  │  ├─ Card.jsx  Drawer.jsx  Toast.jsx GlassPanel.jsx
│  ├─ primitives/
│  │  ├─ Button.jsx  Input.jsx  Select.jsx
│  ├─ layout/
│  │  ├─ PageShell.jsx  Section.jsx  Toolbar.jsx ArtDecoDivider.jsx SectionSeparator.jsx
│  └─ feedback/
│     ├─ Spinner.jsx  Skeleton*.jsx  EmptyState.jsx  ErrorState.jsx LoadingOverlay.jsx
├─ demo/tournaments/
│  ├─ UpcomingTournamentsModal.jsx  TournamentListForDay.jsx
│  ├─ RegistrationConfirmationModal.jsx  TournamentCard.jsx
│  ├─ BuyInSummary.jsx  BlindsStructureViewer.jsx  fixtures.js
├─ app/
│  ├─ layout/
│  │  ├─ BaseLayout.jsx
│  │  ├─ SiteFooter.jsx
│  │  └─ SiteHeader.jsx
│  ├─ pages/
│  │  └─ Home.jsx
│  └─ sections/
│     ├─ CalendarPreview.jsx
│     ├─ GalleryCta.jsx
│     ├─ Hero.jsx
│     ├─ RatingPreview.jsx
│     └─ ValueProps.jsx
└─ PROD_comparison/             # reference screenshots/snippets from PROD (reference-only)
```

**Allowed to edit:** `frontend/src/**` (except configs and `index.html`).
**Do not open:** `node_modules/**`, `dist/**`, `.vite/**`, `public/**`.

**Imports via alias `@`:**

```js
import { Button } from '@/ui/primitives/Button'
```

---

## 2) Design principles

* **No “magic” values.** Colors/shadows/radii/blur — only via `ui/tokens.css`.
* Use our **primitives/surfaces/layouts**. No third-party UI kits.
* **Cancel** in modals — always `variant="glass"`. Destructive — `variant="danger"`.
* Accessibility: visible `:focus`, aria-label on icon buttons, sufficient contrast.
* In scrollable areas **do not change box-model on hover** (border-width/padding/margin/line-height). Allowed: color/opacity/background/shadow. For modal scroll bodies keep `overflow-y:auto; min-height:0;` and `scrollbar-gutter: stable both-edges`.

---

## 3) What already exists (important for parity)

* **Modal** with variants:

  * `variant="glass"` (default) and `variant="solid"` — “mother” opaque panel (neumorph).
  * `backdrop="heavy"` — denser backdrop.
  * `Modal.Header/Body/Footer` support **optional** `decoDivider` — thin art-deco line with glow.
* **Button**: `primary | secondary | glass | ghost | danger | clay`. `clay` — “physical” 3D button.
* **Tokens** for solid panels, clay buttons, art-deco divider, and backdrop are already defined in `tokens.css`.

Minimal rules:

* For large PROD-like modals: `<Modal variant="solid" backdrop="heavy" …>`.
* `Header/Footer`: by default a regular border; **if accent needed** — `decoDivider`.

---

## 4) Working style

* Make **small, localized** edits directly in sources (no “drafts” folder).
* If you add a prop/variant — briefly justify it and keep it **reversible** (no breaking API).
* Any new visual constants — first to `tokens.css`, then use in JSX.

**How to start a task:**

1. Confirm you read this file and list 5–7 rules you will follow.
2. Say **which files** you will touch and **what exact changes** you’ll make (brief).
3. Apply changes.
4. Short post-diff report (what changed visually and where to look).

---

## 5) Typical tasks (in this project)

* Assemble tournament modals (lists, confirmation) on our primitives.
* Fine-tune `Modal` (solid vs glass, backdrop, dividers, sticky slots).
* Polish buttons (primary/ghost/glass/clay) and their roles in context.
* Extend small primitives (Textarea/Checkbox/Radio/Switch) — in the spirit of Input/Select.

---

## 6) Definition of Done

* Parity with PROD in feel: background/shadows/radii/backdrop/z-index.
* All colors/shadows/radii — from `tokens.css`, **no hex in JSX**.
* Modal: `Body` uses `overflow-y:auto; min-height:0; [scrollbar-gutter:stable both-edges]`.
* Cancel = `glass`; dangerous actions = `danger`; primary/“premium” — `primary` or `clay` per task.
* No edits to configs/dependencies/DB. Imports via `@`.

---

## 7) Visual hints from PROD (reference)

Reference files for alignment are in `frontend/src/PROD_comparison/files/`
(e.g., `ModalBase.jsx`, `index.css`, `RegistrationConfirmationModal.jsx`, `DeleteConfirmModal.jsx`).
**Do not edit them**, only consult to mirror the feel.

---

## 8) Hover policy inside modals (short)

* Don’t touch sizes on hover.
* If you need a “border on hover” — keep **constant border-width** and change only `border-color` or `box-shadow`.
* For accents use `outline`/`outline-offset` (doesn’t affect layout).
* Scroll without “jumps”: `scrollbar-gutter: stable both-edges`.

---

## 9) When unsure

Formulate 1–2 options, pick the minimal-risk one, **ask**, and only then edit.