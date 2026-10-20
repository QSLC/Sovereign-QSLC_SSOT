import tempfile
import unittest
from pathlib import Path
from service import Store, authorized

class GatewayTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = Store(Path(self.tmp.name) / 'test.db')
    def tearDown(self):
        self.tmp.cleanup()
    def test_rejects_missing_or_wrong_token(self):
        self.assertFalse(authorized('', ''))
        self.assertFalse(authorized('bad', 'a' * 32))
        self.assertTrue(authorized('a' * 32, 'a' * 32))
    def test_missing_evidence_cannot_approve(self):
        with self.assertRaises(ValueError):
            self.store.record('api', True, '')
    def test_unknown_is_not_healthy(self):
        self.assertEqual(self.store.telemetry()['status'], 'unverified')
    def test_persistence_and_failed_gate(self):
        self.store.record('api', False, 'controlled probe failed')
        other = Store(self.store.path)
        self.assertEqual(other.telemetry()['status'], 'blocked')
        self.assertEqual(other.telemetry()['observations'][0]['evidence'], 'controlled probe failed')
    def test_one_probe_does_not_complete_matrix(self):
        self.store.record('api', True, 'controlled probe succeeded')
        self.assertEqual(self.store.telemetry()['status'], 'verification_pending')

if __name__ == '__main__':
    unittest.main()
