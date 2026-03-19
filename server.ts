import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get('/api/purchases', async (req, res) => {
    try {
      const data = await fs.readFile('/root/mtcoins/data/coins_purchases.json', 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to read purchases', details: String(err) });
    }
  });

  app.get('/api/store', async (req, res) => {
    try {
      const data = await fs.readFile('/root/mtcoins/data/coinsstore.json', 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to read store items', details: String(err) });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      // Basic sanitization to prevent directory traversal
      const safeId = path.basename(id);
      const data = await fs.readFile(`/root/mtcoins/data/users/${safeId}.json`, 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(404).json({ error: 'User not found', details: String(err) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
