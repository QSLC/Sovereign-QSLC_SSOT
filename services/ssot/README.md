# MP-33 private SSOT service

This is an additive backend for the existing React/Vite site. It does not deploy through Cloudflare Pages. MP-20 and MP-33 are user-provided identifiers, not verified Jira relationships.

## Run

Provision QSLC_ADMIN_TOKEN through your secret manager (minimum 32 random characters). Never put it in React source, VITE variables, git, or a public dashboard. From the repository root:

    docker compose -f services/ssot/compose.yaml up --build -d

Compose binds only to loopback. Production requires a TLS reverse proxy and owner identity/session integration. The static frontend must call an authenticated backend-for-frontend; do not distribute the service token to browsers. No production ingress is added by this change.

SQLite lives in a named volume. Back it up before migration; this initial service is for a single host, not a multi-writer distributed deployment. GET /healthz only establishes that the process runs. GET /api/v1/telemetry/live and POST /api/v1/evidence require the service bearer credential. Evidence submissions contain component, passed, and evidence. They are authenticated operator reports, not independent infrastructure verification. Do not submit credentials, bank data, payroll, or personal information as evidence.

## Governance

An empty ledger returns unverified. Reports older than five minutes return stale. Failed current observations return blocked. Passing observations remain verification_pending. There is no automatic Done/Approved transition. The ledger is append-only through this API, but a database administrator can modify it; it is not an immutable audit store.

## Validation and remaining integration

Seven local tests cover credential rejection, startup failure without a secret, persistence, missing evidence, cache isolation, failed probes, and refusal to approve from a single success. CI also builds the container. Docker runtime and repository-wide frontend checks must run in CI because this workspace has no Docker executable or full source checkout.

Still required for all ten steps: verified Jira project access and transitions; source-specific ingestion and reconciliation rules; independent probe/heartbeat worker; approved White Formula specification; owner SSO/BFF; dashboard mounting; tamper-evident external audit retention; deployment target and secrets; alert destination and delivery verification. No fake Azure deploy step, restart-loop orchestrator, invented formula, or hard-coded browser token is included.

Rollback: stop this Compose project without deleting the volume. This additive service does not alter the public site's routes or data.
