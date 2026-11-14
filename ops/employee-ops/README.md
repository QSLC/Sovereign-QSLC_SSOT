# QSLC Employee Operations — Public-Safe Blueprint

**Corporate tax treatment:** C corporation, as stated by the owner on 2026-11-14. This is an owner-provided operating assumption; verify against the current IRS election/return and corporate records before tax filing or payroll changes.

## System decision

- **Paychex Flex:** system of record for employee onboarding, payroll, pay statements, timecards, and supported mobile clock-in features.
- **Microsoft 365:** Teams meetings, SharePoint controlled company documents, OneDrive authorized working files, Outlook communications.
- **EVE / QSLC employee portal:** role-based operational layer for assignments, schedules, procedures, training, requests, approvals, and non-payroll dashboards.
- **Do not build a payroll processor.** The QSLC portal must not calculate tax withholding, originate wages, or replace Paychex. Integrate only through supported, authorized Paychex interfaces and exports.

## Employee portal scope

The portal is a mobile-first front door for staff. It should show only the signed-in employee's assigned work, approved schedule, policies, training, notices, and allowed requests. Managers see only their assigned teams. HR/payroll sees employee administration only where authorized. Finance and owner-only records remain separate.

**Clock-in rule:** Paychex Flex remains the timekeeping source of truth. Confirm the QSLC Paychex plan includes mobile punches, location/geofencing controls, manager approvals, and the required employee count before configuring. A GPS punch is not blanket permission to work anywhere. Configure authorized sites, remote-work rules, missed-punch corrections, meal/rest break procedures, and audit trails.

## Proposed operating defaults — NOT APPROVED

- Pay cycle: biweekly (26 scheduled paydays/year) is a proposal, not a live payroll setting.
- Pay frequency and payday must be confirmed in Paychex and comply with Washington's regular-payday requirements.
- Every role's pay rate, classification, overtime status, hours, manager, and start date remain unset until written approval.
- No employee or contractor should be onboarded from this public template.

## C-corporation compensation controls

1. Compensation for services performed by the CEO/officers is handled as payroll wages through the corporation's payroll process, with applicable withholding and reporting.
2. Shareholder dividends are a separate corporate distribution decision; they are not a substitute for wages for services. Dividends require proper corporate authorization and tax/accounting review.
3. Reimbursements require documented business purpose and receipts and must not be mixed with wages or dividends.
4. Do not activate owner compensation, dividends, advances, or reimbursements from this template. Require board/corporate approval, cash-flow review, and CPA/payroll review.
5. Do not label an employee exempt based only on title or salary. Apply duties and current federal, Washington, and local rules.

## Role catalog

The companion `employee-config.example.json` lists proposed positions and access boundaries. It deliberately contains no names, personal data, or pay rates. The role catalog is not a hiring plan or approved payroll register.

## Onboarding checklist

- Signed offer / written compensation terms and job description.
- Worker classification and overtime review.
- Form I-9 and Form W-4 through the approved secure process.
- Washington new-hire reporting and applicable state/local notices.
- Paychex employee profile, pay method, tax setup, and approved pay rate.
- Microsoft identity, MFA, Teams, and least-privilege SharePoint access.
- Mobile clock-in test at an authorized work location; remote-work rules documented.
- Manager, schedule, emergency contact process, training, and policy acknowledgments.
- First timecard reviewed and approved before payroll submission.

Do not place I-9s, W-4s, direct-deposit details, SSNs, home addresses, wage data, or employee records in this public repository.

## 15-minute kickoff

See [15-minute-kickoff.md](./15-minute-kickoff.md).

## Validation

Run from repository root:

```powershell
python ops/employee-ops/validate_employee_config.py ops/employee-ops/employee-config.example.json
python -m unittest discover -s ops/employee-ops/tests -v
```

All tests use synthetic configuration only. No Paychex, Microsoft, bank, or employee system is contacted.
