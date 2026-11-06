# EVE Master Single Source of Truth

**System:** EVE-SOVEREIGN-CORE  
**Organization:** Quantum Sovereign Logistics Corp (QSLC)  
**Version:** 1.0  
**Last reconciled:** 2026-11-06  
**Timezone:** America/Los_Angeles  
**Repository:** QSLC/Sovereign-QSLC_SSOT  
**Branch:** main is the production source; this feature branch is an implementation proposal.

## Governance
EVE is the coordination and orchestration layer. Specialized agents perform scoped work. Human leadership retains authority over consequential decisions.

## Evidence rules
- Allowed statuses: UNVERIFIED, INVESTIGATING, REPAIRING, TESTING, CALCULATED, VERIFIED, SETTLED, APPROVED, REJECTED, BLOCKED.
- A successful preview is not production deployment evidence.
- A passing test is evidence only for the tested scope and commit.
- Unknown is never zero; inaccessible is never healthy.
- Every material claim must include source, observed timestamp, commit/resource identifier, and evidence link where available.
- Public repository artifacts contain architecture and sanitized metadata only. Private customer, finance, payroll, banking, identity, legal, and personal records stay in access-controlled private systems.

## Current verified project baseline
| Component | Status | Evidence |
|---|---|---|
| Repository QSLC/Sovereign-QSLC_SSOT | VERIFIED | GitHub repository metadata; default branch main |
| PR #34 Codex/Copilot configuration | OPEN / REVIEW REQUIRED | Current PR metadata; preview deployed for commit efb28f7 |
| PR #34 Codex review | FINDINGS OPEN | Review comments identify configuration placement, attachment double-processing, and validation-command policy conflicts |
| Power Automate instant routing | UNVERIFIED / NOT DEPLOYED | PR #34 blueprint explicitly records design only |
| Local Codex runtime on ROG Ally X | UNVERIFIED | No local machine execution evidence in this repository |
| Microsoft 365 connector/flow deployment | UNVERIFIED | No flow deployment receipt available |
| Production deployment of this architecture | NOT DEPLOYED | Feature branch only |

## Agent registry
See [ARCHITECTURE.md](ARCHITECTURE.md). Agents are logical roles, not claims that eight autonomous services are already running.

## Current priorities
1. Implement the multi-agent contract and evidence artifacts on a reviewable branch.
2. Resolve all open Codex findings on PR #34 before merging.
3. Validate the scheduled read-only GitHub audit workflow.
4. Connect additional providers only through explicit OAuth/connector authorization and least privilege.
5. Keep production deployment and financial actions behind human approval.

## Reconciliation
This file is a sanitized public operational index. It is not the private QSLC business ledger or the authoritative store for sensitive operating records.
