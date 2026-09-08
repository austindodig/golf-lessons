// Usage: node tools/screenshot.mjs [path ...]  (paths like / or /lessons/driver/)
// Starts a Vite dev server, renders each page in headless Chromium with WebGL,
// logs console errors, and saves PNGs to the scratchpad shots directory.
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Use the sandbox Chromium when present, otherwise the locally installed Google Chrome.
const launchTarget = () => (existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : { channel: 'chrome' });
const SHOTS = process.env.SHOT_DIR || `${tmpdir()}/fi-shots`;
import { mkdirSync } from 'node:fs';

const OUT = SHOTS;
mkdirSync(OUT, { recursive: true });
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const width = Number(process.env.SHOT_W || 1440);
const height = Number(process.env.SHOT_H || 900);
const scrollTo = process.env.SHOT_SCROLL ? Number(process.env.SHOT_SCROLL) : null;
const wait = Number(process.env.SHOT_WAIT || 2500);
const fullPage = process.env.SHOT_FULL === '1';

const server = await createServer({ server: { port: 5199, strictPort: false, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const base = `http://127.0.0.1:${server.config.server.port}`;

const browser = await chromium.launch({
  ...launchTarget(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--no-sandbox'],
});
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('response', (r) => { if (r.status() >= 400) errors.push(`[http ${r.status()}] ${r.url()}`); });
page.on('requestfailed', (r) => { if (!/cloudfront|googleapis|gstatic/.test(r.url())) errors.push(`[failed] ${r.url()} ${r.failure()?.errorText}`); });

for (const p of paths) {
  errors.length = 0;
  const url = base + p;
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(wait);
  if (scrollTo !== null) { await page.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, y); }, scrollTo); await page.waitForTimeout(Number(process.env.SHOT_SCROLL_WAIT || 1800)); }
  const name = (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_')) + (scrollTo !== null ? `_s${scrollTo}` : '');
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, fullPage });
  const info = await page.evaluate(() => ({ title: document.title, h: document.documentElement.scrollHeight, webgl: !!document.querySelector('canvas') }));
  console.log(`${p} -> ${file}  (${Date.now() - t0}ms) title="${info.title}" height=${info.h} canvas=${info.webgl}`);
  if (errors.length) console.log('  console:', errors.slice(0, 15).join('\n  '));
}
await browser.close();
await server.close();
