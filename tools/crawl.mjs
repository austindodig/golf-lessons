// Loads every page, scrolls through it to mount all lazy modules, and reports console errors.
// Saves a screenshot centred on each module. Usage: node tools/crawl.mjs [paths...]
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Use the sandbox Chromium when present, otherwise the locally installed Google Chrome.
const launchTarget = () => (existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : { channel: 'chrome' });
const SHOTS = process.env.SHOT_DIR || `${tmpdir()}/fi-shots`;
import { mkdirSync } from 'node:fs';
const OUT = `${SHOTS}/crawl`;
mkdirSync(OUT, { recursive: true });
const server = await createServer({ server: { port: 5197, strictPort: false, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const base = `http://127.0.0.1:${server.config.server.port}`;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/lessons/setup/', '/lessons/swing/', '/lessons/driver/', '/lessons/irons/', '/lessons/wedges/', '/lessons/chipping/', '/lessons/bunker/', '/lessons/putting/', '/lessons/ball-flight/'];
const browser = await chromium.launch({ ...launchTarget(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'] });
const width = Number(process.env.SHOT_W || 1440), height = Number(process.env.SHOT_H || 900);
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|404|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  await page.goto(base + p + '?q=high', { waitUntil: 'load' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(3000);
  const mods = await page.evaluate(() => [...document.querySelectorAll('[data-module], [data-flyover]')].map((el) => ({ type: el.dataset.module || 'flyover', top: el.getBoundingClientRect().top + window.scrollY, height: el.offsetHeight, failed: el.classList.contains('module--failed'), hasCanvas: !!el.querySelector('canvas') })));
  const name = p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_');
  for (const [i, m] of mods.entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, m.top - 90));
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${OUT}/${name}_${i}_${m.type}.png` });
  }
  console.log(`${p}: ${mods.map((m) => `${m.type}${m.hasCanvas ? '' : '(no canvas)'}${m.failed ? '(FAILED)' : ''}`).join(', ')}${errors.length ? '\n   ERRORS: ' + [...new Set(errors)].slice(0, 6).join(' | ') : ''}`);
  await page.close();
}
await browser.close(); await server.close();
