# QSLC EVE — Agent Context

**Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, GitHub Actions

## Product Purpose
QSLC EVE is a public capability gateway plus a separately protected owner/admin control plane. Public code must contain only approved product copy, synthetic demonstrations, and sanitized metrics contracts.

## Public Entry Path
- `src/main.tsx` mounts `src/App.tsx`.
- `src/App.tsx` is the public product surface.
- Public components must not import raw payroll, banking, private SSOT, owner evidence, credentials, or administrative data.

## Privacy Rule
No evidence of private operational data may ship in source or generated browser bundles. Public metrics must come from synthetic data or a sanitized projection contract.

## Validation
Before merge, run:

```bash
npm run privacy:scan
npm run lint
npm run build
npm run privacy:scan:dist
```

## Deployment
Only validated `main` pushes may upload and deploy the GitHub Pages artifact. Deployment success does not by itself prove domain health; domain, SSL/TLS, redirects, and final URL checks are handled separately.

## Architecture Roadmap
1. Merge A — privacy and repository normalization
2. Merge B — public product experience and learning demos
3. Merge C — SSOT/admin/deployment hardening
