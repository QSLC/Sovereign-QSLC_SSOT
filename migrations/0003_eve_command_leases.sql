ALTER TABLE command_queue ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE command_queue ADD COLUMN lease_token TEXT;
ALTER TABLE command_queue ADD COLUMN lease_until TEXT;
ALTER TABLE command_queue ADD COLUMN result_json TEXT;
CREATE INDEX IF NOT EXISTS eve_command_claim_idx ON command_queue(status, lease_until, id);
