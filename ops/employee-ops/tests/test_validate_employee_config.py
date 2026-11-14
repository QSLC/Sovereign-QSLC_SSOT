import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
VALIDATOR = ROOT / "ops" / "employee-ops" / "validate_employee_config.py"
SAMPLE = ROOT / "ops" / "employee-ops" / "employee-config.example.json"

class EmployeeConfigTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(SAMPLE.read_text(encoding="utf-8"))

    def run_validator(self, data):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "config.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(VALIDATOR), str(path)],
                capture_output=True, text=True, check=False
            )

    def test_example_template_passes(self):
        result = self.run_validator(self.data)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("VALIDATION PASS", result.stdout)

    def test_rejects_non_c_corp(self):
        bad = copy.deepcopy(self.data)
        bad["company"]["tax_classification"] = "S_CORPORATION"
        self.assertEqual(self.run_validator(bad).returncode, 1)

    def test_rejects_payroll_processor_replacement(self):
        bad = copy.deepcopy(self.data)
        bad["systems"]["payroll_is_external_system_of_record"] = False
        self.assertEqual(self.run_validator(bad).returncode, 1)

    def test_rejects_unapproved_pay_rate(self):
        bad = copy.deepcopy(self.data)
        bad["roles"][0]["pay_rate"] = 75
        self.assertEqual(self.run_validator(bad).returncode, 1)

    def test_rejects_public_employee_data(self):
        bad = copy.deepcopy(self.data)
        bad["security"]["employee_personal_data_in_public_repo"] = True
        self.assertEqual(self.run_validator(bad).returncode, 1)

    def test_rejects_duplicate_role_ids(self):
        bad = copy.deepcopy(self.data)
        bad["roles"][1]["id"] = bad["roles"][0]["id"]
        self.assertEqual(self.run_validator(bad).returncode, 1)

if __name__ == "__main__":
    unittest.main()
