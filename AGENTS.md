# QSLC Repository Agent Instructions

## Identity and source of truth
- Treat this repository as the public code source for QSLC. Private finance, payroll, identity, banking, customer, and personal records belong only in the private Microsoft 365 QSLC-SSOT store.
- Do not commit credentials, access tokens, API keys, customer data, bank statements, payroll records, identity documents, raw machine diagnostics, or private email content.
- Use the QSLC evidence statuses exactly: UNVERIFIED, CALCULATED, VERIFIED, SETTLED, APPROVED, REJECTED.
- Never label a deployment, payment, login recovery, data migration, or workflow as complete without source-backed verification.
- Stamp generated operational evidence with `QSLC | EVE 1010 | America/Los_Angeles | ISO-8601 timestamp`.

## MCP documentation
- For OpenAI API, ChatGPT, Codex, or MCP configuration questions, use the read-only OpenAI Developer Docs MCP server configured as `openaiDeveloperDocs`.
- The docs server provides documentation search/read only; it does not grant access to QSLC Microsoft 365 data, GitHub credentials, local files, or production systems.

## Security and change process
- Inspect existing code and tests before editing.
- Preserve a backup or reversible Git diff before destructive changes.
- Prefer small, reviewable branches and pull requests.
- Run targeted tests, lint, build, and relevant security checks.
- Do not merge with unresolved security findings, exposed identifiers, secrets, or failing required checks.
- Keep public pages and artifacts free of private SSOT information.
- Do not execute shell commands, change account/billing destinations, delete user data, or trigger payments without explicit authorization.

## File routing
- Route bank/finance, payroll/HR, legal, operations, security, technical, subscription, and evidence files only into their corresponding private QSLC-SSOT folders.
- Uncertain or suspicious files go to `99_REVIEW_QUARANTINE`; never delete them automatically.
