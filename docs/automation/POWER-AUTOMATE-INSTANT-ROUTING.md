# QSLC instant email and file routing — Power Automate deployment blueprint

**Status:** DESIGN READY / NOT DEPLOYED  
**Owner:** QSLC work tenant  
**Timestamp:** QSLC | EVE 1010 | America/Los_Angeles | 2026-11-06T00:00:00-08:00

## Target private destination
OneDrive for Business / SharePoint document library, under `Documents/QSLC-SSOT/`:
- `00_INTAKE`
- `01_FINANCE_BANKING`
- `02_PAYROLL_HR`
- `03_LEGAL_CONTRACTS`
- `04_OPERATIONS_LOGISTICS`
- `05_SECURITY_COMPLIANCE`
- `06_TECH_CODE_MCP`
- `07_RECEIPTS_SUBSCRIPTIONS`
- `08_REPORTS_EVIDENCE`
- `09_ARCHIVE`
- `99_REVIEW_QUARANTINE`

## Flow A — single SharePoint classification worker
1. Trigger: SharePoint **When a file is created (properties only)** on the Documents library. Configure a trigger condition to exclude files whose path is under `Documents/QSLC-SSOT/00_INTAKE/`; this prevents the same attachment from being classified by both intake and library triggers.
2. Read metadata and file content; preserve original file ID, path, name, size, created time, modified time, and eTag.
3. Apply conservative classification. Route only high-confidence files by content and metadata:
   - bank statements/financial records → `01_FINANCE_BANKING`
   - payroll/HR → `02_PAYROLL_HR`
   - contracts/legal → `03_LEGAL_CONTRACTS`
   - operations/logistics → `04_OPERATIONS_LOGISTICS`
   - security/compliance → `05_SECURITY_COMPLIANCE`
   - source code/Codex/Copilot/MCP → `06_TECH_CODE_MCP`
   - invoices/receipts/subscriptions → `07_RECEIPTS_SUBSCRIPTIONS`
   - audit packets/reports → `08_REPORTS_EVIDENCE`
   - uncertain, encrypted, unreadable, duplicate-ambiguous, or suspicious → `99_REVIEW_QUARANTINE`
4. Check duplicates by available content hash plus size; filename alone is insufficient.
5. Move only after a destination is resolved. Preserve metadata and record source path, destination, file ID, and a full ISO-8601 timestamp including the `America/Los_Angeles` UTC offset in an append-only log.
6. On any failure, leave the original file in place and notify the owner. Never delete, overwrite, or empty recycle bins.

## Flow B — Outlook attachment intake (no second classifier)
1. Trigger: Outlook **When a new email arrives (V3)**, with Has Attachments = Yes. Monitor only the QSLC work mailbox.
2. Preserve sender, subject, received time, message ID, attachment name, and attachment size in the private audit record.
3. Skip suspicious, password-protected, unsupported, or ambiguous attachments and notify the owner.
4. Save eligible attachments to `Documents/QSLC-SSOT/00_INTAKE/` only. Flow B must not invoke classification or move the file. Flow A is the sole classifier and processes the new file once it arrives outside the excluded intake folder only after an explicit, separate handoff step moves it into the watched processing area.
5. Do not auto-open attachments, click links, unsubscribe, or delete messages.
6. Keep financial, legal, payroll, security, and account-recovery mail out of spam rules.

## Flow C — low-risk marketing review
1. Use sender reputation, authentication, unsubscribe headers, bulk-mail patterns, and message content.
2. Move obvious marketing to an Outlook `Marketing Review` folder only. Never auto-delete or auto-unsubscribe.
3. Never classify receipts, invoices, password resets, MFA, security alerts, court/legal, payroll, funding, or provider recovery notices as marketing.

## Required connection and permission checks
- Power Automate entitlement/environment access for the QSLC work identity.
- Authenticated SharePoint connector with access to the Documents library and target folders.
- Authenticated Outlook connector with read message/attachment and create-file permissions.
- If a custom Graph app is used instead of standard connectors, obtain tenant admin consent for the minimum required delegated/application scopes; do not store client secrets in this repository.
- Confirm the actual OneDrive/SharePoint site, library, folder IDs, and trigger conditions before enabling it.

## Acceptance tests
- New PDF bank statement routes to Finance.
- New Paychex payroll PDF routes to Payroll.
- New contract routes to Legal.
- New Stripe/Microsoft invoice routes to Subscriptions.
- Ambiguous encrypted file routes to Quarantine.
- Duplicate content is flagged, not silently overwritten.
- Simulated move failure leaves original untouched and writes a failure log.
- Outlook attachment intake creates one item in 00_INTAKE and does not trigger a competing classifier.
- No file is deleted; no external/public sharing is created.
- All logs include a full ISO-8601 timestamp and contain no secrets or unnecessary personal identifiers.

## Deployment record
No Power Automate flow has been created or enabled by this repository change. Deployment requires an authorized Power Automate environment and a real file-arrival test.
