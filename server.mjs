import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const distDir = path.resolve(__dirname, 'dist');
const port = Number(process.env.PORT) || 8080;

app.disable('x-powered-by');

// Security and PWA-friendly headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Cloud Run health check endpoint
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Never cache service worker, register script, or manifest so updates arrive promptly
app.use((req, res, next) => {
  if (
    req.path === '/sw.js' ||
    req.path === '/registerSW.js' ||
    req.path === '/manifest.webmanifest' ||
    /^\/workbox-.*\.js$/.test(req.path)
  ) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Serve static assets from dist/
app.use(
  express.static(distDir, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`) && !filePath.endsWith('.jpg')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/\.(png|svg|ico|jpg|jpeg|webp)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    },
  })
);

// SPA fallback to index.html with no-cache
app.get('*', (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    res.status(500).send('Build output not found. Run npm run build first.');
    return;
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(indexPath);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
