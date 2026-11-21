#!/usr/bin/env node
// طيف الضيافة — مولّد الموقع الثابت. بلا اعتماديات: Node 20+ فقط.
//   node site/build.mjs                 بناء تجريبي: noindex، وبلا رقم هاتف
//   node site/build.mjs --prod          بناء النشر: يرفض إن بقي حاجب (لا رقم، صور مؤقتة، نص مسودة)، ويستبعد الصفحات المعلّقة (hold)
//   SITE_URL=https://…  يغيّر عنوان الموقع في canonical وخريطة الموقع
//   TAYF_PHONE=9665XXXXXXXX  أو ملف site/.private.json {"phone":"9665XXXXXXXX"} (خارج git)
// المخرجات: site/dist/ وملف site/.build-meta.json (تقرؤه بوابة الفحص). الفحص بعد البناء: node site/scripts/check.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const PROD = process.argv.includes('--prod');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const json = (p) => JSON.parse(read(p));

const cfg = json('site.config.json');
const home = json('content/home.json');
const photos = json('photos/manifest.json');
const photoSpec = json('photos/photos.json');
const pages = Object.fromEntries(readdirSync(join(ROOT, 'content/pages')).filter((f) => f.endsWith('.json')).map((f) => {
  const p = json('content/pages/' + f); return [p.slug, p];
}));

for (const s of Object.keys(cfg.pages)) if (!pages[s]) throw new Error('no content file for ' + s);
for (const s of [...cfg.nav, ...cfg.footerServices, ...cfg.cities, ...Object.values(cfg.pages).flatMap((c) => c.related || []), ...Object.values(cfg.home).flatMap((v) => v.more || [])])
  if (!cfg.pages[s]) throw new Error('unknown slug in site.config.json: ' + s);
if (cfg.pages.talab.hold) throw new Error('talab cannot be held: every page links to it');

const BASE = (process.env.SITE_URL || cfg.baseUrl).replace(/\/$/, '');
let phone = process.env.TAYF_PHONE || '';
if (!phone && existsSync(join(ROOT, '.private.json'))) phone = json('.private.json').phone || '';
if (phone && !/^9665\d{8}$/.test(phone)) throw new Error('phone must look like 9665XXXXXXXX');

// ---------- بوابة النشر ----------
const held = Object.entries(cfg.pages).filter(([, c]) => c.hold).map(([s]) => s);
if (PROD) {
  const blockers = [];
  if (!phone) blockers.push('لا رقم هاتف (TAYF_PHONE أو site/.private.json)');
  if (photoSpec.placeholder) blockers.push('الصور مؤقتة (photos.json: placeholder=true)');
  const drafts = [home.draft !== false ? 'home' : '', ...Object.keys(cfg.pages).filter((s) => !cfg.pages[s].hold && pages[s].draft !== false)].filter(Boolean);
  if (drafts.length) blockers.push(`نصوص مسودة لم يعتمدها العميل (draft): ${drafts.join('، ')}`);
  if (blockers.length) { console.error('بناء النشر مرفوض:\n- ' + blockers.join('\n- ')); process.exit(1); }
}
const live = (slug) => cfg.pages[slug] && pages[slug] && !(PROD && cfg.pages[slug].hold);
const slugs = Object.keys(cfg.pages).filter(live);

// ---------- أدوات ----------
const esc = (s) => { if (s == null) throw new Error('missing content value (undefined/null reached the page)'); return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
const url = (slug) => (slug ? `/${slug}/` : '/');
const abs = (path) => BASE + path;
const label = (slug) => cfg.pages[slug].link || cfg.pages[slug].label;
const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const arNum = (n) => String(n).replace(/\d/g, (d) => AR[d]);

const I = {
  arrow: '<svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M20 6H1M6 1 1 6l5 5"/></svg>',
  wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 20.5l1.2-4.3A8.5 8.5 0 1 1 8 19.4z"/><path d="M9.2 8.4c0 3.4 3 6.4 6.4 6.4l1-1.6-2-1-1 .8c-1-.5-1.9-1.4-2.4-2.4l.8-1-1-2z"/></svg>',
  tel: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5h4l1.8 4.6-2.3 1.5a11.5 11.5 0 0 0 5.9 5.9l1.5-2.3 4.6 1.8v4a2 2 0 0 1-2.2 2A17 17 0 0 1 3 5.7a2 2 0 0 1 2-2.2z"/></svg>',
  mark: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="5" y="5" width="14" height="14"/><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>',
  menu: '<svg class="m" width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M0 1h22M6 7h16M0 13h22"/></svg><svg class="x" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 1l16 16M17 1 1 17"/></svg>',
};

// صورة: AVIF ثم WebP، بأبعاد مكتوبة. الأولى في الصفحة تُحمَّل بأولوية والباقي lazy.
function pic(key, sizes, { eager = false, alt } = {}) {
  const p = photos[key]; if (!p) throw new Error('unknown photo ' + key);
  const set = (ext) => p.widths.map((w) => `/img/${key}-${w}.${ext} ${w}w`).join(', ');
  const mid = p.widths.find((w) => w >= 800) || p.widths[p.widths.length - 1];
  const a = esc(alt ?? p.alt);
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${esc(sizes)}"><source type="image/webp" srcset="${set('webp')}" sizes="${esc(sizes)}">` +
    `<img src="/img/${key}-${mid}.webp" width="${p.w}" height="${p.h}" alt="${a}" style="object-position:${esc(p.focus)}" ` +
    (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"') + '></picture>';
}
const S = { // قيم sizes بحسب موضع الصورة
  hero: '(min-width:900px) 60vw, 100vw', rail: '(min-width:900px) 30vw, (min-width:600px) 46vw, 78vw', q: '(min-width:900px) 23vw, 46vw',
  wide: '(min-width:900px) 55vw, 100vw', half: '(min-width:900px) 42vw, 100vw', small: '(min-width:900px) 30vw, 50vw',
};

const waText = (extra) => 'السلام عليكم طيف الضيافة، أبغى عرض سعر' + (extra ? ' ' + extra : '') + '.';
const waHref = (extra) => `https://wa.me/${phone}?text=${encodeURIComponent(waText(extra))}`;
// بلا رقم هاتف (البناء التجريبي فقط؛ بناء النشر يرفض): الزرّان يبقيان في مكانهما ليُرى التصميم،
// ويفتحان نموذج الطلب الذي يحمل تنبيهًا ظاهرًا. لا يخرج رابط wa.me ولا tel بلا رقم.
const btnWa = (extra, cls = '', q = url('talab')) => `<a class="btn ${cls}" href="${phone ? waHref(extra) : q}"${phone ? ' rel="noopener"' : ''}>${I.wa}واتساب</a>`;
const btnTel = (cls = 'ghost', q = url('talab')) => `<a class="btn ${cls}" href="${phone ? `tel:+${phone}` : q}">${I.tel}اتصال</a>`;
const logo = () => `<a class="logo" href="/" aria-label="طيف الضيافة، الصفحة الرئيسية"><span class="medal">${I.mark}</span><span class="nm"><b>طيف الضيافة</b><i lang="en" dir="ltr" aria-hidden="true">${esc(home.hero.latin)}</i></span></a>`;
const more = (slug) => `<a class="more" href="${url(slug)}">${esc(label(slug))}${I.arrow}</a>`;
const mores = (list) => { const l = list.filter(live); return l.length ? `<p class="mores">${l.map(more).join('')}</p>` : ''; };
const head = (k, h2, lead, cls = '') => `<div class="head rv ${cls}"><div>${k ? `<p class="k">${esc(k)}</p>` : ''}<h2>${esc(h2)}</h2></div>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div>`;

// ---------- القوالب المشتركة ----------
function header(current) {
  const links = cfg.nav.filter(live).map((s) => `<a class="l" href="${url(s)}"${s === current ? ' aria-current="page"' : ''}>${esc(cfg.pages[s].label)}</a>`).join('');
  const cta = `<a class="btn" href="${url('talab')}">اطلب عرض سعر</a>`;
  return `<a class="skip" href="#main">انتقل إلى المحتوى</a><div class="prog" aria-hidden="true"></div>
<header class="top"><div class="wrap">
${logo()}
<nav class="nav-wide" aria-label="الصفحات الرئيسية">${links}${cta}</nav>
<details class="menu"><summary aria-label="القائمة">${I.menu}</summary><nav class="panel" aria-label="القائمة">${links.replace(/<\/a>/g, `${I.arrow}</a>`)}${cta}</nav></details>
</div></header>`;
}

function footer() {
  const li = (s) => `<li><a href="${url(s)}">${esc(cfg.pages[s].label)}</a></li>`;
  const site = ['mashrubat', 'munasabat', 'manatiq-alkhidma', 'aamalna', 'man-nahnu', 'talab', 'khususiya'].filter(live);
  return `<footer class="foot"><div class="wrap"><div class="cols">
<div>${logo()}<p>${esc(home.hero.lead)}</p></div>
<div><h2>الخدمات</h2><ul>${cfg.footerServices.filter(live).map(li).join('')}</ul></div>
<div><h2>المدن</h2><ul>${cfg.cities.filter(live).map(li).join('')}</ul></div>
<div><h2>الموقع</h2><ul>${site.map(li).join('')}</ul></div>
</div><p class="fine">طيف الضيافة · المنطقة الشرقية، المملكة العربية السعودية.${PROD ? '' : ` نسخة تجريبية للمراجعة: النصوص مسودة والصور مؤقتة${phone ? '' : '، ورقم الهاتف لم يُضف بعد، لذا يفتح زرّا واتساب والاتصال نموذج الطلب'}.`}</p></div></footer>`;
}

const bar = (extra, quoteHref) => `<div class="bar" role="group" aria-label="تواصل سريع">${btnWa(extra, '', quoteHref)}${btnTel('ghost', quoteHref)}</div>`;

function form() {
  const opt = (l) => l.map((o) => `<option>${esc(o)}</option>`).join('');
  return `<form class="form rv2" id="q" data-wa="${phone}"${phone ? '' : ' data-note="نسخة تجريبية: رقم واتساب لم يُضف بعد، فالرسالة تظهر هنا ولا تُرسل."'} action="${url('talab')}">
<label>نوع المناسبة<select name="o" required><option value="">اختر</option>${opt(cfg.form.occasions)}</select></label>
<label>المدينة<select name="c" required><option value="">اختر</option>${opt(cfg.form.cities)}</select></label>
<label>التاريخ<input name="d" type="date" required></label>
<label>عدد الضيوف<input name="g" type="number" inputmode="numeric" min="1" max="5000" autocomplete="off" required></label>
<button class="btn full" type="submit">${I.wa}أرسل الطلب على واتساب</button>
<output class="full" id="out" aria-live="polite"></output>
<p class="hint full">لا يُحفظ شيء في الموقع. يُفتح واتساب برسالة جاهزة تراجعها ثم ترسلها بنفسك.</p>
${phone ? '' : '<p class="hint full">نسخة تجريبية: رقم الهاتف لم يُضف بعد. زرّا واتساب والاتصال يفتحان هذا النموذج مؤقتًا، والرسالة تظهر هنا ولا تُرسل.</p>'}
<noscript><p class="hint full">لا يعمل النموذج إلا بتفعيل JavaScript في متصفحك.${phone ? ` يمكنك مراسلتنا مباشرة: <a href="${waHref()}">واتساب</a>.` : ''}</p></noscript>
</form>`;
}

const faq = (items) => `<div class="faq rv2">${items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
const cityLinks = () => `<nav class="cities rv2" aria-label="مدن الخدمة">${cfg.cities.filter(live).map((s) => `<a href="${url(s)}">${esc(cfg.pages[s].label)}${I.arrow}</a>`).join('')}</nav>`;

const APP_JS = read('src/app.js').replace(/^\s*\/\/.*$/gm, '').replace(/\n\s*/g, '\n').trim();
const CSS = read('src/styles.css').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').trim();

function doc({ path, title, desc, body: raw, cls = '', ogImg, ld = [], noindex = false, current }) {
  // صفحة بلا صورة واجهة: أول صورة فيها هي الأهم، فلا تُؤجَّل.
  const body = /fetchpriority="high"/.test(raw) ? raw : raw.replace('loading="lazy" decoding="async"', 'fetchpriority="high"');
  const og = abs(`/img/${ogImg}-${photos[ogImg].widths.at(-1)}.webp`);
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${!PROD || noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}${noindex ? '' : `<link rel="canonical" href="${abs(path)}">\n`}<meta name="theme-color" content="#120e0a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/amiri-700-subset.woff2" as="font" type="font/woff2" crossorigin>
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.name)}">
<meta property="og:locale" content="${esc(cfg.locale)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${og}">
<meta property="og:image:alt" content="${esc(photos[ogImg].alt)}">
<meta name="twitter:card" content="summary_large_image">
<style>${CSS}</style>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body class="${cls}">
${header(current)}
<main id="main">
${body}
</main>
${footer()}
${bar(current && cfg.pages[current]?.city ? `لمناسبة في ${cfg.pages[current].city}` : '', cls === 'home' ? '#talab' : current === 'talab' ? '#q' : url('talab'))}
<script>${APP_JS}</script>
</body>
</html>
`;
}

// ---------- البيانات المهيكلة: كيان واحد للنشاط، يُشار إليه من بقية الصفحات ----------
const BIZ = { '@id': abs('/#business') };
function ldHome() {
  const biz = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': BIZ['@id'], name: cfg.name, url: abs('/'),
    description: home.desc, image: abs(`/img/${cfg.home.hero}-${photos[cfg.home.hero].widths.at(-1)}.webp`),
    address: { '@type': 'PostalAddress', addressRegion: 'المنطقة الشرقية', addressCountry: 'SA' },
    areaServed: cfg.areaServed.map((c) => ({ '@type': 'City', name: c })),
  };
  if (phone) biz.telephone = '+' + phone;
  return [{ '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.name, url: abs('/'), inLanguage: 'ar' }, biz];
}
function ldPage(slug) {
  const c = cfg.pages[slug], p = pages[slug];
  const out = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: abs('/') },
      { '@type': 'ListItem', position: 2, name: c.label, item: abs(url(slug)) }],
  }];
  if (c.type === 'service' || c.type === 'city') out.push({
    '@context': 'https://schema.org', '@type': 'Service', name: p.h1, serviceType: cfg.serviceType, description: p.desc, url: abs(url(slug)), provider: BIZ,
    areaServed: c.city ? { '@type': 'City', name: c.city } : { '@type': 'AdministrativeArea', name: 'المنطقة الشرقية' },
  });
  return out;
}

// ---------- الصفحة الرئيسية ----------
function renderHome() {
  const H = cfg.home, K = H.kickers, h = home;
  const card = (it, key, ratio, sizes) => `<div class="card"><div class="ph ${ratio}">${pic(key, sizes)}</div><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></div>`;
  const numbered = (items, cls) => `<ol class="${cls} rv2">${items.map((it, i) => `<li><span class="num" aria-hidden="true">${arNum(i + 1)}</span><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></li>`).join('')}</ol>`;
  const body = `<div class="hero" id="top">
<div class="hero__img">${pic(H.hero, S.hero, { eager: true })}</div>
<div class="hero__txt">
<div class="glass">
<p class="eyebrow" lang="en" dir="ltr" aria-hidden="true">${esc(h.hero.eyebrow)}</p>
<h1>${esc(h.hero.h1)}</h1>
<p class="latin" lang="en" dir="ltr" aria-hidden="true">${esc(h.hero.latin)}</p>
<p class="tag">${esc(h.hero.kicker)}</p>
<p class="lead">${esc(h.hero.lead)}</p>
<ul class="chips">${h.hero.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
</div>
<div class="cta">${btnWa('', '', '#talab')}${btnTel('ghost', '#talab')}</div>
<ul class="trio">${h.hero.trio.map((t) => `<li><b>${esc(t.t)}</b><span>${esc(t.d)}</span></li>`).join('')}</ul>
</div>
</div>

<section class="sec" id="khadamat"><div class="wrap">
${head(K.services, h.services.h2, h.services.lead, 'split')}
<div class="rail rv2" tabindex="0" role="region" aria-label="الخدمات">${h.services.items.map((it, i) => card(it, H.services.photos[i], 'r45', S.rail)).join('')}</div>
${mores(H.services.more)}
</div></section>

<section class="sec dark" id="mashrubat"><div class="wrap">
${head(K.drinks, h.drinks.h2, h.drinks.lead, 'split')}
<div class="grid2 rv2">${h.drinks.items.map((it, i) => card(it, H.drinks.photos[i], 'r45', S.q)).join('')}</div>
${mores(H.drinks.more)}
</div></section>

<section class="sec sand" id="munasabat"><div class="wrap">
${head(K.occasions, h.occasions.h2, h.occasions.lead, 'split')}
<div class="rail rv2" tabindex="0" role="region" aria-label="المناسبات">${h.occasions.items.map((it, i) => card(it, H.occasions.photos[i], 'r43', S.rail)).join('')}</div>
${mores(H.occasions.more)}
</div></section>

<section class="sec" id="aamal"><div class="wrap">
${head(K.works, h.works.h2, h.works.lead, 'split')}
<div class="works rv2">${H.works.photos.map((k, i) => `<div class="ph ${i ? 'r11' : 'r43 zoom'}">${pic(k, i ? S.small : S.wide)}</div>`).join('')}</div>
${mores(H.works.more)}
</div></section>

<section class="sec dark" id="limadha"><div class="wrap">
${head(K.why, h.why.h2, h.why.lead)}
${numbered(h.why.items, 'facts')}
${mores(H.why.more)}
</div></section>

<section class="sec" id="kayfa"><div class="wrap">
${head(K.how, h.how.h2, '')}
${numbered(h.how.items, 'steps')}
</div></section>

<section class="sec dark" id="manatiq"><div class="wrap">
${head(K.areas, h.areas.h2, h.areas.lead, 'split')}
${cityLinks()}
${mores(H.areas.more)}
</div></section>

<section class="sec sand light" id="talab"><div class="wrap two">
${head(K.quote, h.quote.h2, h.quote.lead)}
${form()}
</div></section>

<section class="sec" id="asila"><div class="wrap faq-wrap">
${head(K.faq, h.faq.h2, '')}
${faq(h.faq.items)}
</div></section>`;
  return doc({ path: '/', title: h.title, desc: h.desc, body, cls: 'home', ogImg: H.hero, ld: ldHome() });
}

// ---------- الصفحات الداخلية ----------
function renderPage(slug) {
  const c = cfg.pages[slug], p = pages[slug];
  const by = (t) => p.blocks.find((b) => b.type === t);
  const prose = by('prose'), cards = by('cards'), fq = by('faq');
  const plain = !c.hero;
  const hero = `<div class="hero in${plain ? ' plain' : ''}">
${plain ? '' : `<div class="hero__img">${pic(c.hero, S.hero, { eager: true })}</div>`}
<div class="hero__txt"><nav class="crumb" aria-label="مسار الصفحة"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.label)}</span></nav>
<p class="k">${esc(p.kicker)}</p><h1>${esc(p.h1)}</h1><p class="lead">${esc(p.lead)}</p></div>
</div>`;

  const secProse = `<section class="sec"><div class="wrap"><div class="prose${c.aside ? ' has-ph' : ''}">
<div class="rv"><div class="head"><h2>${esc(prose.h2)}</h2></div>${prose.p.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
${c.aside ? `<div class="ph r45 zoom rv2">${pic(c.aside, S.half)}</div>` : ''}
</div></div></section>`;

  const n = cards.items.length;
  const secCards = `<section class="sec sand"><div class="wrap">
${head('', cards.h2, cards.intro, 'split')}
${c.cardPhotos
    ? `<div class="grid2 rv2">${cards.items.map((it, i) => `<div class="card"><div class="ph r45">${pic(c.cardPhotos[i], S.q)}</div><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></div>`).join('')}</div>`
    : `<div class="tiles${n === 3 ? ' t3' : ''} rv2">${cards.items.map((it) => `<div class="tile"><h3>${esc(it.t)}</h3><p>${esc(it.d)}</p></div>`).join('')}</div>`}
</div></section>`;

  const secGallery = c.gallery ? `<section class="sec dark"><div class="wrap">
<h2 class="vh">الصور</h2><div class="gallery rv2">${c.gallery.map((k, i) => `<div class="ph ${i % 3 === 0 ? 'r43' : 'r11'}">${pic(k, i % 3 === 0 ? S.wide : S.small)}</div>`).join('')}</div>
</div></section>` : '';

  const secCities = c.type === 'areas' ? `<section class="sec dark"><div class="wrap">
${head('', 'صفحة لكل مدينة', 'اختر مدينتك لتقرأ ما يخص الضيافة فيها.', 'split')}
${cityLinks()}
</div></section>` : '';

  const secForm = c.type === 'quote' ? `<section class="sec sand light"><div class="wrap two">
${head('', 'تفاصيل المناسبة', 'املأ أربعة حقول، ثم يُفتح واتساب برسالة جاهزة.')}
${form()}
</div></section>` : '';

  const secFaq = `<section class="sec"><div class="wrap faq-wrap">
${head('', fq.h2, '')}
${faq(fq.items)}
</div></section>`;

  const rel = (c.related || []).filter(live);
  const secRel = rel.length ? `<section class="sec sand light"><div class="wrap">
${head('', 'صفحات ذات صلة', '')}
<nav class="rel rv2" aria-label="صفحات ذات صلة">${rel.map((s) => `<a href="${url(s)}">${esc(label(s))}${I.arrow}</a>`).join('')}</nav>
</div></section>` : '';

  const extra = c.city ? `لمناسبة في ${c.city}` : '';
  const band = `<section class="sec band dark">${c.hero ? `<div class="ph">${pic(c.hero, '100vw', { alt: '' })}</div>` : ''}<div class="wrap rv">
<p class="k">${esc(cfg.name)}</p><h2>${esc(p.cta.h2)}</h2><p>${esc(p.cta.p)}</p>
<div class="acts">${btnWa(extra, '', c.type === 'quote' ? '#q' : url('talab'))}${c.type === 'quote' ? btnTel('ghost', '#q') : `<a class="btn ghost" href="${url('talab')}">اطلب عرض سعر</a>`}</div>
</div></section>`;

  const order = c.type === 'quote' ? [secForm, secProse, secCards, secFaq] : [secProse, secGallery, secCities, secCards, secFaq];
  const body = [hero, ...order, secRel, band].filter(Boolean).join('\n\n');
  return doc({ path: url(slug), title: p.title, desc: p.desc, body, ogImg: c.hero || cfg.home.hero, ld: ldPage(slug), current: slug });
}

function render404() {
  const nf = home.notfound;
  const body = `<div class="hero in plain"><div class="hero__txt"><p class="k">${esc(cfg.name)}</p><h1>${esc(nf.h1)}</h1><p class="lead">${esc(nf.p)}</p>
<p class="mores"><a class="more" href="/">الصفحة الرئيسية${I.arrow}</a>${more('talab')}</p></div></div>
<section class="sec"><div class="wrap">${head('', 'صفحات الموقع', '')}
<nav class="rel" aria-label="صفحات الموقع">${cfg.nav.filter(live).map((s) => `<a href="${url(s)}">${esc(label(s))}${I.arrow}</a>`).join('')}</nav></div></section>`;
  return doc({ path: '/404.html', title: 'الصفحة غير موجودة · طيف الضيافة', desc: nf.p, body, ogImg: cfg.home.hero, noindex: true });
}

// ---------- الكتابة ----------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'public'), DIST, { recursive: true });
const out = (rel, text) => { const f = join(DIST, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, text); };

out('index.html', renderHome());
for (const s of slugs) out(`${s}/index.html`, renderPage(s));
out('404.html', render404());

// خريطة الموقع: تاريخ التعديل من ملف المحتوى نفسه، لا من يوم البناء.
const sm = [['/', home.updated], ...slugs.map((s) => [url(s), pages[s].updated])];
for (const [u, d] of sm) if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) throw new Error('bad or missing "updated" date for ' + u);
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm.map(([u, d]) => `<url><loc>${esc(abs(u))}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`);
out('robots.txt', PROD ? `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n` : 'User-agent: *\nDisallow: /\n');

writeFileSync(join(ROOT, '.build-meta.json'), JSON.stringify({ base: BASE, prod: PROD, phoneSet: !!phone, pages: slugs.length + 1, held: PROD ? held : [] }) + '\n');

console.log(`${PROD ? 'PROD' : 'PREVIEW'} build: ${slugs.length + 1} pages + 404 -> site/dist  (base ${BASE}, phone ${phone ? 'set' : 'not set'}${held.length ? `, held in prod: ${held.join(', ')}` : ''})`);
