# CODEX.md

## 1) Project roots

* **PROD:** `PROD (ips-website-prod)/frontend`
* **DEV (sandbox):** `DEV (ips-ui-lab)/frontend`

Work **only** inside these two trees. Always prefix paths with `PROD:` / `DEV:`.

---

## 2) Allowed vs forbidden

**Allowed**

* Read files in PROD and DEV (via **one-time read batch**, see below).
* Make **small, localized** JSX/class/style edits in **DEV**.
* Edit **PROD** **only** if the task explicitly says so.

**Forbidden**

* Changing dependencies, build/config (`package.json`, `vite.config.*`, CI).
* DB/migrations/Edge Functions changes.
* Commit/push/PR — you only propose patches/diffs.
* Touching `node_modules`, `dist`, `build`, `.idea`, `public`.
* Opening terminals, running shell/ripgrep (except the agreed batched reads).

---

## 3) Where to put artifacts (always in DEV)

* Reports: `DEV/frontend/src/PROD_comparison/reports/`
* Drafts/patches: `DEV/frontend/src/PROD_comparison/drafts/`
* New UI patterns: `DEV/frontend/src/ui/patterns/`

**Important:** never create mirrored folders like these inside PROD.

---

## 4) Design principles

* **No magic values**: colors/shadows/radii/blur come **only** from `DEV/frontend/src/ui/tokens.css`.
* Surfaces: `GlassPanel`, `Card`, `Modal`, `Drawer`.
* Buttons: `ui/primitives/Button` (`primary`, `glass`, `danger`, `ghost`, `clay`).
  Cancel defaults to `variant="glass"`.
* Modals: `Modal.Header/Body/Footer`; stable scroll: `overflow-y:auto; min-height:0; scrollbar-gutter: stable both-edges`.
* Don’t use raw `bg-white/...` colors — only tokens/surfaces.

---

## 5) Process (two phases)

1. **Report-first**
   Before any edits, send a short report:

   * which files you will touch and why;
   * mini-diff of class changes (1–2 lines of before/after context);
   * risks and expected visual effect.
2. **Patch-set**
   Apply minimal patches exactly per the report. No hidden refactors.

---

## 6) File access policy — **ONE-TIME READ BATCH**

We follow the **single batched read** rule:

* First, request **one** batch of files/folders to read (exact paths with `DEV:/PROD:` prefixes).
* Wait for the response with all contents **in one block**.
* Then continue in **chat-only** mode (no further reads, no shell).
* If a second batch is truly needed, justify briefly (1–2 sentences) and send the second exact list.

**Request format (exactly this, no comments inside the block):**

```
[READ-BATCH REQUEST]
DEV:/frontend/src/ui/tokens.css
DEV:/frontend/src/ui/surfaces/Modal.jsx
PROD:/frontend/src/components/ui/ModalBase/ModalBase.jsx
PROD:/frontend/src/index.css
[/READ-BATCH REQUEST]
```

---

## 7) Editing style

* Change **little** and **locally**. Any creative deviation — propose in the report first.
* New utilities/variants — only after name/location is agreed.
* Z-index, focus rings, radii, shadows — via tokens.

---

## 8) Commands & access

* By default do **not** open a terminal and do **not** perform ad-hoc reads; use the **one-time read batch**.
* Tree search is via the batched paths; don’t scan forbidden folders.

---

## 9) Visual priorities

* Dark theme; glass; subtle shadows; art-deco dividers — **via tokens**.
* Consistent vertical rhythm; focus rings: `--ring`, `--ring-brand`.
* No broad global CSS overrides.

---

## 10) Pre-patch checklist

* [ ] Root of changes is explicit (DEV/PROD).
* [ ] All colors/shadows/radii come from tokens; no magic values.
* [ ] A report exists in `PROD_comparison/reports/`.
* [ ] For modals: header/body/footer present; scrolling is stable.
* [ ] Button roles: Cancel = `glass`, destructive = `danger`.

---

## 11) What to reply **first** in any task

1. Short confirmation you follow the **one-time read batch** policy.
2. 5–8 bullet rules you will follow.
3. A **[READ-BATCH REQUEST] … [/READ-BATCH REQUEST]** block with the exact paths you need to read.
