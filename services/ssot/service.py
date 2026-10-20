"""Private MP-33 observation ledger. Observations never approve Jira tickets."""
import hmac
import sqlite3
from datetime import datetime, timezone, timedelta
from pathlib import Path


def authorized(supplied, expected):
    return bool(expected and len(expected) >= 32 and hmac.compare_digest(supplied, expected))


class Store:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(self.path) as db:
            db.execute('CREATE TABLE IF NOT EXISTS observations (id INTEGER PRIMARY KEY, component TEXT NOT NULL, passed INTEGER NOT NULL, evidence TEXT NOT NULL, observed_at TEXT NOT NULL)')

    def record(self, component, passed, evidence):
        if not evidence.strip():
            raise ValueError('Evidence required')
        with sqlite3.connect(self.path) as db:
            db.execute('INSERT INTO observations(component,passed,evidence,observed_at) VALUES(?,?,?,?)', (component, int(passed), evidence, datetime.now(timezone.utc).isoformat()))

    def telemetry(self):
        with sqlite3.connect(self.path) as db:
            db.row_factory = sqlite3.Row
            rows = [dict(row) for row in db.execute('SELECT * FROM observations WHERE id IN (SELECT MAX(id) FROM observations GROUP BY component) ORDER BY component')]
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=5)
        stale = any(datetime.fromisoformat(row['observed_at']) < cutoff for row in rows)
        status = 'unverified' if not rows else 'stale' if stale else 'blocked' if any(not row['passed'] for row in rows) else 'verification_pending'
        return {'system_id': 'QSLC-SSOT-01', 'ticket': 'MP-33', 'parent_ticket': 'MP-20', 'status': status, 'governance_gate': 'Verification Pending', 'observations': rows, 'generated_at': datetime.now(timezone.utc).isoformat()}
