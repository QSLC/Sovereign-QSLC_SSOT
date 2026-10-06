# QSLC Merge C — SSOT, Admin, and Deployment Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce the private/public SSOT boundary, implement evidence-governance logic, separate owner/admin capabilities, and verify the full GitHub-to-domain deployment chain.

**Architecture:** Introduce a typed sanitized public metrics contract between private operational records and the public UI. Keep private/admin code and data behind authenticated boundaries, implement evidence transitions as deterministic domain logic, then add source-aware reporting and deployment health checks. Cloudflare and hosting are verified end-to-end before the system is marked healthy.

**Tech Stack:** React/TypeScript/Vite public frontend, typed JSON contracts, GitHub Actions, SharePoint/Microsoft 365 source records, Cloudflare DNS/SSL/redirect layer.

**Spec:** `docs/superpowers/specs/2026-10-05-qslc-production-hardening-design.md`

## Global Constraints
- Private SSOT remains authoritative; the public app consumes only sanitized projections.
- No browser bundle may contain private credentials, banking, payroll, checks, owner-only evidence, or private SSOT values.
- Evidence states are exactly `pending`, `validated`, `dual_approved`, `executable`, `blocked`, `frozen`.
- Seven-year immutable retention cannot be claimed as verified until backing storage policy is evidenced.
- Deployment remains unhealthy if any redirect loop, 403, TLS failure, stale origin, or host mismatch persists.

## Review Focus
- Missing or malformed private fields must be dropped, never leaked through a fallback serializer.
- Unauthorized/admin-unavailable state must fail closed, not render private data optimistically.
- Evidence transitions attempted out of order must be rejected deterministically.
- Stale source data must carry freshness metadata and must not appear current.
- Domain smoke checks must detect redirect loops and unexpected final hosts, not merely HTTP 200 somewhere in the chain.

---

### Task 1: Define sanitized public metrics contract

**Files:**
- Create: `src/contracts/publicMetrics.ts`
- Create: `src/contracts/publicMetrics.test.ts`
- Create: `src/public/data/demoPublicMetrics.ts`

**Interfaces:**
- Produces: `PublicMetricsSnapshot`, `PublicMetric`, `SourceFreshness`, `sanitizePrivateSnapshot(input: unknown): PublicMetricsSnapshot`.

- [ ] **Step 1:** Write tests proving allowed public fields survive while bank/payroll/check/credential/private-value fields are omitted.
- [ ] **Step 2:** Define allowlisted public schema with `generatedAt`, `sourceStatus`, `freshness`, `synthetic`, and public metric payloads.
- [ ] **Step 3:** Implement sanitizer by explicit allowlist projection; do not use object spreading from private records.
- [ ] **Step 4:** Test malformed/null/unexpected nested input; expected safe empty/invalid snapshot without leaked fields.
- [ ] **Step 5:** Commit `feat: define sanitized public metrics contract`.

### Task 2: Route public UI through the contract

**Files:**
- Modify: `src/App.tsx`
- Modify: relevant files under `src/public/components/`
- Create: `src/public/data/loadPublicMetrics.ts`

**Interfaces:**
- Consumes: `PublicMetricsSnapshot` only.
- Produces: public panels that render synthetic/default data or sanitized public snapshot with freshness labels.

- [ ] **Step 1:** Implement `loadPublicMetrics(): Promise<PublicMetricsSnapshot>` with public/static endpoint or demo fallback only; no private connector imports.
- [ ] **Step 2:** Replace direct/constants where applicable with contract-backed data while preserving explicit synthetic fallback labels.
- [ ] **Step 3:** Render `fresh`, `stale`, `unavailable`, and `synthetic` states distinctly.
- [ ] **Step 4:** Run source/bundle privacy scans; expected PASS.
- [ ] **Step 5:** Commit `refactor: route public metrics through sanitized contract`.

### Task 3: Implement evidence governance state machine

**Files:**
- Create: `src/governance/evidenceState.ts`
- Create: `src/governance/evidenceState.test.ts`

**Interfaces:**
- Produces: `EvidenceState`, `EvidenceEvent`, `transitionEvidence(current, event): TransitionResult`.
- Every accepted transition returns timestamp, actor/source, evidence reference, optional build SHA, and reason/result.

- [ ] **Step 1:** Write tests for permitted happy path `pending -> validated -> dual_approved -> executable`.
- [ ] **Step 2:** Write tests for `blocked` and `frozen` behavior and invalid/out-of-order transition rejection.
- [ ] **Step 3:** Implement deterministic transition table and immutable event records.
- [ ] **Step 4:** Verify missing evidence reference cannot reach `validated`/`dual_approved`/`executable`.
- [ ] **Step 5:** Commit `feat: implement evidence governance state machine`.

### Task 4: Establish private admin boundary

**Files:**
- Create: `src/admin/AdminBoundary.tsx`
- Create: `src/admin/types.ts`
- Create: `src/admin/AdminUnavailable.tsx`
- Modify: routing/entry structure chosen during implementation without importing private data into the public bundle.

**Interfaces:**
- Produces: authenticated/admin-gated surface for private SSOT status, Evidence Vault, integrations, deployment actions, audit logs, owner commands, reports.

- [ ] **Step 1:** Add boundary test asserting unauthenticated/unavailable state renders no private child content.
- [ ] **Step 2:** Implement fail-closed admin boundary with a provider interface instead of embedded credentials.
- [ ] **Step 3:** Ensure public build does not statically import private data/config modules; use separate deployment/route boundary appropriate to hosting architecture.
- [ ] **Step 4:** Run bundle inspection/privacy scan and verify no private payload is present.
- [ ] **Step 5:** Commit `feat: establish sovereign admin boundary`.

### Task 5: Create source-aware reporting model

**Files:**
- Create: `src/reporting/reportTypes.ts`
- Create: `src/reporting/buildPublicReport.ts`
- Create: `src/reporting/buildPublicReport.test.ts`
- Create private report adapter only inside the authenticated/private surface.

**Interfaces:**
- Produces: public reports with source/freshness/synthetic markers; private reports for SSOT status, evidence state, deployment audit, integration health, operational exceptions.

- [ ] **Step 1:** Test that stale/unavailable source cannot be labeled verified/current.
- [ ] **Step 2:** Implement public report builder from `PublicMetricsSnapshot` only.
- [ ] **Step 3:** Add retention wording field that reports `configurable` until backing retention policy is verified.
- [ ] **Step 4:** Commit `feat: add source-aware qslc reporting`.

### Task 6: Build SharePoint projection verification

**Files:**
- Create: `docs/integrations/sharepoint-public-projection.md`
- Create: `scripts/validate-public-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run contract:validate` that validates a generated/public metrics JSON document against the public contract and rejects forbidden keys.

- [ ] **Step 1:** Define the allowed SharePoint/private-SSOT -> sanitization/projection -> public JSON flow in documentation.
- [ ] **Step 2:** Implement validator that checks schema and recursively rejects forbidden/private key classes.
- [ ] **Step 3:** Test validator with safe synthetic fixture; expected PASS.
- [ ] **Step 4:** Test validator with nested bank/payroll/credential field; expected FAIL.
- [ ] **Step 5:** Add validator to CI before deployment.
- [ ] **Step 6:** Commit `ci: validate public ssot projection contract`.

### Task 7: Add deployment health verification

**Files:**
- Create: `scripts/check-deployment.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/pages.yml`

**Interfaces:**
- Produces: `npm run deploy:check -- <url>` that follows redirects with a bounded hop count and reports status, final host, TLS/HTTP errors, and redirect loop detection.

- [ ] **Step 1:** Add tests/unit seams for normal redirect chain, loop, 403, unexpected final host, and timeout/network failure.
- [ ] **Step 2:** Implement bounded redirect checker with explicit expected host argument/config.
- [ ] **Step 3:** Add post-deploy smoke step where workflow environment permits; otherwise document/manual-trigger the same command against the live domain.
- [ ] **Step 4:** Keep deployment status unhealthy on any loop, 403, host mismatch, or request failure.
- [ ] **Step 5:** Commit `feat: add end-to-end deployment health checks`.

### Task 8: Verify Cloudflare/domain chain with connected account state

**Systems:** GitHub Pages/selected hosting target, Cloudflare DNS, TLS, redirect rules, final QSLC domain.

- [ ] **Step 1:** Confirm the deployed origin/Pages URL from the successful workflow.
- [ ] **Step 2:** Inspect Cloudflare DNS records for the public host and identify the exact origin target.
- [ ] **Step 3:** Inspect SSL/TLS mode and redirect/page/rule configuration for loops or duplicate HTTPS/host rewrites.
- [ ] **Step 4:** Correct one root cause at a time, then rerun `deploy:check` after each change.
- [ ] **Step 5:** Verify final public URL on desktop and iPhone viewport/device.
- [ ] **Step 6:** Record evidence: GitHub SHA/run, origin URL, DNS target, final URL, and smoke result.

### Task 9: Complete production acceptance suite

**Files:**
- Modify only for defects found.

- [ ] **Step 1:** Run tests, privacy scan, contract validation, lint, build, dist privacy scan.
- [ ] **Step 2:** Verify public bundle contains no classified private data.
- [ ] **Step 3:** Verify private/admin content fails closed from public/unauthenticated access.
- [ ] **Step 4:** Verify evidence-state invalid transitions are blocked.
- [ ] **Step 5:** Verify reports show freshness/source truthfully.
- [ ] **Step 6:** Verify domain resolves without redirect loop/403 and reaches expected deployment host.
- [ ] **Step 7:** Smoke-test iPhone and desktop interaction states.
- [ ] **Step 8:** Open Merge C PR with evidence checklist and deployment status; do not mark the hardening program complete until every spec acceptance gate has evidence.