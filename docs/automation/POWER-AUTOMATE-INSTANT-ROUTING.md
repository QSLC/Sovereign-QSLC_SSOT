# QSLC instant email and file routing — Power Automate deployment blueprint

**Status:** DESIGN READY / NOT DEPLOYED  
**Owner:** QSLC work tenant  
**Timestamp:** QSLC | EVE 1010 | America/Los_Angeles | 2026-11-05T15:17:08-08:00

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

## Flow A — SharePoint file arrival
1. Trigger: SharePoint **When a file is created (properties only)** on the OneDrive/SharePoint Documents library. Do not use the deprecated folder-specific trigger.
2. Read metadata and file content; preserve original file ID, path, name, size, created time, modified time, and eTag.
3. Apply a conservative classification. Route only high-confidence files by content and metadata:
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
5. Move only after a destination is resolved. Preserve metadata and record source path, destination, file ID, and an ISO-8601 timestamp including the `America/Los_Angeles` UTC offset in an append-only log. Use the format `QSLC | EVE 1010 | America/Los_Angeles | YYYY-MM-DDTHH:mm:ss-08:00` (or `-07:00` during daylight time).
6. On any failure, leave the original file in place and notify the owner. Never delete, overwrite, or empty recycle bins.

## Flow B — Outlook attachment intake
1. Trigger: Outlook **When a new email arrives (V3)**, with Has Attachments = Yes. Monitor only the QSLC work mailbox.
2. Preserve sender, subject, received time, message ID, attachment name, and attachment size.
3. Skip suspicious, password-protected, unsupported, or ambiguous attachments and notify the owner.
4. Save eligible attachments into the private intake folder, then invoke the same classification and duplicate checks as Flow A.
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
- Confirm the actual OneDrive/SharePoint site, library, and folder IDs in the flow before enabling it.

## Acceptance tests
- New PDF bank statement routes to Finance.
- New Paychex payroll PDF routes to Payroll.
- New contract routes to Legal.
- New Stripe/Microsoft invoice routes to Subscriptions.
- Ambiguous encrypted file routes to Quarantine.
- Duplicate content is flagged, not silently overwritten.
- Simulated move failure leaves original untouched and writes a failure log.
- No file is deleted; no external/public sharing is created.
- All logs include the QSLC timestamp stamp and contain no secrets or personal identifiers beyond the minimum required metadata.

## Deployment record
No Power Automate flow has been created or enabled by this repository change. The available connected Microsoft 365 actions in this session expose Outlook and SharePoint file operations, but not Power Automate flow creation, tenant connection management, or admin-consent controls. Deployment must be completed in the authorized Power Automate environment and then verified by a real file-arrival test.
