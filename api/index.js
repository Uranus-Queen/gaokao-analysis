import { Hono } from 'hono';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// In Vercel Serverless, cwd is /var/task which is the project root
const root = process.cwd();

const app = new Hono();

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
