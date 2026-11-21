// Main-thread cost of loading one page under CPU throttling, without Lighthouse's run-to-run noise.
// Usage: node cpu.mjs <url> [runs=5] [variant]
//   variant: base | reduce (prefers-reduced-motion) | nofont (block .woff2) | noimg (block images) | nojs
//   CPU_CSS='<css>' appends CSS to the first <style> of the page (to isolate the cost of one rule).
// Prints the median of each metric in ms: layout, style recalculation, script, all tasks, and the sum of
// long-task time above 50 ms (the same idea as Total Blocking Time, measured from navigation start to load + 3 s).
// Chromium only, 390x844, 4x CPU slowdown. A comparison tool: use it to find WHAT costs, not as an absolute score.
import { chromium } from 'playwright';
const [url, runs = '5', variant = 'base'] = process.argv.slice(2);
if (!url) { console.error('usage: node cpu.mjs <url> [runs] [base|reduce|nofont|noimg|nojs]'); process.exit(2); }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const rows = [];
for (let i = 0; i < +runs; i++) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ar-SA',
    reducedMotion: variant === 'reduce' ? 'reduce' : 'no-preference', javaScriptEnabled: variant !== 'nojs' });
  const page = await ctx.newPage();
  if (variant === 'nofont') await page.route('**/*.woff2', (r) => r.abort());
  // CPU_CSS: extra CSS appended to the page's first <style>, to test one change without rebuilding the site.
  if (process.env.CPU_CSS) await page.route(url, async (r) => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()).replace('</style>', process.env.CPU_CSS + '</style>') }); });
  if (variant === 'noimg') await page.route(/\.(avif|webp|jpg|png)$/, (r) => r.abort());
  await page.addInitScript(() => { window.__lt = []; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(e.duration); }).observe({ type: 'longtask', buffered: true }); } catch {} });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable'); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(3000);
  const m = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
  const lt = variant === 'nojs' ? [] : await page.evaluate(() => window.__lt || []);
  rows.push({ layout: m.LayoutDuration * 1000, style: m.RecalcStyleDuration * 1000, script: m.ScriptDuration * 1000, task: m.TaskDuration * 1000,
    blocking: lt.reduce((s, d) => s + Math.max(0, d - 50), 0), longest: Math.max(0, ...lt), layouts: m.LayoutCount, recalcs: m.RecalcStyleCount, nodes: m.Nodes });
  await ctx.close();
}
await browser.close();
const out = { url, variant, runs: +runs };
for (const k of Object.keys(rows[0])) out[k] = Math.round(med(rows.map((r) => r[k])));
console.log(JSON.stringify(out));
