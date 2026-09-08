import { preview } from 'vite';
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
// Use the sandbox Chromium when present, otherwise the locally installed Google Chrome.
const launchTarget = () => (existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : { channel: 'chrome' });
const SHOTS = process.env.SHOT_DIR || `${tmpdir()}/fi-shots`;
const server = await preview({ base: process.env.VITE_BASE || '/', preview: { port: 4179, strictPort: false, host: '127.0.0.1' }, logLevel: 'error' });
const base = `http://127.0.0.1:${server.config.preview.port}`;
const browser = await chromium.launch({ ...launchTarget(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' && !/TUNNEL|cloudfront/.test(m.text())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
page.on('response', (r) => { if (r.status() >= 400 && !/cloudfront/.test(r.url())) errors.push(`[${r.status()}] ${r.url()}`); });
for (const p of process.argv.slice(2)) {
  errors.length = 0;
  await page.goto(base + p, { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  const info = await page.evaluate(() => ({ title: document.title, canvas: !!document.querySelector('canvas'), links: [...document.querySelectorAll('a[href^="/"]')].slice(0, 3).map((a) => a.getAttribute('href')) }));
  console.log(p, JSON.stringify(info), errors.length ? 'ERRORS: ' + errors.join(' | ') : 'ok');
  await page.screenshot({ path: `${SHOTS}/preview_${p.replace(/[^a-z]/g, '_')}.png` });
}
await browser.close(); server.httpServer.close();
