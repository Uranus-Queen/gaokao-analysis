import { Hono } from 'hono';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const root = process.cwd();
const app = new Hono();

// MIME types for static files
const MIME = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

// Serve static files from /public/ and /data/
app.get('/public/:file', (c) => {
  const file = c.req.param('file');
  const filePath = join(root, 'public', file);
  if (!existsSync(filePath)) return c.notFound();
  const ext = extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  const content = readFileSync(filePath);
  c.header('Content-Type', mime);
  c.header('Cache-Control', 'public, max-age=86400');
  return c.body(content);
});

app.get('/data/:file', (c) => {
  const file = c.req.param('file');
  const filePath = join(root, 'data', file);
  if (!existsSync(filePath)) return c.notFound();
  const data = readFileSync(filePath, 'utf8');
  c.header('Content-Type', 'application/json');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.body(data);
});

// API: get available years
app.get('/api/years', (c) => {
  const years = [];
  for (let y = 2014; y <= 2025; y++) {
    const path = join(root, 'data', `${y}.json`);
    if (existsSync(path)) years.push(y);
  }
  return c.json(years);
});

// API: get data for a specific year
app.get('/api/data/:year', (c) => {
  const year = c.req.param('year');
  const path = join(root, 'data', `${year}.json`);
  if (!existsSync(path)) return c.json({ error: 'Year not found' }, 404);
  const data = readFileSync(path, 'utf8');
  c.header('Content-Type', 'application/json');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.body(data);
});

// Main page
app.get('/', (c) => {
  const html = readFileSync(join(root, 'src', 'index.html'), 'utf8');
  return c.html(html);
});

export default app;
