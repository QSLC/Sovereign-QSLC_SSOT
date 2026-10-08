# EVE-GENESIS CONSTITUTION v1.0

Document ID: EVE-CON-001  
Status: Foundational governing charter  
Scope: QSLC / EVE SSOT, automation, approvals, evidence, identity, finance, payroll, security, research, and public product surfaces.

## Governing motto

**Truth Before Opinion**  
**Evidence Before Action**  
**Governance Before Automation**  
**Accountability Before Authority**

## Core gates

1. Identity verification
2. Evidence verification
3. SSOT validation
4. Policy validation
5. Approval validation
6. Execution
7. Audit registration
8. Post-execution review

## SSOT authority

The canonical SSOT controls governed business state until formally corrected. Conflicts are REVIEW, missing inputs are UNKNOWN, and missing data is never silently converted to zero.

## Fragmentation blocker

Before creating any Customer, Employee, Project, Asset, Contract, Invoice, Payroll Run, or other governed object:

1. Search the canonical registry.
2. Reuse the existing record when matched.
3. Create a new record only when no governed match exists.
4. Flag duplicates instead of silently creating parallel truth.

Experimental systems may not write to production without approval.

## Agent charter

Agents may analyze, summarize, forecast, recommend, classify, reconcile, validate, prepare documents, update permitted dashboards, and execute low-risk pre-approved actions when provider permissions and policy allow.

Agents do not independently:
- release payroll;
- transfer funds;
- submit government filings;
- certify taxes;
- make employment decisions;
- create legal obligations;
- override identity, consent, signature, or approval requirements.

## Separation of duties

Creator != approver for controlled actions.

Dual approval is required where adopted for payroll release, financial movement, privileged security changes, corporate-governance changes, or ownership changes.

Automatic corruption-risk flags include:
- self-approval;
- duplicate invoice;
- duplicate payroll run;
- creator/approver conflict;
- role conflict;
- missing evidence;
- attempted audit-log tampering.

## Provider independence / anti-lockout

QSLC must remain operable if ChatGPT, Gemini, another model, an app connector, or a SaaS provider becomes unavailable.

Canonical code, SSOT records, governance rules, prompts/configuration, audit exports, and recovery information must be stored in QSLC-controlled repositories/storage outside AI chat sessions.

This control is for resilience. It does **not** bypass MFA, security controls, provider terms, legal restrictions, account ownership verification, or lawful access restrictions.

## Identity

Microsoft 365 is the primary identity authority unless formally changed.

Required controls include MFA, role-based access, device registration where supported, conditional-access policy where licensed/configured, and auditable privileged access.

## Biometric governance

Biometric data is RESTRICTED. It may verify identity when authorized, but it does not grant unlimited authority.

## Financial integrity

Financial calculations must be reproducible, auditable, and traceable. Unverified claims are UNVALIDATED. A checkout session is not a sale; a deployment is not revenue; a payment is not settled cash until provider evidence supports the applicable state.

## Public / private boundary

Public site:
- product descriptions;
- verified pricing;
- synthetic/demo calculators clearly labeled;
- source-safe architecture and governance;
- public status;
- meeting/questions intake;
- public hiring forms and instructions.

Private/admin:
- payroll;
- banking;
- credentials;
- employee evidence;
- legal evidence;
- private SSOT;
- proprietary formulas;
- provider secrets;
- restricted telemetry.

## Constitutional amendment

A constitutional amendment requires the adopted governance vote/approval process, audit registration, versioning, and an effective date.
