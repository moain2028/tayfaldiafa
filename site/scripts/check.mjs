#!/usr/bin/env node
// بوابة فحص الموقع المبني. تُشغَّل بعد كل بناء:  node site/scripts/check.mjs
// تفحص site/dist فقط (لا تفتح متصفحًا). الخروج 1 عند أي خطأ.
// الحدود 30–70 للعنوان و110–165 للوصف من بوابة المالك السابقة، لا من جوجل (docs/research/standards.md البند 13).
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const cfg = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));
const SIM_MAX = 0.3; // أقصى تشابه مقبول بين صفحتين (اقتراح عمل، لا معيار رسمي)
const BANNED = ['الأفضل', 'رقم واحد', 'أرخص', 'خصم', 'معتمد', 'مرخّص', 'مرخص', 'مضمون', 'على مدار الساعة', 'مؤسسة', 'شركة', 'نفخر', 'لا مثيل'];

const errors = [], warns = [];
const err = (p, m) => errors.push(`${p}: ${m}`);
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST).filter((f) => f.endsWith('.html'));
const pathOf = (f) => '/' + f.slice(DIST.length + 1).replace(/index\.html$/, '');
const text = (h) => h.replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const fileFor = (p) => { const c = p.replace(/[?#].*$/, ''); return c.endsWith('/') ? join(DIST, c, 'index.html') : join(DIST, c); };

const pages = [], titles = new Map(), descs = new Map();
let bizCount = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8'), p = pathOf(f), is404 = p === '/404.html';
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = attr((html.match(/<meta name="description"[^>]*>/) || [''])[0], 'content') || '';
  const dec = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const tl = [...dec(title)].length, dl = [...dec(desc)].length;
  if (!is404) {
    if (tl < 30 || tl > 70) err(p, `طول العنوان ${tl} (المطلوب 30–70)`);
    if (dl < 110 || dl > 165) err(p, `طول الوصف ${dl} (المطلوب 110–165)`);
    if (titles.has(title)) err(p, `عنوان مكرر مع ${titles.get(title)}`); titles.set(title, p);
    if (descs.has(desc)) err(p, `وصف مكرر مع ${descs.get(desc)}`); descs.set(desc, p);
    if (!title.includes(cfg.name)) err(p, 'العنوان لا يحمل اسم الموقع');
  }
  if (!/<html lang="ar" dir="rtl">/.test(html)) err(p, 'lang/dir ناقص');
  if (!/<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/.test(html)) err(p, 'وسم viewport مختلف');
  const h1 = html.match(/<h1[\s>]/g) || [];
  if (h1.length !== 1) err(p, `عدد H1 = ${h1.length}`);
  // ترتيب العناوين: لا قفز من h1 إلى h3
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  levels.reduce((prev, l) => { if (l > prev + 1) err(p, `قفزة في العناوين من h${prev} إلى h${l}`); return l; }, 0);
  // canonical إلى الصفحة نفسها
  const canon = attr((html.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href');
  if (is404) { if (canon) err(p, 'صفحة الخطأ لا تحمل canonical'); }
  else if (!canon || new URL(canon).pathname !== p) err(p, `canonical = ${canon}`);
  // الروابط الداخلية
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, href, inner] = m;
    if (href.startsWith('/')) { if (!existsSync(fileFor(href))) err(p, `رابط مكسور ${href}`); }
    else if (!/^(https:\/\/wa\.me\/|tel:\+?\d|#)/.test(href)) err(p, `رابط غير متوقع ${href}`);
    const label = text(inner) || attr(m[0], 'aria-label') || '';
    if (!label) err(p, `رابط بلا نص ${href}`);
    if (/^(اعرف أكثر|المزيد|اضغط هنا|هنا)$/.test(label)) err(p, `نص رابط لا يسمّي وجهته: «${label}»`);
  }
  // الصور
  const imgs = html.match(/<img\s[^>]*>/g) || [];
  imgs.forEach((t, i) => {
    if (attr(t, 'alt') === undefined) err(p, 'صورة بلا alt');
    if (!attr(t, 'width') || !attr(t, 'height')) err(p, 'صورة بلا أبعاد');
    if (!existsSync(fileFor(attr(t, 'src')))) err(p, `صورة مفقودة ${attr(t, 'src')}`);
    const eager = /fetchpriority="high"/.test(t), lazy = /loading="lazy"/.test(t);
    if (i === 0 && !eager) err(p, 'أول صورة بلا fetchpriority=high');
    if (i > 0 && !lazy) err(p, 'صورة بعد الأولى بلا loading=lazy');
  });
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (!existsSync(fileFor(u))) err(p, `ملف srcset مفقود ${u}`); }
  // البيانات المهيكلة
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let o; try { o = JSON.parse(m[1]); } catch { err(p, 'JSON-LD لا يُقرأ'); continue; }
    const s = JSON.stringify(o);
    if (/FAQPage|aggregateRating|"review"|CateringService|Caterer/.test(s)) err(p, 'نوع بيانات مهيكلة ممنوع (FAQ أو تقييم ذاتي أو نوع غير موجود في schema.org)');
    if (['ProfessionalService', 'LocalBusiness'].includes(o['@type'])) bizCount++;
  }
  // النص الظاهر
  const body = text((html.match(/<main[\s\S]*<\/main>/) || [''])[0]);
  for (const w of BANNED) if (body.includes(w) || title.includes(w) || desc.includes(w)) err(p, `كلمة ممنوعة: ${w}`);
  const digits = body.match(/[0-9٠-٩]+/g) || [];
  const allowed = new Set(['١', '٢', '٣']); // أرقام الخطوات فقط
  for (const d of digits) if (!allowed.has(d)) err(p, `رقم في النص: ${d}`);
  if (/(?:9665|05)\d{8}/.test(html) && !process.env.TAYF_PHONE && !existsSync(join(ROOT, '.private.json'))) err(p, 'رقم هاتف في البناء بلا مصدر');
  if (/[\u0600-\u06FF]\s*!/.test(body)) err(p, 'علامة تعجب في النص');
  pages.push({ p, body, is404, robots: attr((html.match(/<meta name="robots"[^>]*>/) || [''])[0], 'content') || '' });
}
if (bizCount !== 1) errors.push(`عدد كيانات النشاط في البيانات المهيكلة = ${bizCount} (المطلوب 1)`);

// خريطة الموقع = الصفحات المبنية (عدا صفحة الخطأ)
const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).sort();
const built = pages.filter((x) => !x.is404).map((x) => x.p).sort();
if (JSON.stringify(locs) !== JSON.stringify(built)) errors.push(`خريطة الموقع لا تطابق الصفحات: في الخريطة ${locs.length}، مبني ${built.length}`);
for (const m of sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1])) errors.push(`lastmod غير صالح ${m[1]}`);

// التشابه بين الصفحات: Jaccard على ثلاثيات الكلمات من نص <main>
const tri = (s) => { const w = s.split(' ').filter((x) => x.length > 1); const o = new Set(); for (let i = 0; i + 2 < w.length; i++) o.add(w.slice(i, i + 3).join(' ')); return o; };
const sets = pages.filter((x) => !x.is404).map((x) => ({ p: x.p, s: tri(x.body) }));
const sims = [];
for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) {
  let inter = 0; for (const t of sets[i].s) if (sets[j].s.has(t)) inter++;
  sims.push({ a: sets[i].p, b: sets[j].p, v: inter / (sets[i].s.size + sets[j].s.size - inter) });
}
sims.sort((x, y) => y.v - x.v);
for (const s of sims) if (s.v > SIM_MAX) errors.push(`تشابه ${s.v.toFixed(2)} بين ${s.a} و ${s.b} (الحد ${SIM_MAX})`);

const preview = pages.every((x) => /noindex/.test(x.robots));
for (const e of errors) console.log('ERROR ' + e);
for (const w of warns) console.log('WARN  ' + w);
console.log(`أعلى تشابه: ${sims.slice(0, 3).map((s) => `${s.v.toFixed(2)} ${s.a} ↔ ${s.b}`).join(' · ')}`);
console.log(`${errors.length ? 'FAIL' : 'PASS'} — ${pages.length} صفحة، ${errors.length} خطأ، ${locs.length} رابطًا في خريطة الموقع، البناء ${preview ? 'تجريبي (noindex)' : 'للنشر'}`);
process.exit(errors.length ? 1 : 0);
