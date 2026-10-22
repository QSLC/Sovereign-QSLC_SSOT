ALTER TABLE command_queue ADD COLUMN job_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_command_queue_job_id
  ON command_queue(job_id)
  WHERE job_id IS NOT NULL;
