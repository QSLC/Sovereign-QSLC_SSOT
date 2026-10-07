# QSLC / EVE Current Commercial Control State

Verified on 2026-10-06 Pacific / 2026-10-07 UTC.

## Production source

- Repository: QSLC/Sovereign-QSLC_SSOT
- Verified production commit before this status snapshot: `9e1f9850b393e1e8518001f21a6ffc1e0b65f171`
- Canonical domain: https://qslc-hei.com
- Cloudflare Pages project: sovereign-qslc-ssot
- Latest verified Cloudflare production deployment: SUCCESS
- GitHub Governance Integrity: GREEN
- GitHub Commercial Readiness: GREEN
- GitHub Link Integrity: GREEN
- GitHub Secret Shape Gate: GREEN
- GitHub Pages deployment: GREEN

## Active direct-sale scope

There are exactly nine intentionally active direct-sale Payment Links:

1. EVE-1010 Book 01
2. EVE-1010 Book 02
3. EVE-1010 Book 03
4. EVE-1010 Book 04
5. EVE-1010 Book 05
6. EVE-1010 Book 06
7. EVE-1010 Book 07
8. EVE-1010 Sovereign Systems Digital Vault
9. QSLC EVE Starter Command Center Template

Each active fulfilled product redirects with a Stripe Checkout Session ID reference appended to the delivery URL.

## Intentionally disabled direct-charge scope

Direct payment links for unprovisioned or scope-dependent software/services are disabled, including SaaS Pro, SaaS Business, Hosted & Managed, Self-Hosted, Custom Build, Executive Pilot, Enterprise Core, and the superseded Starter Template payment link.

## Fulfillment infrastructure

Cloudflare KV namespace:

- `EVE_FULFILLMENT_ENTITLEMENTS`
- Namespace ID: `cdce3c832bbf44e98fbfe84a3d048394`

This namespace is reserved for the next server-side entitlement verification layer.

## Boundary

Checkout Session ID propagation provides order-reference traceability. It is not represented as server-side payment verification or DRM until a Stripe webhook / entitlement verifier is deployed and tested.

## Public evidence

- https://qslc-hei.com/evidence-center.html
- https://qslc-hei.com/publishing-manifest.json
- https://qslc-hei.com/formula-provenance.json
- https://qslc-hei.com/ip-provenance.html
- https://qslc-hei.com/qslc-release.json

## Provenance contact

eve@qslc-hei.com
