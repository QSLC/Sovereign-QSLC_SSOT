# QSLC EVE Sovereign Command Center

QSLC EVE is the public product gateway for the Quantum Sovereign Logistics Corp automation platform. This repository contains the public-facing React application, deployment workflow, and approved non-sensitive demonstrations.

## Public / Private Boundary

The public application may show product capabilities, synthetic telemetry, synthetic SSOT examples, architecture concepts, tier information, public deployment status, and learning content.

It must not expose personal data, payroll records, checks, bank account details, credentials, private SSOT values, owner-only evidence, or administrative controls.

## Local Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Deployment

GitHub Actions validates the application before publishing the Pages artifact from `main`. Production deployment must pass privacy validation, linting, build checks, and bundle scanning.

## Synthetic Data Policy

Any public demonstration values must be synthetic and clearly labeled so they cannot be mistaken for QSLC financial, payroll, customer, banking, or operational truth.

## Architecture

- `src/App.tsx` — public QSLC capability gateway
- `src/main.tsx` — React entry point
- `scripts/` — build/privacy/deployment support
- `.github/workflows/pages.yml` — validation and GitHub Pages deployment
- `docs/superpowers/` — approved design and implementation plans

## Ownership

QSLC original product code, governance flows, formulas, content, and design artifacts are versioned in QSLC-controlled repositories. Third-party libraries and platforms remain subject to their own licenses and terms.
