#!/usr/bin/env python3
"""Read-only EVE-WAKE1010 readiness probe; never prints secret values."""
from __future__ import annotations
import argparse, json, os
from datetime import datetime, timezone

CHECKS = {
    "github": ["GITHUB_TOKEN"],
    "cloudflare": ["CLOUDFLARE_API_TOKEN"],
    "azure": ["AZURE_CLIENT_ID", "AZURE_TENANT_ID", "AZURE_SUBSCRIPTION_ID"],
    "mcp": ["EVE_MCP_ENDPOINT", "EVE_MCP_AUTH_REF"],
    "local_eve_brain": ["EVE_BRAIN_PATH"],
    "private_ssot": ["EVE_SSOT_ROOT"],
}

def build_report():
    items = []
    for name, keys in CHECKS.items():
        present = [key for key in keys if bool(os.environ.get(key))]
        missing = [key for key in keys if not os.environ.get(key)]
        items.append({
            "component": name,
            "status": "CONFIGURED" if not missing else "UNVERIFIED",
            "present_variables": present,
            "missing_variables": missing,
            "note": "Configuration presence only; no authentication or network test was performed."
        })
    return {
        "system": "EVE-WAKE1010 / QSLC SOVEREIGN HYBRID",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "mode": "READ_ONLY_CONFIGURATION_PROBE",
        "overall_status": "CONFIGURATION_PARTIAL" if any(x["missing_variables"] for x in items) else "CONFIGURED_NOT_VERIFIED",
        "components": items,
        "safety": {
            "secret_values_emitted": False,
            "network_requests_made": False,
            "files_modified": False,
            "verified_claims_made": False
        }
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON")
    args = parser.parse_args()
    report = build_report()
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f'{report["system"]} — {report["overall_status"]}')
        for item in report["components"]:
            print(f'- {item["component"]}: {item["status"]}')
            if item["missing_variables"]:
                print("  Missing configuration names: " + ", ".join(item["missing_variables"]))
        print("Read-only: no network requests, no writes, no secret values displayed.")

if __name__ == "__main__":
    main()
