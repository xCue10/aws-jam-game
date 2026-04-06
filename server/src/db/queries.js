import pg from 'pg';
const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initDb() {
  const { readFile } = await import('fs/promises');
  const { fileURLToPath } = await import('url');
  const { dirname, join } = await import('path');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const sql = await readFile(join(__dirname, 'schema.sql'), 'utf8');
  await getPool().query(sql);
}

export async function saveScore({ playerName, scores, totalScore }) {
  const result = await getPool().query(
    `INSERT INTO scores (player_name, scores, total_score)
     VALUES ($1, $2, $3)
     RETURNING id, player_name, total_score, completed_at`,
    [playerName, JSON.stringify(scores), totalScore]
  );
  return result.rows[0];
}

export async function getLeaderboard(limit = 20) {
  // DISTINCT ON deduplicates by player_name, keeping their best score row
  const result = await getPool().query(
    `SELECT DISTINCT ON (player_name) id, player_name, scores, total_score, completed_at
     FROM scores
     ORDER BY player_name, total_score DESC, completed_at DESC
     LIMIT $1`,
    [limit]
  );
  // Re-sort by total_score DESC after deduplication
  const sorted = result.rows.sort((a, b) => b.total_score - a.total_score || a.completed_at - b.completed_at);
  return sorted;
}

export async function getPlayerRank(totalScore) {
  const result = await getPool().query(
    `SELECT COUNT(*) + 1 AS rank FROM scores WHERE total_score > $1`,
    [totalScore]
  );
  return parseInt(result.rows[0].rank, 10);
}
