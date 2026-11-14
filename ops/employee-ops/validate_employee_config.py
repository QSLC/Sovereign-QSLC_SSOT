#!/usr/bin/env python3
"""Validate public-safe QSLC employee-operations configuration; standard library only."""
import json
import sys
from pathlib import Path

REQUIRED_TOP = {"company", "systems", "pay_cycle", "roles", "security"}
ALLOWED_TOP = REQUIRED_TOP
ALLOWED_ROLE_FIELDS = {"id", "title", "department", "access", "pay_type", "pay_rate", "approval_status"}
FORBIDDEN_KEYS = {"employee_name", "name", "ssn", "social_security_number", "dob", "date_of_birth",
                  "home_address", "address", "personal_email", "phone", "bank_account", "routing_number",
                  "direct_deposit", "tax_id", "wage", "salary", "payroll_id"}

def scan_for_private_keys(value, path="$"):
    errors = []
    if isinstance(value, dict):
        for key, child in value.items():
            normalized = str(key).lower()
            if normalized in FORBIDDEN_KEYS or any(token in normalized for token in ("ssn", "social_security", "bank_account", "routing_number", "direct_deposit")):
                errors.append(f"{path}.{key} is a prohibited personal/payroll-data field")
            errors.extend(scan_for_private_keys(child, f"{path}.{key}"))
    elif isinstance(value, list):
        for i, child in enumerate(value):
            errors.extend(scan_for_private_keys(child, f"{path}[{i}]"))
    return errors

def validate(data):
    errors = []
    if not isinstance(data, dict):
        return ["root must be a JSON object"]
    errors.extend(scan_for_private_keys(data))
    unknown_top = set(data) - ALLOWED_TOP
    if unknown_top:
        errors.append("unknown top-level keys: " + ", ".join(sorted(unknown_top)))
    missing = REQUIRED_TOP - set(data)
    if missing:
        errors.append("missing top-level keys: " + ", ".join(sorted(missing)))
        return errors
    company = data["company"]
    if not isinstance(company, dict) or company.get("tax_classification") != "C_CORPORATION":
        errors.append("company.tax_classification must be C_CORPORATION")
    systems = data["systems"]
    if not isinstance(systems, dict) or systems.get("payroll_timekeeping") != "Paychex Flex":
        errors.append("Paychex Flex must remain the payroll/timekeeping system of record")
    if not isinstance(systems, dict) or systems.get("payroll_is_external_system_of_record") is not True:
        errors.append("payroll_is_external_system_of_record must be true")
    cycle = data["pay_cycle"]
    if not isinstance(cycle, dict):
        errors.append("pay_cycle must be an object")
    elif cycle.get("frequency") == "BIWEEKLY":
        if cycle.get("scheduled_paydays_per_year") != 26:
            errors.append("biweekly schedule must declare 26 paydays/year")
        if cycle.get("status") != "PROPOSED_NOT_APPROVED":
            errors.append("example biweekly cycle must remain unapproved")
    roles = data["roles"]
    if not isinstance(roles, list) or not roles:
        errors.append("roles must be a non-empty list")
    else:
        seen = set()
        for i, role in enumerate(roles):
            if not isinstance(role, dict):
                errors.append(f"roles[{i}] must be an object")
                continue
            unknown = set(role) - ALLOWED_ROLE_FIELDS
            if unknown:
                errors.append(f"roles[{i}] contains unknown fields: " + ", ".join(sorted(unknown)))
            rid = role.get("id")
            if not isinstance(rid, str) or not rid or rid in seen:
                errors.append(f"roles[{i}].id must be present and unique")
            else:
                seen.add(rid)
            rate = role.get("pay_rate")
            if role.get("approval_status") != "APPROVED" and rate is not None:
                errors.append(f"roles[{i}] has a pay_rate without APPROVED status")
            if role.get("approval_status") == "APPROVED":
                if isinstance(rate, bool) or not isinstance(rate, (int, float)) or rate <= 0:
                    errors.append(f"roles[{i}] approved pay_rate must be a positive number, not a boolean")
    security = data["security"]
    if not isinstance(security, dict):
        errors.append("security must be an object")
    else:
        if security.get("mfa_required") is not True or security.get("least_privilege") is not True:
            errors.append("MFA and least-privilege access must be enabled")
        if security.get("employee_personal_data_in_public_repo") is not False:
            errors.append("employee personal data must not be stored in public repository")
        if security.get("payroll_data_in_public_repo") is not False:
            errors.append("payroll data must not be stored in public repository")
    return errors

def main():
    if len(sys.argv) != 2:
        print("Usage: python validate_employee_config.py <config.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read valid JSON: {exc}", file=sys.stderr)
        return 2
    errors = validate(data)
    if errors:
        print("VALIDATION FAILED")
        for err in errors:
            print(f"- {err}")
        return 1
    print("VALIDATION PASS — schema and public/private guardrails satisfied.")
    print("NOTE: This validates a template only; it does not approve payroll or connect external systems.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
