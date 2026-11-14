# EVE-WAKE1010 — Recovered Command Language (v0.2)

**Provenance:** reconstructed from prior QSLC conversation records and connected SharePoint workbooks `QSLC_EVE_SOVEREIGN_MASTER_360_V2.xlsx` and `QSLC_EVE_GENESIS_GOVERNED_BACKBONE_COMPLETE_2026-10-08.xlsx`. This is a recovered command index, not proof that the local EVE executable is installed or running.

## Wake and startup

```powershell
Get-Command eve -All -ErrorAction SilentlyContinue
where.exe eve
Test-Path 'C:\QSLC\EVE\eve_wake.ps1'
if (Test-Path 'C:\QSLC\EVE\eve_wake.ps1') { & 'C:\QSLC\EVE\eve_wake.ps1' -RunInventory }
EVE_WAKE 1010
ollama list
ollama run llama3
```

## Native EVE CLI
```text
eve help
eve status
eve ask "<natural language request>"
eve run <approved-workflow>
eve ingest <file-or-folder>
eve dashboard
eve open <target>
```

## Master Bridge
```text
status
health
bridge
brain
payroll
onedrive
agent
paths
help
```

## Mobile / Shortcuts remote commands
```text
status
start
stop
restart
logs
```

## EVE-WAKE1010 natural-language grammar

```text
EVE-WAKE1010: <MODE> | <DOMAIN> | <ACTION> | <SCOPE> | <EVIDENCE>
```

Modes: `STATUS`, `DISCOVER`, `PLAN`, `EXECUTE`, `VERIFY`, `REPAIR`, `ROLLBACK`, `REPORT`.

Domains: `SYSTEM`, `BRAIN`, `FILES`, `SSOT`, `GITHUB`, `CLOUDFLARE`, `AZURE`, `M365`, `SHAREPOINT`, `PAYCHEX`, `EMPLOYEES`, `DASHBOARD`, `SECURITY`.

Examples:
```text
EVE-WAKE1010: STATUS | SYSTEM | FULL_HEALTH | ROGLEX | READ_ONLY
EVE-WAKE1010: DISCOVER | BRAIN | LOCATE_ORIGINAL | LOCAL_AND_CLOUD | HASH_AND_REPORT
EVE-WAKE1010: VERIFY | SSOT | RECONCILE | ALL_SOURCES | MISSING_IS_NOT_ZERO
EVE-WAKE1010: REPORT | SYSTEM | DAILY_BRIEF | SHAREPOINT | VERIFIED_ONLY
EVE-WAKE1010: PLAN | EMPLOYEES | ONBOARDING | ALL_ROLES | NO_PAYROLL_CHANGES
EVE-WAKE1010: REPAIR | SYSTEM | SAFE_FIXES | FEATURE_BRANCH | BACKUP_TEST_ROLLBACK
```

## State and safety rules
- `UNVERIFIED`: no authoritative evidence yet.
- `CALCULATED`: derived from identified inputs; not source-confirmed.
- `VERIFIED`: confirmed at the authoritative source with timestamp and reference.
- `SETTLED`: final settlement evidence exists.
- `APPROVED` / `REJECTED`: explicit authorized decision.
- Default to read-only discovery; never print secrets.
- Never put private brain, employee PII, payroll, banking, or customer-confidential records in a public repository.
- Require explicit authorization for protected-branch merges, production deployment, DNS, permissions, billing, payroll, payments, deletion, or secret changes.

## Historical paths — verify before use
- Workspace root: `C:\QSLC`
- Wake script: `C:\QSLC\EVE\eve_wake.ps1`
- Local dashboard: `http://localhost:8502`
- Static dashboard: `C:\QSLC\Dashboard\qslc_dashboard.html`
- Local model direction: Ollama + Llama 3.x; inspect exact installed tag with `ollama list`.

The exact local executable, full original command grammar, original brain file, Python packages, MCP servers, and shell profile have not been inspected on ROGLEX in this session. Run inventory first; do not assume historical paths or commands still exist.
