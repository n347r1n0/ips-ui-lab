# CLAUDE.md — ips-ui-lab (Sandbox)

## 0) Role & Scope

You are a frontend co-developer working **only** in this sandbox: **Vite + React 19 + Tailwind**. Your job is to reproduce the PROD look & UX using fixtures and our local UI primitives.

* **Do not** change configs or dependencies.
* **Do not** introduce libraries.
* **Do not** touch backend/DB. Use fixtures only.
* When you think a “creative” change could help, **pause and propose it first** (brief rationale + impact), don’t implement unilaterally.

---

## 1) Project map — what to read/edit

```
frontend/src
├─ App.jsx
├─ index.css
├─ main.jsx
├─ ui/
│  ├─ tokens.css
│  ├─ layout/
│  │  ├─ PageShell.jsx
│  │  ├─ Section.jsx
│  │  └─ Toolbar.jsx
│  ├─ surfaces/
│  │  ├─ Card.jsx
│  │  ├─ Drawer.jsx
│  │  ├─ GlassPanel.jsx
│  │  ├─ Modal.jsx
│  │  └─ Toast.jsx
│  ├─ primitives/
│  │  ├─ Button.jsx
│  │  ├─ Input.jsx
│  │  └─ Select.jsx
│  ├─ feedback/
│  │  ├─ EmptyState.jsx
│  │  ├─ ErrorState.jsx
│  │  ├─ LoadingOverlay.jsx
│  │  ├─ Skeleton.jsx
│  │  └─ Spinner.jsx
│  ├─ demos/
│  │  └─ FontsModal.jsx
│  ├─ generated/
│  │  ├─ font-vars.css
│  │  └─ fonts.css
│  └─ icons/
│     └─ index.js
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
├─ demo/
│  └─ tournaments/
│     ├─ BlindsStructureViewer.jsx
│     ├─ BuyInSummary.jsx
│     ├─ RegistrationConfirmationModal.jsx
│     ├─ TournamentCard.jsx
│     ├─ TournamentListForDay.jsx
│     ├─ UpcomingTournamentsModal.jsx
│     └─ fixtures.js
└─ PROD_comparison/   (reference-only; drop PROD snippets here)


 (vite/tailwind/postcss configs — do not edit)
```

### Allowed edits

`frontend/src/**` **except** configs and `index.html`.
You may add new files under `ui/**`, `demo/**`.

### Hard excludes (don’t open/scan to save tokens/time)

* `node_modules/**`
* `.vite/**`, `dist/**`
* `public/**`

### Reference-only (don’t modify)

* `frontend/src/PROD_comparison/**` — use to compare visuals/structure with PROD when needed.

### Imports

Use the alias `@` (already configured):
`import { Button } from '@/ui/primitives/Button'`.

---

## 2) Design & UX principles

* Use **tokens** from `ui/tokens.css` (colors, radii, shadows). Don’t hardcode hex values in components.
* Build on our primitives/surfaces/layouts; no third-party UI kits.
* Lists use prop name **`items`**; single entity: `item` or `tournament`.
* **Accessibility**: visible focus, `aria-label` on icon buttons, keep contrast.
* **Cancel buttons** are `variant="glass"` by default. Destructive actions use `variant="danger"`.
* **Hover stability in scrollable areas**: never change `border-width`, `padding`, `margin`, or `line-height` on hover; prefer color/opacity/background/shadow. For modals’ scroll bodies, keep `overflow-y: auto; min-height: 0;` and set `scrollbar-gutter: stable both-edges`.

---

## 3) What exists now (you can reuse)

* Layout: `PageShell`, `Section`, `Toolbar`
* Surfaces: `GlassPanel`, `Card`, `Modal` (Header/Body/Footer), `Drawer`, `Toast`
* Primitives: `Button`, `Input`, `Select`
* Feedback: `Spinner`, `Skeleton(+Lines)`, `EmptyState`, `ErrorState`, `LoadingOverlay`
* Demo tournament components/fixtures under `src/demo/tournaments/*`

If a small primitive is missing (e.g., `Textarea`, `Checkbox`), add it under `ui/primitives/` reusing Input’s size/focus patterns.

---

## 4) Working style & guardrails

* Keep changes **localized** and consistent with existing patterns.
* Prefer composition over global CSS overrides.
* If you’re unsure about a behavior or consider adding/removing a prop/variant, **propose first** (short note with pros/cons).
* Do not introduce routing/state libs; this sandbox isn’t about app architecture.

---

## 5) Typical tasks you’ll do

* Build home sections (Header/Hero/ValueProps/CalendarPreview/RatingPreview/Footer) using our surfaces.
* Tournament demo flows with fixtures only:

  * `UpcomingTournamentsModal` (list of `TournamentCard`)
  * `TournamentListForDay`
  * `RegistrationConfirmationModal` using `BuyInSummary` + `BlindsStructureViewer`
* Extend the form kit minimally when needed (add primitives).
* Ensure modal scroll areas are stable and accessible.

---

## 6) Definition of Done

* Visual parity with PROD references (compare with `src/PROD_comparison/**` when provided).
* No config/dependency changes.
* Only token-based colors/shadows/radii.
* Imports via `@`.
* Modal Body uses `scrollbar-gutter: stable both-edges`.
* Buttons follow roles (Cancel = glass; destructive = danger).
* Accessibility basics are in place.

---

## 7) Commands

* `npm run dev` — local dev
* `npm run build` — build
* `npm run lint` — lint

---

## 8) When in doubt

State the assumption and **ask before acting**. Suggest the smallest change that achieves the goal, and reference any snippet in `PROD_comparison` you used for alignment.
