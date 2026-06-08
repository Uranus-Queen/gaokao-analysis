import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = new Hono();

// Serve static files
app.use('/public/*', serveStatic({ root: './' }));
app.use('/data/*', serveStatic({ root: './' }));

// API: get available years
app.get('/api/years', (c) => {
  const years = [];
  for (let y = 2014; y <= 2025; y++) {
    const path = join(__dirname, '..', 'data', `${y}.json`);
    if (existsSync(path)) years.push(y);
  }
  return c.json(years);
});

// API: get data for a specific year
app.get('/api/data/:year', (c) => {
  const year = c.req.param('year');
  const path = join(__dirname, '..', 'data', `${year}.json`);
  if (!existsSync(path)) return c.json({ error: 'Year not found' }, 404);
  const data = readFileSync(path, 'utf8');
  c.header('Content-Type', 'application/json');
  c.header('Cache-Control', 'public, max-age=3600');
  return c.body(data);
});

// Main page
app.get('/', (c) => {
  const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
  return c.html(html);
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
