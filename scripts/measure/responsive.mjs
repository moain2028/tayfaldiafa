// Responsive check: opens each URL at six viewport widths and reports layout problems per width.
// Usage: node responsive.mjs <outDir> <label> <url> [<label> <url> ...]
// Engine is Chromium only. It emulates touch and screen size; it is NOT Safari/WebKit and not a real phone.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
// RESP_WIDTHS="344x882,820x1180" overrides the six default sizes (foldables, tablets, large desktops).
const WIDTHS = process.env.RESP_WIDTHS ? process.env.RESP_WIDTHS.split(',').map((s) => s.split('x').map(Number)) : [[320, 568], [360, 800], [390, 844], [414, 896], [768, 1024], [1280, 800]];
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const [outDir, ...args] = process.argv.slice(2); mkdirSync(`${outDir}/shots`, { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] }); const out = [];
for (let i = 0; i < args.length; i += 2) {
  const [label, url] = [args[i], args[i + 1]];
  for (const [width, height] of WIDTHS) {
    const mobile = width < 768; const r = { label, width, height };
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: mobile ? 3 : 1, isMobile: mobile, hasTouch: mobile, locale: 'ar-SA', ...(mobile ? { userAgent: UA } : {}) });
    const page = await ctx.newPage();
    try {
      const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 }); r.status = resp?.status();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${outDir}/shots/${label}-${width}.png` });
      Object.assign(r, await page.evaluate(() => {
        const vh = innerHeight, q = s => [...document.querySelectorAll(s)], cs = el => getComputedStyle(el);
        const box = el => el.getBoundingClientRect(), shown = el => { const b = box(el), s = cs(el); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0' && (el.checkVisibility ? el.checkVisibility() : true); }; // checkVisibility: content of a closed <details> still has a box in Chromium
        // WCAG 2.5.8 exempts links inside a sentence, so inline links that share a line with other text are skipped.
        const inline = el => el.tagName === 'A' && cs(el).display === 'inline' && (el.parentElement?.innerText || '').trim().length > (el.innerText || '').trim().length + 8;
        const taps = q('a[href],button,[role=button],input:not([type=hidden]),select,textarea,summary').filter(shown).filter(el => !inline(el));
        const side = el => Math.round(Math.min(box(el).width, box(el).height));
        const texts = q('body *').filter(el => shown(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
        const sizes = texts.map(el => parseFloat(cs(el).fontSize));
        const h1 = document.querySelector('h1'), lh = h1 ? parseFloat(cs(h1).lineHeight) || parseFloat(cs(h1).fontSize) * 1.3 : 0;
        const act = q('a[href^="tel:"],a[href*="wa.me"],a[href*="whatsapp"],a[href^="#"],button').filter(shown);
        const fixed = q('body *').filter(el => shown(el) && cs(el).position === 'fixed' && box(el).width >= innerWidth * 0.6);
        return {
          overflowX: document.documentElement.scrollWidth - innerWidth,
          taps: taps.length, tapsUnder24: taps.filter(el => side(el) < 24).length, tapsUnder48: taps.filter(el => side(el) < 48).length,
          minFontPx: sizes.length ? Math.round(Math.min(...sizes)) : null, textUnder12: sizes.filter(s => s < 12).length,
          fieldsUnder16: q('input:not([type=hidden]),select,textarea').filter(shown).filter(el => parseFloat(cs(el).fontSize) < 16).length,
          h1Px: h1 ? Math.round(parseFloat(cs(h1).fontSize)) : null, h1Lines: h1 ? Math.round(box(h1).height / lh) : null,
          actionInFirstScreen: act.some(el => box(el).top >= 0 && box(el).bottom <= vh),
          fixedCoverPct: Math.round(fixed.reduce((a, el) => a + Math.min(box(el).height, vh), 0) / vh * 100),
          screens: +(document.documentElement.scrollHeight / vh).toFixed(1),
        };
      }));
    } catch (e) { r.error = String(e).slice(0, 120); }
    out.push(r); await ctx.close();
  }
}
await browser.close();
writeFileSync(`${outDir}/responsive-${args[0]}.json`, JSON.stringify(out, null, 1));
for (const r of out) console.log([r.label, r.width, `overflowX=${r.overflowX}`, `taps<24=${r.tapsUnder24}`, `taps<48=${r.tapsUnder48}/${r.taps}`, `minFont=${r.minFontPx}`, `text<12=${r.textUnder12}`, `fields<16=${r.fieldsUnder16}`, `h1=${r.h1Px}px×${r.h1Lines}`, `action=${r.actionInFirstScreen}`, `fixed=${r.fixedCoverPct}%`, r.error || ''].join(' | '));
