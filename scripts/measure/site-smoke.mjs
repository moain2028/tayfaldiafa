// Browser smoke test for the built site (site/dist served by static-server.mjs). Chromium only, 390x844.
// Usage: node site-smoke.mjs <baseUrl> [shotsDir]      exit 1 if any check fails.
// Covers what the static gate (site/scripts/check.mjs) cannot see: the quote form, the menu, the page with JavaScript off,
// the page with "reduce motion" on, scroll-driven reveals leaving content faded, the sticky bar, and the 404 page.
import { chromium } from 'playwright';
const [base, shots] = process.argv.slice(2);
if (!base) { console.error('usage: node site-smoke.mjs <baseUrl> [shotsDir]'); process.exit(2); }
const ok = [], fails = [];
const t = (name, cond, info = '') => (cond ? ok : fails).push(name + (!cond && info ? ` — ${info}` : ''));
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'ar-SA' };
const inView = (sel) => (page) => page.evaluate((sel) => { const b = document.querySelector(sel).getBoundingClientRect(); return b.height > 0 && b.top < innerHeight && b.bottom > 0; }, sel);
// Scroll to every section and report those whose heading is not fully painted (opacity < 1 or zero height).
// The waiting is done from Node, not with a timer inside the page: with JavaScript disabled a page timer never fires
// and the test hangs (seen 2026-11-21).
const sectionsPainted = async (page) => {
  const n = await page.evaluate(() => document.querySelectorAll('main section').length), bad = [];
  for (let i = 0; i < n; i++) {
    await page.evaluate((i) => { const s = document.querySelectorAll('main section')[i]; scrollTo({ top: s.getBoundingClientRect().top + scrollY - 40, behavior: 'instant' }); }, i);
    await page.waitForTimeout(300);
    const r = await page.evaluate((i) => {
      const s = document.querySelectorAll('main section')[i], h = s.querySelector('h2:not(.vh)') || s.querySelector('img'); if (!h) return null;
      let o = 1; for (let e = h; e && e !== document.body; e = e.parentElement) o *= +getComputedStyle(e).opacity;
      return o < 0.99 || h.getBoundingClientRect().height < 10 ? (s.id || s.className) + ' opacity ' + o.toFixed(2) : null;
    }, i);
    if (r) bad.push(r);
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  return bad;
};
setTimeout(() => { console.log('FAIL — watchdog: the test did not finish in 150 s'); process.exit(3); }, 150000).unref();

{ // 1) JavaScript on, motion on
  const ctx = await browser.newContext(mobile), page = await ctx.newPage(), errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text())); page.on('pageerror', (e) => errs.push(String(e)));
  let wa = null; await page.route(/^https:\/\/wa\.me\//, (r) => { wa = r.request().url(); r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }); });
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
  const faded = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && b.height && b.bottom > 0 && b.top < innerHeight && +getComputedStyle(el).opacity < 0.99; }).map((el) => el.className || el.tagName));
  t('first screen: nothing left faded after load', faded.length === 0, faded.slice(0, 4).join(', '));
  const sdSupported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
  if (sdSupported) {
    t('motion: hero buttons shown, bottom bar starts off-screen', (await inView('.hero .cta')(page)) && !(await inView('.bar')(page)));
    await page.evaluate(() => scrollTo({ top: 1400, behavior: 'instant' })); await page.waitForTimeout(500);
    t('motion: bottom bar is in view after the hero', await inView('.bar')(page));
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(300);
  }
  if (shots) await page.screenshot({ path: shots + '/smoke-home.png' });
  const bad = await sectionsPainted(page); t('motion: every section painted when scrolled to', bad.length === 0, bad.join('; '));
  await page.click('.menu summary'); await page.waitForTimeout(450);
  t('menu opens', await page.evaluate(() => document.querySelector('.menu').open && document.querySelector('.panel').getBoundingClientRect().height > 200));
  if (shots) await page.screenshot({ path: shots + '/smoke-menu.png' });
  await page.keyboard.press('Escape'); t('Escape closes the menu', await page.evaluate(() => !document.querySelector('.menu').open));
  const phone = await page.getAttribute('#q', 'data-wa');
  t('date field has a minimum (today in Riyadh)', /^\d{4}-\d{2}-\d{2}$/.test((await page.getAttribute('#q [name=d]', 'min')) || ''));
  await page.selectOption('#q [name=o]', { index: 1 }); await page.selectOption('#q [name=c]', { index: 1 });
  await page.fill('#q [name=d]', '2030-01-15'); await page.fill('#q [name=g]', '120');
  if (shots) { await page.locator('#q').scrollIntoViewIfNeeded(); }
  await page.evaluate(() => document.querySelector('#q').requestSubmit()); await page.waitForTimeout(900);
  if (phone) t('form opens wa.me with the configured number and the four fields', !!wa && wa.startsWith(`https://wa.me/${phone}?text=`) && /التاريخ: 2030-01-15\nعدد الضيوف: 120/.test(decodeURIComponent(wa.split('text=')[1])));
  else {
    const out = await page.textContent('#out');
    t('no phone: message is shown on the page', /المناسبة: .+\nالمدينة: .+\nالتاريخ: 2030-01-15\nعدد الضيوف: 120/.test(out) && /لم يُضف/.test(out), out.slice(0, 80));
    t('no phone: nothing is sent and the page does not navigate', wa === null && page.url() === base + '/');
    if (shots) await page.screenshot({ path: shots + '/smoke-form.png' });
  }
  t('no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await ctx.close();
}
{ // 2) JavaScript off: the page must be complete
  const ctx = await browser.newContext({ ...mobile, javaScriptEnabled: false }), page = await ctx.newPage();
  for (const p of ['/', '/qahwajiin-dammam/', '/talab/']) {
    await page.goto(base + p, { waitUntil: 'load' }); await page.waitForTimeout(600);
    // textContent, not innerText: innerText leaves out sections that content-visibility:auto has not rendered yet
    // (measured 2026-11-21: 143 words by innerText, 426 by textContent, same page, JavaScript on or off).
    const r = await page.evaluate(() => ({ words: document.querySelector('main').textContent.split(/\s+/).filter(Boolean).length, h2: document.querySelectorAll('main h2').length }));
    t(`no JS ${p}: text present`, r.words > 150 && r.h2 >= 3, JSON.stringify(r));
    const bad = await sectionsPainted(page); t(`no JS ${p}: every section painted`, bad.length === 0, bad.join('; '));
  }
  await page.goto(base + '/', { waitUntil: 'load' }); await page.click('.menu summary'); await page.waitForTimeout(300);
  t('no JS: menu still opens (native <details>)', await page.evaluate(() => document.querySelector('.panel').getBoundingClientRect().height > 200));
  await ctx.close();
}
{ // 3) "Reduce motion" on: no animation at all, and the base layout is usable
  const ctx = await browser.newContext({ ...mobile, reducedMotion: 'reduce' }), page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  t('reduced motion: zero animations', (await page.evaluate(() => document.getAnimations().length)) === 0);
  t('reduced motion: bottom bar visible from the start', await inView('.bar')(page));
  const bad = await sectionsPainted(page); t('reduced motion: every section painted', bad.length === 0, bad.join('; '));
  await ctx.close();
}
{ // 4) 404
  const ctx = await browser.newContext(mobile), page = await ctx.newPage();
  const res = await page.goto(base + '/la-tujad/', { waitUntil: 'load' });
  t('unknown path: status 404 with the site 404 page', res.status() === 404 && (await page.locator('h1').count()) === 1 && /noindex/.test(await page.content()));
  await ctx.close();
}
await browser.close();
for (const f of fails) console.log('FAIL ' + f);
console.log(`${fails.length ? 'FAIL' : 'PASS'} — ${ok.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
