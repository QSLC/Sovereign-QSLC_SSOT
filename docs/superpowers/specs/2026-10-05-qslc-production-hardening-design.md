# QSLC EVE Production Hardening Design

## Purpose

Turn `QSLC/Sovereign-QSLC_SSOT` into a clean, production-grade public product gateway plus a strictly separated private owner/admin control plane, backed by auditable SSOT governance and verifiable deployment health.

## Success Criteria

1. No personal, payroll, banking, check, credential, owner-only evidence, or private SSOT values are rendered or shipped in the public application bundle.
2. The public site clearly presents QSLC EVE as a commercial product with accurate tiered offerings, synthetic demonstrations, learning content, API/data capabilities, and high-fidelity visuals.
3. The private owner/admin surface is separated by route/environment and receives only authenticated access to private operational data.
4. SSOT-driven approvals follow an explicit evidence state machine and every build/deployment change is auditable.
5. GitHub CI blocks privacy regressions, lint/build failures, and invalid deploys.
6. Cloudflare/domain routing is validated end-to-end with no redirect loop, stale target, or hidden deployment mismatch.
7. SharePoint/master operational records remain private and publish only sanitized public metrics contracts.
8. Desktop and iPhone layouts remain usable, legible, and visually consistent.

## Current-State Findings

- `src/App.tsx` is the current production entry surface and already uses synthetic public telemetry plus explicit copy stating private banking, payroll, SSOT, and owner controls are excluded.
- `src/SovereignMatrix.tsx` contains unrelated project data and commentary not appropriate for the QSLC public product repository.
- `package.json` still identifies the project as `sovereign-matrix`, showing the repository was not fully normalized after the sanitized public dashboard was introduced.
- The repository is public, so privacy enforcement must happen at source and CI level rather than relying on UI hiding alone.

## Architecture

### 1. Public Product Gateway

The public application is a product demonstration and conversion surface only.

It may expose:
- Product capabilities
- Synthetic telemetry
- Synthetic SSOT examples
- Architecture/topology concepts
- Learning Studio content
- API/Data Lab previews
- Tier descriptions and approved commercial pricing
- Public status/deployment health
- Non-sensitive product documentation

It must not expose:
- Personal information
- Payroll information
- Checks or pay history
- Bank account identifiers
- Banking balances
- Credential material
- API secrets or private tokens
- Private SSOT values
- Owner-only evidence logs
- Administrative actions

### 2. Commercial Product Catalog

The public gateway will support these offers as first-class product entities:

#### Hosted SaaS
- Starter — $49/month
- Pro — $149/month
- Business — $499/month

#### Deployment / One-Time
- Starter Command Center Template — $49 one-time
- Self-Hosted License — $499 one-time
- Custom Build — starting at $1,200
- Executive Pilot — $10,000

#### Enterprise Annual
- Enterprise Core — $120,000/year
- Enterprise Scale — $250,000/year
- Sovereign Platform — $500,000/year

Commercial copy must distinguish approved/current pricing from demonstration or quote-only offerings.

### 3. Public Demonstration System

The public experience should include interactive but non-sensitive demonstrations:

- Synthetic living-calculator / SSOT simulation
- Automation throughput visualization
- Evidence-gate simulation
- System topology / star-map view
- API/Data Lab preview with temporary synthetic examples
- Tier-specific capability comparison
- Learning Studio walkthroughs
- Unreal / Dispatch Orbit concept modules
- Public system-health indicators

Synthetic data must be clearly labeled so no visitor can mistake demo values for QSLC financial or operational truth.

### 4. Visual Design System

The interface should preserve the QSLC visual identity while increasing clarity and pixel density:

- Deep black / navy base
- Lime green primary signal color
- Purple secondary accent
- Cyan informational accent
- Galaxy / orbital / topology imagery
- High-resolution graphical panels
- Animated but restrained telemetry
- Glass/translucent surfaces where readable
- Strong desktop layout with responsive iPhone behavior
- Clear human-learning flow with tooltips, guided explanations, and next-action affordances

Animation must never hide errors, loading states, or command outcomes.

### 5. Private Sovereign Admin Boundary

The owner/admin control plane must be logically separated from the public gateway.

Private capabilities include:
- Live SSOT operational values
- Evidence Vault
- Integration status
- Deployment actions
- Audit logs
- Owner commands
- Private reports
- Financial / payroll operational data

The preferred architecture is a separate authenticated route or deployment target that imports no public-demo shortcuts around authorization.

Public frontend components must consume sanitized DTOs or synthetic contracts, never raw private workbook rows.

### 6. Evidence Governance Engine

`No Evidence = No Approval` becomes an explicit workflow contract.

Canonical states:
- `pending`
- `validated`
- `dual_approved`
- `executable`
- `blocked`
- `frozen`

Every state transition must include:
- Timestamp
- Actor/source
- Evidence reference
- Related build/deployment SHA where applicable
- Reason/result

Operations lacking required evidence stay blocked.

Administrative freeze logic must be implemented as deterministic policy logic, not as a visual-only indicator.

### 7. Retention Policy

Seven-year immutable retention may be marketed only when the backing storage and retention configuration are verified.

Until verified, the product should describe this as a configurable governance/retention policy rather than claiming immutable seven-year enforcement.

### 8. API and Data Layer

Future customer API/data access will follow customer-scoped boundaries.

Required model:
- Customer-scoped keys
- Synthetic/demo mode by default for public preview
- Environment-specific credentials
- Tier-specific integration allowances
- Quote-only expansion beyond standard limits
- No secrets embedded in browser bundles

### 9. SSOT and Workspace Boundary

SharePoint/master operational records remain private authoritative records.

The public site may receive only an explicitly sanitized metrics contract.

Required separation:

`Private SSOT -> Sanitization/Projection Layer -> Public Metrics Contract -> Public UI`

No UI component should reach directly into raw finance/payroll/master workbook data.

### 10. Repository Cleanup

The public QSLC repository should contain only QSLC product code, docs, tests, and approved assets.

Cleanup scope:
- Remove unrelated `SovereignMatrix.tsx` content and unused supporting code after dependency analysis confirms it is not required by production.
- Remove stale Matrix-specific project metadata and references.
- Rename package metadata to QSLC EVE naming.
- Update README and agent documentation to describe the actual product architecture.
- Preserve only reusable generic components that pass dependency and privacy review.

### 11. CI / Privacy Gates

Every merge should run:
- TypeScript compile/build
- Lint
- Tests
- Static privacy pattern scan
- Secret scan
- Production bundle validation
- Deployment smoke checks when applicable

Privacy scanning should reject source or generated assets containing forbidden classes such as:
- Bank routing/account identifiers
- Payroll/check records
- Credential patterns
- Private SSOT values intentionally classified as owner-only

False-positive handling must use reviewed allowlists, not disabled scanning.

### 12. Deployment and Domain Chain

Deployment verification order:

1. GitHub source state
2. Build result
3. Hosting target
4. Cloudflare DNS target
5. SSL/TLS state
6. Redirect rules
7. Final public URL
8. iPhone and desktop smoke tests

The system is not considered healthy merely because a build succeeds.

A redirect loop, 403, stale origin, mismatched host, or deployment target failure keeps deployment status red until resolved.

### 13. Error Handling and Human Interaction

The application must never flash raw command failures without explanation.

Every operator-visible command should expose:
- Running state
- Success state
- Error state
- Human-readable reason
- Recommended next action
- Evidence/log link when available

Learning surfaces should explain what a panel means and why a control exists, rather than presenting unexplained metrics.

### 14. Reporting

System reports should be generated from verified source state and labeled by freshness.

Public reports:
- Product capability
- Synthetic demonstrations
- Public deployment health

Private reports:
- SSOT status
- Evidence state
- Deployment audit
- Integration health
- Operational exceptions

### 15. Implementation Sequence

#### Merge A — Privacy and Repository Normalization
- Remove unrelated project contamination
- Normalize project naming/docs
- Add privacy and secret scanning
- Add tests proving public/private separation
- Verify build/lint

#### Merge B — Public Product Experience
- Implement approved tiers
- Upgrade graphics/pixel density
- Add synthetic calculator, telemetry, topology/star-map, learning flows
- Add responsive iPhone behavior
- Verify all public links and interaction states

#### Merge C — SSOT/Admin/Deployment Hardening
- Define sanitized metrics contract
- Implement evidence state machine
- Separate owner/admin surface
- Add verified reporting
- Validate SharePoint-to-public projection boundary
- Validate hosting + Cloudflare + redirect chain
- Run complete production smoke suite

Each merge must be independently buildable, reviewable, and reversible.

## Data Ownership and IP

QSLC-created product code, formulas, governance flows, original metrics frameworks, content, and design artifacts should be documented and versioned under QSLC-controlled repositories and storage.

The implementation must not label third-party platform technology as QSLC-owned IP. Documentation should distinguish:
- QSLC original work
- Open-source dependencies
- Third-party platforms/services
- Customer data

## Out of Scope for the First Hardening Pass

- Building a complete Unreal Engine game
- Implementing a full KDP publishing automation stack
- New banking functionality
- New payroll functionality
- Direct device camera/GPS surveillance features
- Claims of regulatory compliance that have not been independently verified

These can be separate product initiatives after the production gateway, privacy boundary, SSOT contract, and deployment chain are stable.

## Acceptance Gates

The hardening program is complete only when all of the following are evidenced:

- Public bundle contains no classified private operational data.
- Unrelated Matrix project data is removed from the production repository.
- All approved product tiers render correctly.
- Synthetic demos are labeled and functional.
- Private admin data cannot be reached through public routes.
- Build, lint, tests, privacy scan, and secret scan pass.
- Public deployment resolves without redirect loops or 403 errors.
- iPhone and desktop smoke tests pass.
- SharePoint/private SSOT data reaches public UI only through sanitized contracts.
- Reports display freshness/source state and do not imply verification when unavailable.
