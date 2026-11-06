import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


class EveArtifactTests(unittest.TestCase):
    def test_required_json_artifacts_parse(self):
        for name in [
            "SYSTEM_INVENTORY.json", "INTEGRATIONS.json", "TASK_QUEUE.json",
            "INCIDENTS.json", "PERMISSIONS.json", "BACKUP_MANIFEST.json",
            "TEST_REPORT.json", "schemas/event.schema.json",
            "schemas/agent-task.schema.json",
        ]:
            with self.subTest(name=name):
                json.loads((ROOT / name).read_text(encoding="utf-8"))

    def test_public_artifacts_declare_sanitized_scope(self):
        inventory = json.loads((ROOT / "SYSTEM_INVENTORY.json").read_text(encoding="utf-8"))
        integrations = json.loads((ROOT / "INTEGRATIONS.json").read_text(encoding="utf-8"))
        self.assertTrue(inventory["private_data_excluded"])
        self.assertEqual(inventory["classification"], "PUBLIC_SANITIZED")
        self.assertEqual(integrations["classification"], "PUBLIC_SANITIZED")

    def test_financial_agent_has_no_transaction_authority(self):
        permissions = json.loads((ROOT / "PERMISSIONS.json").read_text(encoding="utf-8"))
        financial = next(x for x in permissions["roles"] if x["agent"] == "FINANCIAL_ENGINE")
        self.assertIn("payments", financial["denied_without_explicit_authorization"])
        self.assertIn("transfers", financial["denied_without_explicit_authorization"])

    def test_event_schema_accepts_provenance_contract(self):
        schema = json.loads((ROOT / "schemas/event.schema.json").read_text(encoding="utf-8"))
        self.assertIn("provenance", schema["required"])
        provenance = schema["properties"]["provenance"]
        self.assertEqual(provenance["type"], "object")
        self.assertTrue({"source_type", "source_reference", "observed_at"}.issubset(provenance["required"]))
        self.assertEqual(schema["properties"]["classification"]["enum"], ["CONNECTED", "SAMPLE", "SYNTHETIC"])

    def test_task_schema_covers_lifecycle_and_requires_explicit_approval(self):
        schema = json.loads((ROOT / "schemas/agent-task.schema.json").read_text(encoding="utf-8"))
        statuses = schema["properties"]["status"]["enum"]
        for status in ["RECEIVED", "VALIDATED", "AUTHORIZED", "EXECUTING", "TESTING", "VERIFIED"]:
            self.assertIn(status, statuses)
        gated = next(rule for rule in schema["allOf"] if rule.get("if", {}).get("properties", {}).get("approval_required", {}).get("const") is True)
        self.assertIn("approval_status", gated["then"]["required"])
        self.assertEqual(gated["then"]["properties"]["approval_status"]["enum"], ["PENDING", "APPROVED", "REJECTED"])

    def test_audit_script_is_read_only_paginated_and_timezone_stamped(self):
        source = (ROOT / "scripts/eve_daily_audit.py").read_text(encoding="utf-8")
        self.assertIn("Read-only", source)
        self.assertIn("get_all_pages", source)
        self.assertIn('rel="next"', source)
        self.assertIn("America/Los_Angeles", source)
        self.assertIn("evidence_stamp", source)
        self.assertNotIn('"POST"', source)
        self.assertNotIn('"PATCH"', source)
        self.assertNotIn('"DELETE"', source)

    def test_power_automate_handoff_creates_processing_copy(self):
        source = (ROOT / "docs/automation/POWER-AUTOMATE-INSTANT-ROUTING.md").read_text(encoding="utf-8")
        self.assertIn("Create file", source)
        self.assertIn("new file-created event", source)
        self.assertIn("idempotency key", source)


if __name__ == "__main__":
    unittest.main()
