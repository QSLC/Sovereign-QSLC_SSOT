# QSLC Merge A — Privacy and Repository Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unrelated Sovereign Matrix material, normalize QSLC EVE project identity, and add CI privacy gates so private operational data cannot ship in the public bundle.

**Architecture:** Keep `src/App.tsx` as the public entry surface. Remove the isolated Matrix dependency island, then add source/bundle scanning and CI gates before deployment. Documentation and package metadata are rewritten around QSLC EVE.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, Biome, GitHub Actions, Node 22.

**Spec:** `docs/superpowers/specs/2026-10-05-qslc-production-hardening-design.md`

## Global Constraints
- Public source and generated bundles must not contain personal, payroll, banking, check, credential, owner-only evidence, or private SSOT values.
- Synthetic demo data must remain clearly labeled.
- Do not weaken privacy scanning to make CI green; reviewed allowlists only.
- Merge A must build independently and remain reversible.

## Review Focus
- A forbidden bank/payroll/credential pattern in source must fail CI.
- A forbidden pattern introduced only in `dist/` must fail bundle validation.
- Matrix-only files must be absent without breaking `src/App.tsx` build.
- Generic wording such as “banking” in public explanatory copy must not create an unusable false-positive scanner.
- GitHub Pages must still build from `main` only after validation passes.

---

### Task 1: Prove the Matrix dependency island is removable

**Files:**
- Inspect: `src/SovereignMatrix.tsx`
- Inspect: `src/components/*.tsx`
- Inspect: `src/hooks/useLocalStorage.ts`
- Inspect: `src/types/project.ts`
- Inspect: `src/utils/projectUtils.ts`
- Modify: none

**Interfaces:**
- Consumes: production imports from `src/main.tsx` and `src/App.tsx`.
- Produces: confirmed deletion set containing only files not imported by production QSLC code.

- [ ] **Step 1:** Search imports/references for `SovereignMatrix`, `ProjectForm`, `useLocalStorage`, `projectUtils`, and `types/project`.
- [ ] **Step 2:** Run `npm run build` before deletion; expected PASS.
- [ ] **Step 3:** Record the exact Matrix-only deletion set in the commit message/body.

### Task 2: Remove unrelated Matrix code and stale starter assets

**Files:**
- Delete: `src/SovereignMatrix.tsx`
- Delete if Matrix-only: `src/components/ConfirmDialog.tsx`, `src/components/EmptyState.tsx`, `src/components/Modal.tsx`, `src/components/ProjectForm.tsx`
- Delete if Matrix-only: `src/hooks/useLocalStorage.ts`, `src/types/project.ts`, `src/utils/projectUtils.ts`
- Delete: `src/assets/react.svg`, `public/vite.svg` if unused after branding update

**Interfaces:**
- Consumes: Task 1 deletion set.
- Produces: QSLC-only source tree.

- [ ] **Step 1:** Delete only files proven unused by Task 1.
- [ ] **Step 2:** Run `npm run lint`; expected PASS.
- [ ] **Step 3:** Run `npm run build`; expected PASS.
- [ ] **Step 4:** Search repository for known Matrix/travisBREAKS identifiers; expected zero results outside historical design docs if intentionally referenced.
- [ ] **Step 5:** Commit `refactor: remove unrelated matrix project code`.

### Task 3: Normalize QSLC EVE identity and documentation

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Modify: `README.md`
- Modify: `agents.md`
- Modify: `CONTRIBUTING.md`

**Interfaces:**
- Produces: canonical package name `qslc-eve-command-center`, browser title `QSLC EVE Sovereign Command Center`, and QSLC-specific repository docs.

- [ ] **Step 1:** Change `package.json.name` from `sovereign-matrix` to `qslc-eve-command-center` and remove dependencies used only by deleted Matrix code after confirming they are unused.
- [ ] **Step 2:** Replace the Vite favicon reference and `sovereign-matrix` HTML title with QSLC branding; do not introduce a missing asset reference.
- [ ] **Step 3:** Rewrite `README.md` to describe public gateway purpose, privacy boundary, local commands, deployment path, and synthetic-data policy.
- [ ] **Step 4:** Rewrite `agents.md` to document the QSLC EVE architecture rather than Matrix scoring logic.
- [ ] **Step 5:** Update `CONTRIBUTING.md` so contributors must run privacy scan, lint, build, and tests before PRs.
- [ ] **Step 6:** Run `npm install --package-lock-only` if dependency metadata changed, then `npm run lint && npm run build`.
- [ ] **Step 7:** Commit `chore: normalize qslc eve project identity`.

### Task 4: Add deterministic privacy scanner

**Files:**
- Create: `scripts/privacy-scan.mjs`
- Create: `privacy-allowlist.json`
- Modify: `package.json`

**Interfaces:**
- Produces: CLI `npm run privacy:scan` that scans tracked source/config/docs and optionally `dist/`, returns exit code 1 on unallowlisted forbidden findings, and prints file:line with rule ID.

- [ ] **Step 1:** Add test fixtures inside the script or a temporary test harness covering routing/account-number patterns, secret/token patterns, payroll/check keywords combined with numeric values, and approved explanatory copy.
- [ ] **Step 2:** Implement `scanPaths(paths: string[], allowlist: Allowlist): Finding[]` and CLI exit behavior.
- [ ] **Step 3:** Add `privacy:scan` and `privacy:scan:dist` scripts to `package.json`.
- [ ] **Step 4:** Run scanner against a deliberate forbidden fixture; expected FAIL.
- [ ] **Step 5:** Run scanner against current repository; expected PASS.
- [ ] **Step 6:** Build then scan `dist/`; expected PASS.
- [ ] **Step 7:** Commit `feat: add public data privacy scanner`.

### Task 5: Harden GitHub Actions validation

**Files:**
- Modify: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `npm run privacy:scan`, `npm run privacy:scan:dist`, existing lint/build commands.
- Produces: deployment artifact only after source scan, lint, build, and bundle scan succeed.

- [ ] **Step 1:** Replace install step with deterministic install appropriate to the committed lockfile; if no lockfile exists, create one before changing to `npm ci`.
- [ ] **Step 2:** Add Source Privacy Scan before lint/build.
- [ ] **Step 3:** Add Bundle Privacy Scan after build and before Pages artifact upload.
- [ ] **Step 4:** Preserve deploy restriction to non-PR `main` pushes and `pages-production` concurrency.
- [ ] **Step 5:** Validate workflow syntax and run local `npm run privacy:scan && npm run lint && npm run build && npm run privacy:scan:dist`.
- [ ] **Step 6:** Commit `ci: gate pages deployment on privacy validation`.

### Task 6: Merge A acceptance verification

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1:** Search for `travisBREAKS`, `WGU Psychology`, `Sovereign Matrix`, and Matrix localStorage keys; expected zero production-code results.
- [ ] **Step 2:** Run full validation chain; expected all PASS.
- [ ] **Step 3:** Inspect generated `dist/` for public QSLC copy and absence of classified data.
- [ ] **Step 4:** Compare branch against base and confirm no unrelated feature work entered Merge A.
- [ ] **Step 5:** Commit any verification-only corrections separately, then open Merge A PR.