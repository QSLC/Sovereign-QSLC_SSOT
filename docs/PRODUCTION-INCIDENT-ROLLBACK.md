# QSLC Production Incident & Rollback Policy

1. Preserve the failing commit SHA, workflow URL, deployment URL, and error logs.
2. Stop additional production pushes until the current head is classified.
3. If the previous production head is known-good, record it as the rollback candidate.
4. Do not force-push or rewrite history to roll back.
5. Use a normal revert commit or provider rollback so the audit trail remains intact.
6. Provider authentication failures are classified as EXTERNAL_AUTH_BLOCKER rather than code defects.
7. Cloudflare bot challenges are not treated as application outages without additional evidence.
8. After rollback/recovery, rerun privacy, governance, build, deployment, and public-health checks.

Canonical production: https://qslc-hei.com