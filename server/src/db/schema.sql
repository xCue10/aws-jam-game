CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  scores JSONB NOT NULL DEFAULT '{}',
  total_score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scores_total ON scores(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_completed_at ON scores(completed_at DESC);
