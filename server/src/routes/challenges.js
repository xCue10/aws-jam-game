import { Router } from 'express';

const router = Router();

// Challenge metadata only — full config lives client-side in challenges.js
// This endpoint exists for future server-side validation / admin use
router.get('/', (_req, res) => {
  res.json({
    count: 10,
    domains: ['iam', 'endpoint', 'webapp', 'data', 'incident', 'backup', 'scp', 'secrets', 'inspector', 'ssm'],
  });
});

export default router;
