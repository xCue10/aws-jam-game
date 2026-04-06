import { Router } from 'express';
import { saveScore, getLeaderboard, getPlayerRank } from '../db/queries.js';

const router = Router();

router.post('/', async (req, res) => {
  const { playerName, scores, totalScore } = req.body;

  if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
    return res.status(400).json({ error: 'playerName is required' });
  }
  if (!scores || typeof scores !== 'object') {
    return res.status(400).json({ error: 'scores object is required' });
  }
  if (typeof totalScore !== 'number') {
    return res.status(400).json({ error: 'totalScore must be a number' });
  }

  const saved = await saveScore({
    playerName: playerName.trim().slice(0, 100),
    scores,
    totalScore: Math.max(0, Math.min(totalScore, 1200)),
  });

  const rank = await getPlayerRank(saved.total_score);
  res.json({ ...saved, rank });
});

router.get('/leaderboard', async (_req, res) => {
  const rows = await getLeaderboard(20);
  res.json(rows);
});

export default router;
