#!/usr/bin/env python3
"""Read-only GitHub audit for the QSLC EVE repository. Never mutates GitHub."""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API = "https://api.github.com"
REPO = os.environ.get("GITHUB_REPOSITORY", "QSLC/Sovereign-QSLC_SSOT")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
OUT = Path(os.environ.get("EVE_AUDIT_OUTPUT", "audit-output"))
OUT.mkdir(parents=True, exist_ok=True)

def get(path):
    req = urllib.request.Request(
        API + path,
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            **({"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}),
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)

def safe_get(path):
    try:
        return {"ok": True, "data": get(path)}
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
        return {"ok": False, "error": f"{type(exc).__name__}: {exc}"}

def main():
    observed = datetime.now(timezone.utc).isoformat()
    repo = safe_get(f"/repos/{REPO}")
    prs = safe_get(f"/repos/{REPO}/pulls?state=open&per_page=100")
    issues = safe_get(f"/repos/{REPO}/issues?state=open&per_page=100")
    runs = safe_get(f"/repos/{REPO}/actions/runs?per_page=20")
    findings = []
    if not repo["ok"]:
        findings.append({"severity":"CRITICAL","area":"repository","status":"UNVERIFIED","detail":repo["error"]})
    if prs["ok"]:
        for pr in prs["data"]:
            findings.append({"severity":"HIGH" if pr.get("draft") is False else "MEDIUM","area":"pull_request","status":"OPEN","number":pr["number"],"title":pr["title"],"url":pr["html_url"],"head_sha":pr.get("head",{}).get("sha")})
    else:
        findings.append({"severity":"HIGH","area":"pull_requests","status":"UNVERIFIED","detail":prs["error"]})
    if issues["ok"]:
        for issue in issues["data"]:
            if "pull_request" not in issue:
                findings.append({"severity":"MEDIUM","area":"issue","status":"OPEN","number":issue["number"],"title":issue["title"],"url":issue["html_url"]})
    else:
        findings.append({"severity":"MEDIUM","area":"issues","status":"UNVERIFIED","detail":issues["error"]})
    workflow_runs = []
    if runs["ok"]:
        for run in runs["data"].get("workflow_runs", []):
            workflow_runs.append({"name":run.get("name"),"status":run.get("status"),"conclusion":run.get("conclusion"),"head_sha":run.get("head_sha"),"url":run.get("html_url"),"created_at":run.get("created_at")})
            if run.get("status") == "completed" and run.get("conclusion") not in ("success", "neutral", "skipped"):
                findings.append({"severity":"HIGH","area":"workflow","status":"FAILED","name":run.get("name"),"url":run.get("html_url"),"conclusion":run.get("conclusion")})
    else:
        findings.append({"severity":"MEDIUM","area":"workflows","status":"UNVERIFIED","detail":runs["error"]})
    report = {
        "schema_version":"1.0","system_id":"EVE-SOVEREIGN-CORE","repository":REPO,
        "observed_at":observed,"classification":"PUBLIC_REPOSITORY_METADATA_ONLY",
        "overall_health":"RED" if any(f["severity"] in ("CRITICAL","HIGH") for f in findings) else ("YELLOW" if findings else "GREEN"),
        "source_checks":{"repository":repo["ok"],"pull_requests":prs["ok"],"issues":issues["ok"],"workflow_runs":runs["ok"]},
        "repository":({"full_name":repo["data"].get("full_name"),"default_branch":repo["data"].get("default_branch"),"visibility":repo["data"].get("visibility")} if repo["ok"] else None),
        "open_pull_requests":([{"number":p["number"],"title":p["title"],"url":p["html_url"],"head_sha":p.get("head",{}).get("sha")} for p in prs["data"]] if prs["ok"] else None),
        "open_issues":([{"number":i["number"],"title":i["title"],"url":i["html_url"]} for i in issues["data"] if "pull_request" not in i] if issues["ok"] else None),
        "recent_workflow_runs":workflow_runs,"findings":findings,
        "limitations":["This audit reads GitHub repository metadata only.","It does not inspect Stripe, Cloudflare, Microsoft 365, banking, payroll, private SSOT records, local devices or production application health.","No repository changes, merges, deployments, messages, payments or other side effects are performed."]
    }
    json_path = OUT / "daily-audit.json"
    md_path = OUT / "daily-audit.md"
    json_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    lines = [f"# EVE Daily Repository Audit", "", f"- Observed: {observed}", f"- Repository: {REPO}", f"- Overall: **{report['overall_health']}**", "", "## Findings"]
    if findings:
        lines.extend([f"- **{f['severity']}** — {f.get('area')}: {f.get('title') or f.get('detail') or f.get('status')} {f.get('url','')}" for f in findings])
    else:
        lines.append("- No open PRs, issues, or failed recent workflow runs were detected in the checked sources.")
    lines += ["", "## Scope limitations"] + [f"- {item}" for item in report["limitations"]]
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"EVE audit generated: {json_path} and {md_path}")
    print(f"Overall health: {report['overall_health']}; findings: {len(findings)}")
    # Fail the job only when the API checks themselves are unavailable.
    if not all(report["source_checks"].values()):
        sys.exit(2)

if __name__ == "__main__":
    main()
