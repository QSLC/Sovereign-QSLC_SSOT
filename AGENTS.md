# QSLC Repository Agent Instructions

## Identity and source of truth
- Treat this repository as the public code source for QSLC. Private finance, payroll, identity, banking, customer, and personal records belong only in the private Microsoft 365 QSLC-SSOT store.
- Do not commit credentials, access tokens, API keys, customer data, bank statements, payroll records, identity documents, raw machine diagnostics, or private email content.
- Use evidence statuses: UNVERIFIED, INVESTIGATING, REPAIRING, TESTING, CALCULATED, VERIFIED, SETTLED, APPROVED, REJECTED, BLOCKED.
- Never label a deployment, payment, login recovery, data migration, or workflow as complete without source-backed verification.
- Stamp generated operational evidence with `QSLC | EVE 1010 | America/Los_Angeles | ISO-8601 timestamp`.

## EVE multi-agent operating model
- EVE Core coordinates; specialized agents execute only within their explicit scopes.
- Treat agent roles as logical until runtime, provider scopes, health checks and end-to-end tests are verified.
- Use the schemas under `schemas/` for event and task envelopes.
- Keep event handling idempotent and preserve provenance/classification (CONNECTED, SAMPLE, SYNTHETIC).
- Unknown or inaccessible sources must remain UNKNOWN/UNVERIFIED, never GREEN.

## MCP documentation
- For OpenAI API, ChatGPT, Codex, or MCP configuration questions, use the read-only OpenAI Developer Docs MCP server configured as `openaiDeveloperDocs`.
- The docs server provides documentation search/read only; it does not grant access to QSLC Microsoft 365 data, GitHub credentials, local files, or production systems.

## Security and change process
- Inspect existing code and tests before editing.
- Preserve a backup or reversible Git diff before destructive changes.
- Prefer small, reviewable branches and pull requests.
- Run non-destructive validation commands required by the project (tests, lint, build, type checks, schema validation and security scans) without requiring separate approval for each routine check.
- Explicit approval is required for destructive or privileged shell commands, production deployments, protected-branch merges, infrastructure or DNS changes, secret modification, account/billing changes, data deletion, payments and transfers.
- Do not merge with unresolved security findings, exposed identifiers, secrets, or failing required checks.
- Keep public pages and artifacts free of private SSOT information.
- Never execute payments, transfers, external commitments, destructive changes or permission escalation without explicit approval.

## File routing
- Route bank/finance, payroll/HR, legal, operations, security, technical, subscription, and evidence files only into their corresponding private QSLC-SSOT folders.
- Uncertain or suspicious files go to `99_REVIEW_QUARANTINE`; never delete them automatically.

## Evidence and completion
- Record source, timestamp, exact commit/resource identifier, test scope, and result.
- A preview deployment is not production deployment evidence.
- A successful CI run validates only the commit and checks it actually ran.
- Before marking a task VERIFIED, read back the resulting state from the authoritative provider.
