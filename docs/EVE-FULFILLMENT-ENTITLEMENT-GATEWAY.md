# EVE Fulfillment Entitlement Gateway

Status: **SOURCE SAVED / PROVIDER DEPLOYMENT NOT YET ENABLED**

The production-safe entitlement design is now stored in this repository before provider deployment.

## Purpose

- receive signed Stripe Checkout events;
- validate the Stripe webhook signature;
- map only the nine approved direct-sale Payment Links;
- write paid Checkout Session entitlements to the dedicated Cloudflare KV namespace;
- answer read-only entitlement verification requests.

## Cloudflare resource already provisioned

KV namespace: `EVE_FULFILLMENT_ENTITLEMENTS`

Namespace ID: `cdce3c832bbf44e98fbfe84a3d048394`

Expected Worker bindings:

- `ENTITLEMENTS` -> the KV namespace above
- `STRIPE_WEBHOOK_SECRET` -> secret text from the Stripe webhook endpoint

## Endpoints

- `GET /health`
- `GET /verify?session_id=...&product=...`
- `POST /stripe-webhook`

## Current boundary

The source is saved, but the Worker route and Stripe webhook must not be called production-ready until:
1. Cloudflare accepts the Worker module upload and bindings;
2. the Stripe webhook endpoint is created;
3. its signing secret is stored as a Worker secret;
4. a signed event is observed successfully;
5. a paid session is written to KV;
6. verification returns the expected entitlement.

Until then, the existing browser delivery remains order-reference tracked but not server-side gated.
