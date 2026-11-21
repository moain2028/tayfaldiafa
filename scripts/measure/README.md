# scripts/measure — قياس موقع على الجوال

ثلاث أدوات صغيرة تُنتج الأرقام التي تُبنى عليها الدراسات في [docs/research/](../../docs/research/own-sites-study.md). تُستعمل لقياس مواقع مرجعية اليوم، ولقياس موقعنا نفسه لاحقًا.

| الملف | يفعل |
|---|---|
| `static-server.mjs` | خادم ملفات ثابتة مع gzip على `127.0.0.1` لمجلد بناء |
| `probe.mjs` | يفتح الصفحة بمقاس 390×844 ويلتقط أول شاشة ويقيس بنيتها |
| `lh-summary.mjs` | يجمع تقارير Lighthouse ويحسب الوسيط لكل موقع |
| `responsive.mjs` | يفتح الصفحة على ستة مقاسات ويعدّ مشاكل المرونة واللمس |
| `fullshot.mjs` | لقطة للصفحة كاملة بعرض جوال، مقسومة أعمدة لتُقرأ في صورة واحدة |
| `fonts.py` | يقارن خطوطًا عربية: الترخيص، الاسم المحجوز، المحارف الناقصة، الحجم بعد الاقتطاع، وصفحة عيّنات |

## التثبيت
```bash
cd scripts/measure
npm ci
npx playwright install chromium
```
الإصدارات مثبّتة في `package.json`: ‏lighthouse 13.6.0 و playwright 1.65.1.

**إن فشل تشغيل Chromium بسبب مكتبات نظام ناقصة** (حدث في 2026-11-21: `libatk` وأخواتها، وبلا صلاحية تثبيت): نزّل الحزم الناقصة بـ`apt-get download`، فكّها بـ`dpkg -x` إلى مجلد داخل `.tools/`، ثم أضف مسارها إلى `LD_LIBRARY_PATH`. الحزم الخمس التي لزمت يومها: `libatk1.0-0t64` · `libatk-bridge2.0-0t64` · `libatspi2.0-0t64` · `libxcomposite1` · `libxdamage1`.
Lighthouse يحتاج `CHROME_PATH` يشير إلى ملف chrome الذي نزّله Playwright.

## الاستعمال
```bash
# 1) شغّل الموقع المبني محليًا
node scripts/measure/static-server.mjs <مجلد-البناء> 4101 &

# 2) فحص أول شاشة (يقبل عدة أزواج: اسم ثم رابط)
node scripts/measure/probe.mjs <مجلد-المخرجات> home http://127.0.0.1:4101/

# 3) Lighthouse للجوال، ثلاث مرات
for i in 1 2 3; do
  scripts/measure/node_modules/.bin/lighthouse http://127.0.0.1:4101/ --quiet \
    --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path=<مجلد-المخرجات>/lh/home-$i.json
done

# 4) الوسيط
node scripts/measure/lh-summary.mjs <مجلد-المخرجات>/lh summary.json
```
أسماء تقارير Lighthouse يجب أن تكون `<الموقع>-<رقم>.json`.

## ما يخرجه `probe.mjs`
`<مجلد-المخرجات>/shots/<الاسم>.png` و `<مجلد-المخرجات>/probe-<أول-اسم>.json`، وفيه لكل صفحة:
`screens` طول الصفحة بالشاشات · `dom` عدد العناصر · `h1` و`h1Px` و`h1Font` · `bodyFont` و`bodyBg` · `h2` عناوين الأقسام · `wa` و`tel` عدد روابط واتساب والاتصال · `forms` · `imgs` · `foldCtas` العناصر القابلة للنقر في أول شاشة · `foldWords` كلمات أول شاشة · `overflowX` الفائض الأفقي · `kbJs` `kbImg` `kbFont` `kbAll` الأوزان · `reqs` عدد الطلبات · `ld` أنواع البيانات المهيكلة · `robots` · `lang` · `dir` · `jsErrors`.

## فحص المرونة `responsive.mjs`
```bash
node scripts/measure/responsive.mjs <مجلد-المخرجات> <الاسم> <الرابط> [<الاسم> <الرابط> …]
```
ستة مقاسات: 320×568 · 360×800 · 390×844 · 414×896 · 768×1024 · 1280×800. Chromium فقط.
يخرج `<مجلد-المخرجات>/shots/<الاسم>-<العرض>.png` و `responsive-<الاسم>.json`، وفيه لكل عرض:
`overflowX` · `taps` و`tapsUnder24` و`tapsUnder48` · `minFontPx` و`textUnder12` · `fieldsUnder16` · `h1Px` و`h1Lines` · `actionInFirstScreen` · `fixedCoverPct` · `screens`.
الحدود في [skills/mobile-first](../../skills/mobile-first/SKILL.md).

## لقطة الصفحة كاملة `fullshot.mjs`
```bash
node scripts/measure/fullshot.mjs <الصورة.png> <الرابط> [العرض=390] [الأعمدة=1] [إخفاء-الثابت=0]
```
لصفحاتنا نحن (المخطط الهيكلي، عيّنات الخطوط). تُؤخذ مع إعداد «تقليل الحركة» حتى لا تظهر الأقسام البعيدة نصف شفافة. `إخفاء-الثابت=1` يخفي العناصر الثابتة: في اللقطة الطويلة يُرسم الشريط السفلي مرة واحدة فوق محتوى لا علاقة له به.

## مقارنة الخطوط `fonts.py`
```bash
pip install --target .tools/pylib brotli   # fonttools موجودة في البيئة؛ brotli لازمة لـWOFF2
PYTHONPATH=.tools/pylib python3 scripts/measure/fonts.py .tools/fonts
node scripts/measure/static-server.mjs .tools/fonts/spec 4141 &
node scripts/measure/fullshot.mjs .tools/fonts/specimen.png http://127.0.0.1:4141/ 390 2
```
ينزّل الخطوط من `github.com/google/fonts` ويكتب `fonts.json` وصفحة العيّنات. لإضافة خط: سطر في قائمة `FONTS` أعلى الملف.
الأرقام حقائق ملفات. **لا تقول شيئًا عن شكل الخط**: العيّنة تُفتح على جوال حقيقي. نتيجة 2026-11-21: [arabic-fonts.md](../../docs/research/arabic-fonts.md).

## حدود تُكتب مع كل رقم
- قياس مختبري. جوجل تحكم على بيانات الزوار الحقيقيين ([standards.md](../../docs/research/standards.md) البند 1).
- 3 مرات والوسيط دائمًا: تشغيل واحد أعطى 47 ثم 85 و80 لنفس الصفحة.
- سجّل `benchmarkIndex` للبيئة مع النتيجة. بيئة بلا معالج رسوميات تضخّم زمن «Style & Layout».
- أوزان الموارد من نطاقات أخرى قد تُبلَّغ صفرًا؛ الأوزان للمواقع الخارجية حدود دنيا.
- الأوزان تُحسب بعد التحميل بـ2.5 ثانية وبلا تمرير؛ الصور المؤجَّلة لا تدخل.

## قواعد
- المخرجات الخام واللقطات تذهب إلى `.tools/` (مستثنى من git). يدخل المستودع ملخص منقّى فقط.
- **المستودع عام:** المخرج الخام يحوي نصوص أزرار فيها أرقام هواتف. لا يُرفع كما هو. انظر كيف نُقّي [probe-summary.json](../../docs/research/data/2026-11-21/probe-summary.json).
- أغلق الخوادم بعد القياس وتأكد أن المنافذ فارغة.
- كل الملفات المؤقتة داخل `/home/user/webapp/.tools/`، لا في `/tmp` ولا في مجلد المستخدم.
