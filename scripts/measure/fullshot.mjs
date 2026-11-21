// Full-page screenshot of one URL at a phone width. For our own pages (wireframe, font specimens), not for third-party sites.
// Usage: node fullshot.mjs <out.png> <url> [width=390] [columns=1] [hideFixed=0]
// columns>1 cuts the long page into side-by-side strips so the whole page fits one readable image.
// hideFixed=1 hides position:fixed elements: in a long capture a fixed bar is drawn once, on top of unrelated content.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const [out, url, w = '390', cols = '1', hideFixed = '0'] = process.argv.slice(2);
if (!out || !url) { console.error('usage: node fullshot.mjs <out.png> <url> [width] [columns]'); process.exit(2); }
const width = +w, n = +cols;
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
// reducedMotion: scroll-driven animations would otherwise leave off-screen sections half transparent in a full-page capture.
const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'ar-SA', reducedMotion: 'reduce' });
const page = await ctx.newPage();
const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
if (hideFixed === '1') await page.evaluate(() => { for (const el of document.querySelectorAll('body *')) if (getComputedStyle(el).position === 'fixed') el.style.display = 'none'; });
const height = await page.evaluate(() => document.documentElement.scrollHeight);
if (n <= 1) { await page.screenshot({ path: out, fullPage: true }); }
else {
  const strip = Math.ceil(height / n), gap = 20, shots = [];
  for (let i = 0; i < n; i++) shots.push((await page.screenshot({ fullPage: true, clip: { x: 0, y: i * strip, width, height: Math.min(strip, height - i * strip) } })).toString('base64'));
  const sheet = await ctx.newPage(); await sheet.setViewportSize({ width: n * width + (n - 1) * gap, height: strip });
  await sheet.setContent(`<body style="margin:0;background:#888;display:flex;gap:${gap}px;align-items:flex-start">${shots.map(s => `<img src="data:image/png;base64,${s}" width="${width}">`).join('')}</body>`);
  writeFileSync(out, await sheet.screenshot({ fullPage: true }));
}
console.log(JSON.stringify({ status: resp?.status(), width, height, columns: n, hideFixed: hideFixed === '1', out }));
await browser.close();
