# Living Calculator delivery — 2026-10-08

Canonical workspace: https://qslc-hei.com/#workspace

Implemented: signed Stripe live checkout/subscription/invoice evidence in D1; one-time order exchange for a random HttpOnly secure cookie; validated operational calculations; customer-scoped saved history and export; automatic saving after input changes while the workspace is open.

Access requires paid checkout, active recognized subscription, unexpired period and no latest failed invoice. Missing evidence and unknown prices deny access. Duplicate events are idempotent and creation time controls ordering; equal timestamps favor restrictive state. Existing book/template KV fulfillment remains unchanged.

Formulas v1.0.0: labor cost, total cost, profit, margin, estimated time value and evidence coverage. Inputs are customer supplied and unverified; every saved result retains inputs, source label, timestamp and formula version. No private workbook data is bundled.

Monthly calculation quotas: Starter 100; Pro 1,000; Business 10,000.

Tests cover signed webhook → access → saved result → tenant-isolated history; signature rejection, duplicates, receipt reordering, failed payment, cancellation, elapsed periods and zero denominators.

## Remaining full-chain launch gates

The connected QSLC live account returned zero completed Checkout Sessions and zero subscriptions on 2026-10-08. No real paid activation test was performed; local fixtures are not live-sale evidence.

Cross-device identity/recovery, billing self-service, verified external SSOT/SharePoint synchronization, broader reporting/alerts, refund/dispute reconciliation and external-source scheduling remain incomplete. Calculator access is an implemented subset of the existing SaaS offer. Do not describe full tiers as completely provisioned.

Access currently stays in the checkout browser for 30 days. No email-verification service is configured for recovery. Numbers are entered by the customer. Source labels are not evidence verification.

Apply migrations/0001_calculator.sql to CALCULATOR_DB and bind the production Pages environment. Never bind previews to production customer data.
