# EVE Sovereign Operating System — Multi-Agent Architecture v1.0

## System identity
- System ID: EVE-SOVEREIGN-CORE
- Organization: Quantum Sovereign Logistics Corp (QSLC)
- EVE Core: command, orchestration, prioritization, memory and reconciliation layer.
- Specialized agents: scoped execution workers.
- Human leadership: final authority for consequential decisions.

## Logical topology
```
Users: Chat / Voice / Mobile / Authorized Desktop
                    |
              EVE Command Bus
                    |
          EVE Core / Policy Engine
       _________|___________
      |    |    |    |      |
   Codex Comm Business Finance Security
      |    |    |    |      |
      +----+----+----+------+
                    |
           Event / Evidence Store
                    |
           Analytics / Reporting
```

## Agent registry
| ID | Agent | Responsibility | Primary outputs |
|---|---|---|---|
| 01 | EVE CORE | Priorities, routing, memory, conflict resolution | EVE_MASTER_SSOT.md, EVE_MEMORY.md, TASK_QUEUE.json |
| 02 | CODEX ENGINE | Repository inventory, code, tests, PRs, CI | CODE_HEALTH_REPORT.md, TEST_REPORT.json, DEPLOYMENT_REPORT.md |
| 03 | COMMUNICATION ENGINE | Email/calendar triage, drafts, escalation | COMMUNICATION_DIGEST.md, DAILY_BRIEFING.md |
| 04 | BUSINESS ENGINE | Customers, contracts, sales, vendors, projects | BUSINESS_STATUS.md, CUSTOMER_PIPELINE.md |
| 05 | FINANCIAL ENGINE | Read-only visibility, subscriptions, forecasting | FINANCIAL_STATUS.md, FORECAST_REPORT.md |
| 06 | SECURITY ENGINE | Vulnerabilities, permissions, backups, incidents | INCIDENTS.json, PERMISSIONS.json, BACKUP_MANIFEST.json |
| 07 | ANALYTICS ENGINE | KPI definitions, trends, executive reporting | EXECUTIVE_DASHBOARD.md, WEEKLY_REPORT.md, KPI_SUMMARY.json |
| 08 | VOICE ENGINE | Voice-to-command translation and spoken summaries | normalized command envelope and response |

These are logical roles. A role is not considered operational until its runtime, permissions, data sources, health checks and evidence are connected and tested.

## Event contract
Events must conform to `schemas/event.schema.json`. Every event includes a unique ID, schema version, timestamp, source, severity, category, description, status, and provenance. Use idempotency keys to prevent duplicate processing. Include classification (CONNECTED, SAMPLE, or SYNTHETIC) and never promote sample/synthetic information to connected evidence.

## Execution lifecycle
`RECEIVED → VALIDATED → AUTHORIZED → QUEUED → EXECUTING → TESTING → VERIFIED`
Failures transition to `BLOCKED` or `FAILED`, create an incident and retain evidence. Human approval is a separate explicit state and cannot be inferred from task creation.

## Human approval gates
Approval required before:
- Production deployments and protected branch merges.
- Infrastructure, DNS, identity-provider, or security-policy changes.
- Payments, transfers, payout destination changes, spending, or financial commitments.
- Creating/deleting users or escalating permissions.
- Deleting, overwriting, or migrating user data.
- Executing contracts or making customer commitments.
- Sending external communications that create commitments or disclose sensitive information.

## Data boundaries
- Public repository: code, schemas, sanitized templates, non-sensitive architecture.
- Private systems: finance, payroll, banking, customers, identity, legal, private email, personal records.
- Secrets: approved secret managers only; never source control, logs, artifacts or prompts.
- Agent access: least privilege, scoped by task and provider.

## Reliability
- Idempotent event handling.
- Append-only audit/evidence.
- Retries with bounded backoff.
- Dead-letter/quarantine path.
- Backups before destructive changes.
- Rollback plans for deployable changes.
- Health checks report UNKNOWN when evidence is unavailable.
