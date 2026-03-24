CREATE TABLE IF NOT EXISTS ratings (
  id TEXT PRIMARY KEY,
  instance_id TEXT,
  move_id TEXT NOT NULL,
  seed TEXT,
  resolved_variables TEXT,
  useful INTEGER NOT NULL,
  note TEXT,
  original_request TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ratings_move_id ON ratings(move_id);
CREATE INDEX IF NOT EXISTS idx_ratings_useful ON ratings(useful);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at);
