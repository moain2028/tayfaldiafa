// Mobile first-screen probe (390x844): one screenshot + structural metrics per URL.
// Usage: node probe.mjs <outDir> <label> <url> [<label> <url> ...]
// Weights are transferSize sums at load+2.5s without scrolling; cross-origin resources that do not
// send Timing-Allow-Origin report 0, so totals for third-party-heavy sites are lower bounds.
import { chromium, devices } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
const [outDir, ...args] = process.argv.slice(2); const out = []; mkdirSync(`${outDir}/shots`, { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
for (let i = 0; i < args.length; i += 2) {
  const [label, url] = [args[i], args[i + 1]]; const r = { label, url };
  const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, locale: 'ar-SA' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 80)));
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 }); r.status = resp?.status();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${outDir}/shots/${label}.png` });
    Object.assign(r, await page.evaluate(() => {
      const vh = innerHeight, q = s => [...document.querySelectorAll(s)];
      const vis = el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.top < vh && b.bottom > 0; };
      const res = performance.getEntriesByType('resource'); const sum = f => Math.round(res.filter(f).reduce((a, e) => a + (e.transferSize || 0), 0) / 1024);
      const h1 = document.querySelector('h1'); const cs = el => el ? getComputedStyle(el) : null;
      return {
        screens: +(document.documentElement.scrollHeight / vh).toFixed(1), dom: q('*').length,
        h1: h1 ? h1.innerText.replace(/\s+/g, ' ').slice(0, 70) : null, h1Font: cs(h1)?.fontFamily.split(',')[0].replace(/"/g, '').slice(0, 28), h1Px: h1 ? Math.round(parseFloat(cs(h1).fontSize)) : null,
        bodyFont: cs(document.body).fontFamily.split(',')[0].replace(/"/g, '').slice(0, 28), bodyBg: cs(document.body).backgroundColor,
        h2: q('h2').map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 34)).filter(Boolean).slice(0, 22),
        wa: q('a[href*="wa.me"],a[href*="api.whatsapp"]').length, tel: q('a[href^="tel:"]').length, forms: q('form').length, imgs: q('img').length,
        foldCtas: q('a,button').filter(vis).map(e => (e.innerText || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 22)).filter(Boolean).slice(0, 10),
        foldWords: (q('h1,h2,p,li,span').filter(vis).map(e => e.innerText).join(' ').match(/\S+/g) || []).length,
        overflowX: document.documentElement.scrollWidth - innerWidth,
        kbJs: sum(e => /\.m?js(\?|$)/.test(e.name)), kbImg: sum(e => e.initiatorType === 'img' || /\.(webp|avif|jpe?g|png)(\?|$)/.test(e.name)), kbFont: sum(e => /\.woff2?(\?|$)/.test(e.name)), kbAll: sum(() => true), reqs: res.length,
        ld: q('script[type="application/ld+json"]').flatMap(s => { try { const j = JSON.parse(s.textContent); const g = j['@graph'] || (Array.isArray(j) ? j : [j]); return g.map(x => [].concat(x['@type']).join('+')); } catch { return ['PARSE_ERROR']; } }),
        robots: document.querySelector('meta[name=robots]')?.content || null, lang: document.documentElement.lang, dir: document.documentElement.dir,
      };
    }));
    r.jsErrors = errs.length;
  } catch (e) { r.error = String(e).slice(0, 120); }
  await ctx.close(); out.push(r);
}
await browser.close(); writeFileSync(`${outDir}/probe-${args[0]}.json`, JSON.stringify(out, null, 1)); console.log('probe done', out.map(o => o.label + ':' + (o.error ? 'ERR' : o.status)).join(' '));
