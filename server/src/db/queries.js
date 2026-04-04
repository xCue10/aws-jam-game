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
  const result = await getPool().query(
    `SELECT id, player_name, total_score, completed_at
     FROM scores
     ORDER BY total_score DESC, completed_at ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getPlayerRank(totalScore) {
  const result = await getPool().query(
    `SELECT COUNT(*) + 1 AS rank FROM scores WHERE total_score > $1`,
    [totalScore]
  );
  return parseInt(result.rows[0].rank, 10);
}
