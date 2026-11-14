# EVE-WAKE1010 — QSLC Sovereign Hybrid Foundation

**State: FOUNDATION COMMITTED TO FEATURE BRANCH — NOT A LIVE RUNTIME DEPLOYMENT**

This folder defines a safe, auditable integration boundary for a future private EVE runtime. It is deliberately public-safe: no credentials, personal data, private brain files, customer records, payroll, banking, or owner-only SSOT data belong here.

## Components

- `system-manifest.json`: canonical component registry and evidence states.
- `supervisor.py`: local, read-only readiness probe. It reports whether required environment variables exist; it never prints their values or performs writes.
- `dashboard.html`: local status view driven by a JSON status document. It does not claim that remote services are connected.
- `.env.example`: variable names only; never put real values in source control.

## First run

```bash
python ops/eve-wake1010/supervisor.py --json
```

To check selected integrations, set environment variables in the local machine's secret store or shell, then rerun. The probe only checks presence. Presence is **not** authentication or a successful API test.

## Evidence vocabulary

- `UNVERIFIED`: no successful live test is recorded.
- `CONFIGURED`: required configuration is present; connectivity is not established.
- `VERIFIED`: a documented live test passed and its timestamp/evidence reference is recorded.
- `BLOCKED`: a prerequisite or permission prevents the test.
- `FAILED`: a test ran and failed.

Do not promote a component to VERIFIED based on a plan, a saved URL, or an environment variable alone.

## Security boundary

The public repository is not the private EVE brain. Keep the original brain, runtime secrets, customer data, local paths containing sensitive files, and private evidence in owner-controlled private storage. Use least-privilege tokens, rotate credentials after suspected exposure, and never disable branch protection or privacy gates to force deployment.

## Next authorized implementation stages

1. Import this safe manifest into the private canonical SSOT.
2. Recover and checksum the original EVE brain from an owner-authorized source.
3. Configure MCP servers individually with least-privilege scopes.
4. Run live read-only connectivity checks from ROGLEX.
5. Add authenticated private telemetry only after the private endpoint and access policy are verified.
6. Deploy the private dashboard separately from the public QSLC website.
