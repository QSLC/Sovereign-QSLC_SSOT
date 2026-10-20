CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  request_sha256 TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_created_at
  ON idempotency_keys(created_at);
