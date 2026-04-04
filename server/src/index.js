import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import scoresRouter from './routes/scores.js';
import challengesRouter from './routes/challenges.js';
import { initDb } from './db/queries.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cors({
  origin: isProd ? false : 'http://localhost:5173',
}));

// API routes
app.use('/api/scores', scoresRouter);
app.use('/api/challenges', challengesRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Serve React build in production
if (isProd) {
  const clientDist = join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
}

async function start() {
  if (process.env.DATABASE_URL) {
    try {
      await initDb();
      console.log('Database initialised');
    } catch (err) {
      console.error('DB init failed:', err.message);
    }
  } else {
    console.warn('DATABASE_URL not set — running without database');
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
