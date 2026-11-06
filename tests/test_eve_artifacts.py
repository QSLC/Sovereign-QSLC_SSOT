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

    def test_event_schema_keeps_sample_and_synthetic_distinct(self):
        schema = json.loads((ROOT / "schemas/event.schema.json").read_text(encoding="utf-8"))
        self.assertEqual(schema["properties"]["classification"]["enum"], ["CONNECTED", "SAMPLE", "SYNTHETIC"])

    def test_audit_script_is_present_and_read_only_by_contract(self):
        source = (ROOT / "scripts/eve_daily_audit.py").read_text(encoding="utf-8")
        self.assertIn("Read-only GitHub audit", source)
        self.assertNotIn("POST", source)
        self.assertNotIn("PATCH", source)
        self.assertNotIn("DELETE", source)

if __name__ == "__main__":
    unittest.main()
