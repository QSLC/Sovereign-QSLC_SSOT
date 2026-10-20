import os
import tempfile
import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from gateway import app

class HttpTests(unittest.TestCase):
    def test_auth_persistence_and_private_cache(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ, {'QSLC_ADMIN_TOKEN': 'x'*32, 'SSOT_DB': directory+'/ssot.db'}):
            with TestClient(app) as client:
                url = '/api/v1/telemetry/live'
                self.assertEqual(client.get(url).status_code, 401)
                self.assertEqual(client.get(url, headers={'Authorization': 'Bearer wrong'}).status_code, 401)
                headers = {'Authorization': 'Bearer '+'x'*32}
                response = client.get(url, headers=headers)
                self.assertEqual(response.json()['status'], 'unverified')
                self.assertEqual(response.headers['cache-control'], 'no-store')
                self.assertEqual(client.post('/api/v1/evidence', headers=headers, json={'component':'api', 'passed':True, 'evidence':'   '}).status_code, 422)
                self.assertEqual(client.post('/api/v1/evidence', headers=headers, json={'component':'api', 'passed':False, 'evidence':'probe timeout'}).status_code, 201)
                self.assertEqual(client.get(url, headers=headers).json()['status'], 'blocked')
    def test_missing_secret_stops_startup(self):
        with patch.dict(os.environ, {'QSLC_ADMIN_TOKEN': ''}):
            with self.assertRaises(RuntimeError):
                with TestClient(app):
                    pass
