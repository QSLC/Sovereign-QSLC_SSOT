CREATE TABLE IF NOT EXISTS calculator_events (id TEXT PRIMARY KEY, subject TEXT NOT NULL, kind TEXT NOT NULL, created INTEGER NOT NULL, priority INTEGER NOT NULL DEFAULT 0, payload TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS calculator_events_subject ON calculator_events(subject,kind,created DESC);
CREATE TABLE IF NOT EXISTS calculator_orders (session TEXT PRIMARY KEY, customer TEXT NOT NULL, subscription TEXT NOT NULL, tier TEXT NOT NULL, paid INTEGER NOT NULL, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS calculator_access (session TEXT PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS calculator_runs (id TEXT PRIMARY KEY, customer TEXT NOT NULL, created TEXT NOT NULL, source TEXT NOT NULL, inputs TEXT NOT NULL, results TEXT NOT NULL, formula_version TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS calculator_runs_customer ON calculator_runs(customer,created DESC);
