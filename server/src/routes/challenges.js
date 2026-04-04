import { Router } from 'express';

const router = Router();

// Challenge metadata only — full config lives client-side in challenges.js
// This endpoint exists for future server-side validation / admin use
router.get('/', (_req, res) => {
  res.json({
    count: 6,
    domains: ['iam', 'endpoint', 'webapp', 'data', 'incident', 'backup'],
  });
});

export default router;
