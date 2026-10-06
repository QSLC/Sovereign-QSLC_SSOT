# QSLC Merge B — Public Product Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the sanitized public gateway into a polished, interactive QSLC EVE product, pricing, demonstration, and learning experience.

**Architecture:** Split the current monolithic public `App.tsx` into focused public-only sections driven by typed catalog/demo data. Every visualization consumes synthetic constants or public contracts only; no private SSOT connector is introduced in Merge B.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, lucide-react, CSS/SVG visualizations.

**Spec:** `docs/superpowers/specs/2026-10-05-qslc-production-hardening-design.md`

## Global Constraints
- All demo values are synthetic and visibly labeled.
- Prices must exactly match the approved catalog in the spec.
- Public components cannot import private/admin/finance/payroll modules.
- iPhone-width layouts must remain readable without horizontal overflow.
- Motion cannot obscure loading, error, status, or accessibility information.

## Review Focus
- Pricing cadence ($/month, one-time, /year, starting/custom quote) must not be mixed.
- Mobile 320–430 px widths must not clip charts/cards/navigation.
- Reduced-motion preference must produce a usable static experience.
- Demo calculator must never imply generated values are real QSLC/customer data.
- Broken/absent optional links must render a disabled/explanatory state instead of dead navigation.

---

### Task 1: Create typed public product catalog

**Files:**
- Create: `src/public/catalog.ts`
- Create: `src/public/types.ts`
- Create: `src/public/catalog.test.ts`

**Interfaces:**
- Produces: `ProductOffer`, `ProductTier`, `BillingCadence`, `PUBLIC_OFFERS`.

- [ ] **Step 1:** Write tests asserting exact offers: Starter $49/month, Pro $149/month, Business $499/month, Template $49 one-time, Self-Hosted $499 one-time, Custom Build starting $1,200, Executive Pilot $10,000, Enterprise Core $120,000/year, Enterprise Scale $250,000/year, Sovereign Platform $500,000/year.
- [ ] **Step 2:** Implement typed catalog constants with capability arrays and quote/current-offer flags.
- [ ] **Step 3:** Run catalog tests; expected PASS.
- [ ] **Step 4:** Commit `feat: add typed public product catalog`.

### Task 2: Build public shell and design tokens

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Create: `src/public/components/PublicNav.tsx`
- Create: `src/public/components/Hero.tsx`
- Create: `src/public/components/SectionFrame.tsx`

**Interfaces:**
- Consumes: public catalog only.
- Produces: accessible page shell with navy/black, lime, purple, cyan design tokens and responsive section primitives.

- [ ] **Step 1:** Add CSS variables/tokens for QSLC colors, glass surfaces, grid spacing, focus rings, and reduced-motion handling.
- [ ] **Step 2:** Split hero/nav/section shell out of `App.tsx` while preserving public privacy statement.
- [ ] **Step 3:** Verify 320 px, 390 px, 768 px, and desktop widths in browser/dev tools; no horizontal overflow.
- [ ] **Step 4:** Run lint/build/privacy scan; expected PASS.
- [ ] **Step 5:** Commit `feat: establish qslc public visual system`.

### Task 3: Implement pricing and capability comparison

**Files:**
- Create: `src/public/components/PricingGrid.tsx`
- Create: `src/public/components/CapabilityMatrix.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `PUBLIC_OFFERS`.
- Produces: grouped SaaS, deployment, and enterprise offer surfaces with correct billing cadence.

- [ ] **Step 1:** Add tests or pure formatting assertions for `formatOfferPrice(offer)` so monthly/annual/one-time/starting/quote states are unambiguous.
- [ ] **Step 2:** Implement grouped cards and capability matrix; no hard-coded duplicate prices in JSX.
- [ ] **Step 3:** Add clear CTA states (`Explore`, `Request scope`, or `Contact`) without inventing unavailable checkout links.
- [ ] **Step 4:** Verify all ten approved offers appear exactly once in primary pricing UI.
- [ ] **Step 5:** Commit `feat: publish approved qslc product tiers`.

### Task 4: Add synthetic Living Calculator

**Files:**
- Create: `src/public/demo/livingCalculator.ts`
- Create: `src/public/demo/livingCalculator.test.ts`
- Create: `src/public/components/LivingCalculatorDemo.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `calculateDemoMetrics(input: DemoInputs): DemoMetrics`; all outputs marked `synthetic: true`.

- [ ] **Step 1:** Write deterministic tests for valid minimum/default/maximum inputs and reject non-finite values.
- [ ] **Step 2:** Implement pure calculation logic with no network/storage access.
- [ ] **Step 3:** Build interactive sliders/inputs with a persistent `SYNTHETIC DEMO — NOT QSLC FINANCIAL DATA` label.
- [ ] **Step 4:** Verify keyboard interaction and mobile layout.
- [ ] **Step 5:** Commit `feat: add synthetic living calculator demo`.

### Task 5: Add evidence-gate learning simulation

**Files:**
- Create: `src/public/demo/evidenceDemo.ts`
- Create: `src/public/components/EvidenceGateDemo.tsx`

**Interfaces:**
- Produces: public educational states `pending`, `validated`, `dual_approved`, `executable`, `blocked`, `frozen` without touching real governance records.

- [ ] **Step 1:** Implement a deterministic demo transition table labeled synthetic/training-only.
- [ ] **Step 2:** Build a guided UI explaining why missing evidence blocks approval.
- [ ] **Step 3:** Add running/success/error/explanation states rather than raw failure flashes.
- [ ] **Step 4:** Verify no admin mutation or external write exists.
- [ ] **Step 5:** Commit `feat: add evidence gate learning simulation`.

### Task 6: Add topology/star-map and telemetry visuals

**Files:**
- Create: `src/public/components/SystemStarMap.tsx`
- Create: `src/public/components/TelemetryPanel.tsx`
- Create: `src/public/demo/telemetry.ts`

**Interfaces:**
- Consumes: synthetic node/edge/telemetry arrays only.
- Produces: responsive SVG/CSS topology and accessible telemetry summaries.

- [ ] **Step 1:** Define deterministic synthetic nodes for UI, API/Data Lab, Learning Studio, automation, reporting, and protected admin boundary.
- [ ] **Step 2:** Render topology with SVG viewBox so it scales without pixel clipping.
- [ ] **Step 3:** Add text equivalents/labels for all visual status information.
- [ ] **Step 4:** Respect `prefers-reduced-motion` and avoid canvas-only inaccessible content.
- [ ] **Step 5:** Commit `feat: add system topology and telemetry visuals`.

### Task 7: Add Learning Studio and technology modules

**Files:**
- Create: `src/public/components/LearningStudio.tsx`
- Create: `src/public/content/learningModules.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: tutorial cards for SSOT, Evidence Before Approval, API/Data Lab, self-hosted deployment, and Unreal/Dispatch Orbit concept modules.

- [ ] **Step 1:** Add typed learning module content that distinguishes existing product features from concepts/future modules.
- [ ] **Step 2:** Build progressive explanation UI with `What it does`, `Why it matters`, and `Try demo` actions.
- [ ] **Step 3:** Ensure concept modules are not represented as already-live production functionality.
- [ ] **Step 4:** Commit `feat: add qslc learning studio walkthroughs`.

### Task 8: Public experience acceptance verification

**Files:**
- Modify only for defects found during verification.

- [ ] **Step 1:** Run tests, privacy scan, lint, build, and dist privacy scan; expected PASS.
- [ ] **Step 2:** Verify all ten approved offers and synthetic labels.
- [ ] **Step 3:** Smoke-test navigation/buttons on desktop and iPhone-sized viewport.
- [ ] **Step 4:** Test reduced-motion and keyboard-only navigation.
- [ ] **Step 5:** Confirm no private SSOT, banking, payroll, check, credential, or owner evidence values exist in source or bundle.
- [ ] **Step 6:** Open Merge B PR only after Merge A is integrated or rebase Merge B onto the accepted Merge A head.