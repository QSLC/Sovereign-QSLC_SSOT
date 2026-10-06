# Contributing to QSLC EVE

Keep changes focused, reviewable, and safe for a public repository.

## Required Checks

Before opening a pull request, run:

```bash
npm run privacy:scan
npm run lint
npm run build
npm run privacy:scan:dist
```

## Public Data Rules

Do not commit personal data, payroll/check records, bank account or routing details, credentials, API secrets, private SSOT values, owner-only evidence, or administrative records. Public examples must be synthetic or explicitly sanitized.

If the privacy scanner reports a false positive, add the narrowest reviewed allowlist entry. Do not disable a rule globally to make CI pass.

## Pull Requests

- Keep each PR scoped to one logical change.
- Explain data sources and whether values are synthetic, sanitized, or public.
- Include screenshots for visual changes when useful.
- Do not merge when privacy, lint, build, or bundle validation is red.

## Third-Party Code

Respect third-party licenses and clearly distinguish QSLC original work from open-source dependencies and external services.
