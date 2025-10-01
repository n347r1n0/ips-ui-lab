# Mother Modals Audit — PROD → SANDBOX

Scope
- PROD root: ips-website-prod/frontend
- SANDBOX root: ips-ui-lab/frontend
- Focus: “mother modals” (centered or full-screen modals with neomorphic panel + clay-morphism buttons)
- Out of scope: bottom-sheets not present in PROD; node_modules/.idea/build ignored

---

## A) Found Modals (PROD)

Matched by: frontend/src/components/**/**/*Modal.jsx

Shell: M = uses ModalBase (mother shell), G = ad‑hoc glass panel shell

- M — frontend/src/components/features/Admin/TournamentModal.jsx
- M — frontend/src/components/features/TournamentCalendar/RegistrationConfirmationModal.jsx
- M — frontend/src/components/features/TournamentCalendar/UpcomingTournamentsModal.jsx
- G — frontend/src/components/features/Admin/MockTimerModal.jsx
- G — frontend/src/components/features/Admin/DeleteConfirmModal.jsx
- G — frontend/src/components/features/Auth/AuthModal.jsx
- G — frontend/src/components/features/RegistrationForm/GuestFormModal.jsx
- G — frontend/src/components/features/TournamentCalendar/TournamentResultsModal.jsx

Mother shell component: frontend/src/components/ui/ModalBase/ModalBase.jsx

Notes
- No explicit bottom-sheet variant found in PROD. ModalBase supports `fullScreen`, but no current usages were detected.

---

## B) Common JSX Skeleton (PROD)

Source: frontend/src/components/ui/ModalBase/ModalBase.jsx

Windowed modal (mother panel)
```
<motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-40|z-[60]" onClick={onClose}>
  <motion.div
    className="neumorphic-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header (sticky via flex layout) */}
    <div className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-3 sm:pr-4">
          <h1 className="text-lg sm:text-2xl font-brand text-white mb-2">{title}</h1>
          <p className="text-secondary">{subtitle}</p>
        </div>
        <div className="flex items-start space-x-2 sm:space-x-3">
          {headerActions}
          <Button aria-label="Закрыть" className="p-2 aspect-square min-w-[40px] min-h-[40px]"><X/></Button>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gold-accent/30 to-transparent" />
    </div>

    {/* Scrollable body */}
    <div className="flex-1 overflow-y-auto min-h-0 px-6">
      <div className="py-6 spacing-content max-w-full">{children}</div>
    </div>

    {/* Footer (sticky via flex layout) */}
    {footerActions && (
      <div className="flex-shrink-0 px-6 py-6 border-t border-white/5">
        <div className="flex items-center justify-end space-x-3">{footerActions}</div>
      </div>
    )}
  </motion.div>
</motion.div>
```

Full-screen container (unused but available)
```
<motion.div className="neumorphic-container flex flex-col">
  {header}{body}{footer}
</motion.div>
```

Ad‑hoc glass modals (Auth/Guest/Results/Delete/Mock) follow this shape:
```
<div className="fixed inset-0 bg-black/70–80 backdrop-blur-sm|md z-50 flex items-center justify-center p-4" onClick={close}>
  <div className="glassmorphic-panel rounded-2xl p-6–8 w-full max-w-md|lg|2xl border border-white/15–30" onClick={stop}>
    ... content ...
  </div>
</div>
```

---

## C) Tailwind and Classes Used in PROD

Mother shell (ModalBase)
- Overlay: `fixed inset-0 bg-black/80 backdrop-blur-md p-4` (+ `z-40` or `z-[60]` when `priority`)
- Mother panel: `neumorphic-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden`
- Header: `flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5`
- Body: `flex-1 overflow-y-auto min-h-0 px-6` with inner `py-6 spacing-content`
- Footer: `flex-shrink-0 px-6 py-6 border-t border-white/5`

Surface tokens (index.css)
- `.neumorphic-panel` (opaque, inset shadows, border radius 1.5rem): background `#2a2a2e`, border `rgba(255,255,255,0.1)`, shadows with inset depth
- `.glassmorphic-panel` (translucent): `bg-black/50 backdrop-blur-xl border border-white/15`, hover `border-white/20`
- `.neumorphic-container` (full-screen opaque shell): fixed, fills viewport, inner inset shadows

Width / max-w
- Mother: `max-w-4xl` (primary), smaller flows use `max-w-md`, `max-w-lg`, `max-w-2xl` in ad‑hoc modals
- Height: `max-h-[90vh]` for windowed mother panel scroll containment

Padding / radius / border / shadow
- Radius: mother `rounded-3xl`; glass panels `rounded-2xl`/`rounded-xl`
- Borders: `border-white/5` for header/footer dividers; glass `border-white/10–30`
- Shadows: defined in `.neumorphic-panel` and `.glassmorphic-panel` (index.css)

Sticky header/footer and scrollable body
- Achieved via flex column: header/footer `flex-shrink-0`; body `flex-1 overflow-y-auto min-h-0`
- Prevents layout shift; header/footer remain fixed while body scrolls

Z-index ladder
- ModalBase overlay: `z-40` default; `z-[60]` when `priority={true}`
- Ad‑hoc overlays often use `z-50`

Focus rings
- Buttons (.btn-clay): `focus:outline-none focus:ring-2 focus:ring-gold-accent/50`
- Inputs (in forms): `focus:ring-2 focus:ring-gold-accent/20` (+ `focus:border-gold-accent`)

Button variants and usage
- Primary confirm: `.btn-clay luxury-button` (blue‑green gradient clay look)
- Secondary/cancel: `.btn-glass` (translucent)
- Neutral gray: `.btn-neutral` available (rare in modals)
- Danger: `.btn-danger` available; some modals use bespoke `bg-red-500/…` instead
- Sizes: app-level sizing with padding classes, not a formal size prop

Representative locations
- ModalBase: frontend/src/components/ui/ModalBase/ModalBase.jsx
- Buttons & skins: frontend/src/index.css (btn‑clay/glass/primary/secondary/danger, luxury‑button variants)
- Tailwind colors: frontend/tailwind.config.js (gold-accent, deep-teal, ips-red, glass-border)

---

## D) Where Tokens/Vars Come From (PROD)

- Tailwind theme colors: frontend/tailwind.config.js (e.g., `gold-accent`, `deep-teal`, `glass-border`)
- Global component classes: frontend/src/index.css define surfaces (`.neumorphic-panel`, `.glassmorphic-panel`, `.neumorphic-container`) and button skins (`.btn-...`, `.luxury-button*`)
- Utility classes: Tailwind utility combos for layout (`flex`, `overflow-y-auto`, `min-h-0`, `rounded-*`, `border-*`, etc.)

Stability/interaction rules observed
- `.btn-clay:hover` avoids transforms to prevent mobile jitter (index.css comment)
- Scroll containment via `max-h-[90vh]` + `min-h-0` avoids header/footer jumping
- Backdrop blur uses conservative strengths (`backdrop-blur-sm|md|xl`) based on context

---

## E) SANDBOX Conventions Summary

Tokens
- SANDBOX tokens: frontend/src/ui/tokens.css
  - Glass: `--glass-bg`, `--glass-border`, `--glass-blur`
  - Radius/shadows: `--radius`, `--shadow-s|m`
  - Focus rings: `--ring`, `--ring-brand`
  - Brand/accents: `--brand-crimson`, etc.
  - Clay (optional skin): `--clay-*`

Primitives available
- Modal: frontend/src/ui/surfaces/Modal.jsx (sizes: md, lg, xl, fullscreen) with `Modal.Header/Body/Footer` and scroll-safe layout
- Button: frontend/src/ui/primitives/Button.jsx (variants: primary, secondary, glass, ghost, danger, clay; sizes: sm, md, lg)
- GlassPanel: frontend/src/ui/surfaces/GlassPanel.jsx
- Card: frontend/src/ui/surfaces/Card.jsx (variant solid/glass)

Mapping PROD → SANDBOX
- Overlay/backdrop: use SANDBOX Modal (built-in `role=dialog`, `aria-modal`, portal, escape handling)
- Mother panel: SANDBOX Modal uses tokenized glass surface by default; for opaque “neomorphic” flavor, wrap body content in `Card variant="solid"` or pass a class to adjust surface
- Header/body/footer: use `Modal.Header/Body/Footer` (already sticky-safe; body has `[scrollbar-gutter:stable]` and `min-h-0`)
- Buttons: map `.btn-glass` → `Button variant="glass"`; `.btn-clay luxury-button` (primary confirm) → `Button variant="primary"` by default, or `variant="clay"` if the clay skin is desired
- Z-index: SANDBOX Modal root uses `z-50`; if stacking needed, allow a `className="z-[60]"` override on the wrapper

---

## F) Proposed MotherModal Spec (SANDBOX-friendly)

Goal
- Mirror PROD’s skeleton (overlay → container → panel → header/body/footer) using SANDBOX primitives and tokens only (no magic numbers)

Exact JSX skeleton (windowed “mother”)
```
import { Modal } from '@/ui/surfaces/Modal';
import { Button } from '@/ui/primitives/Button';

export function MotherModal({ open, onClose, title, subtitle, children, confirm, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) {
  return (
    <Modal open={open} onClose={onClose} size="xl" aria-labelledby="mother-modal-title">
      <Modal.Header onClose={onClose}>
        <div>
          <h3 id="mother-modal-title" className="text-[--fg-strong] font-brand">{title}</h3>
          {subtitle ? <p className="text-sm text-[--fg-dim]">{subtitle}</p> : null}
        </div>
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="glass">{cancelLabel}</Button>
        <Button variant="primary" onClick={confirm}>{confirmLabel}</Button>
        {/* Optional clay skin: <Button variant="clay" onClick={confirm}>{confirmLabel}</Button> */}
      </Modal.Footer>
    </Modal>
  );
}
```

Full-screen variant (rare; parity with PROD’s `neumorphic-container`)
```
<Modal open={open} onClose={onClose} size="fullscreen" aria-labelledby="mother-modal-title">
  <Modal.Header onClose={onClose}>…</Modal.Header>
  <Modal.Body className="p-0">…</Modal.Body>
  <Modal.Footer>…</Modal.Footer>
</Modal>
```

Tailwind classes via SANDBOX tokens
- Surface: Modal already uses `bg-[--glass-bg] backdrop-blur-[var(--glass-blur)] border border-[--glass-border] shadow-[var(--shadow-m)]`
- Radius: `rounded-[var(--radius)]`
- Dividers: `border-[--glass-border]` for header/footer
- Scroll stability: `min-h-0 overflow-y-auto [scrollbar-gutter:stable_both-edges]` in `Modal.Body`
- Z-index: Modal root `z-50`; add `className="z-[60]"` only for nested/priority stacks
- Focus ring: buttons/links rely on `--ring` and `--ring-brand` (already in tokens.css)

Buttons mapping
- Cancel → `Button variant="glass"`
- Confirm → `Button variant="primary"` (brand)
- Danger flows → `Button variant="danger"`
- Optional clay look (for parity with `.btn-clay luxury-button`) → `Button variant="clay"`

Accessibility
- Modal component sets `role="dialog"` and `aria-modal="true"`
- Provide `aria-labelledby` and wire it to the title element id
- Dismiss on backdrop click and Escape; initial focus is set inside modal
- Maintain live regions unchanged; use button labels and `aria-busy` for async states (Button supports `loading` prop pattern)

Stability rules to keep
- Avoid hover transforms on primary/clay buttons in critical flows to prevent mobile jitter; prefer brightness/box-shadow changes
- Keep header/footer sticky via layout (do not add additional position: sticky unless necessary)
- Constrain height to viewport (`max-h-[90vh]` is already applied by Modal for non-fullscreen)

---

## G) Optional Tokens (only if needed)

Use existing tokens where possible. Consider these only if a closer visual match to PROD’s neuomorphism is required:
- `--panel-solid-inset`: inset shadow tuple for opaque mother panels (to emulate `.neumorphic-panel`); used on a wrapper Card in rare cases
- `--divider-weak`: softer divider color for subtle header/footer borders

Rationale: SANDBOX already matches glass look perfectly. Opaque “neomorphic” shells are uncommon and can be built from `Card variant="solid"` plus custom class on demand without polluting the base Modal.

---

## H) Quick Crosswalk (PROD → SANDBOX)

- Overlay/backdrop: `fixed inset-0 bg-black/* blur` → Modal’s built-in backdrop
- Mother panel: `.neumorphic-panel max-w-4xl max-h-[90vh] rounded-3xl` → Modal size="xl" + tokenized surface; radius via `--radius`
- Header/body/footer: custom flex blocks → `Modal.Header/Body/Footer`
- Buttons: `.btn-glass` → `Button variant="glass"`; `.btn-clay luxury-button` → `variant="primary"` (or `clay` if desired); danger → `variant="danger"`
- Z-index: PROD `z-40`/`z-[60]` → SANDBOX `z-50` (override only for stacking)

This spec keeps semantics, accessibility, and stability rules, while removing magic numbers and centralizing styling through tokens.css and SANDBOX primitives.

