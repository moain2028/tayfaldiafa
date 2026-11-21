# site — موقع «طيف الضيافة»

مولّد ثابت بلا اعتماديات: Node 20 أو أحدث فقط. القرار ولماذا: [ADR-0002](../docs/adr/0002-tech-stack.md). الألوان والخطوط والحركة: [ADR-0004](../docs/adr/0004-visual-direction-v2.md) (الأول، [ADR-0003](../docs/adr/0003-visual-direction.md)، رفضه المالك).

**الحالة (2026-11-21): بناء تجريبي.** النصوص مسودة، والصور مؤقتة، ولا رقم هاتف. بناء النشر يرفض العمل حتى تُحلّ الثلاثة.

## الأوامر
```bash
node site/build.mjs                 # بناء تجريبي إلى site/dist (noindex، بلا رقم)
node site/scripts/check.mjs         # البوابة: تفحص site/dist، وتخرج 1 عند أي خطأ
node scripts/measure/static-server.mjs site/dist 8090 0.0.0.0 &   # معاينة
node scripts/measure/site-smoke.mjs http://127.0.0.1:8090          # فحص في المتصفح (يحتاج Playwright)
```
بناء النشر:
```bash
TAYF_PHONE=9665XXXXXXXX node site/build.mjs --prod
node site/scripts/check.mjs --prod
```
`--prod` يرفض إن: لا رقم · `placeholder: true` في `photos/photos.json` · أي ملف نص فيه `draft: true`. ويستبعد الصفحات التي عليها `hold` في `site.config.json`.
`SITE_URL=https://…` يغيّر عنوان الموقع في `canonical` وخريطة الموقع.

## رقم الهاتف
**لا يدخل هذا المستودع.** يُعطى عند البناء بالمتغير `TAYF_PHONE` أو بملف `site/.private.json` بالشكل `{"phone":"9665XXXXXXXX"}` (الملف خارج git).
بلا رقم: لا يخرج أي رابط واتساب أو اتصال. الأزرار تفتح نموذج الطلب، والنموذج يعرض الرسالة ولا يرسلها.

## الملفات
| الملف | ما فيه |
|---|---|
| `build.mjs` | المولّد: القوالب، الرأس والتذييل، النموذج، البيانات المهيكلة، خريطة الموقع، `robots.txt` |
| `site.config.json` | الاسم، العنوان، القائمة، المدن، خيارات النموذج، وجدول الصفحات (النوع، الصور، الصفحات ذات الصلة، `hold`) |
| `content/home.json` و`content/pages/*.json` | النصوص. كل ملف فيه `draft` و`updated` |
| `src/styles.css` | ورقة الأنماط الوحيدة. الألوان والخطوط والمدد في المتغيرات أعلى الملف |
| `src/app.js` | النموذج يبني رسالة واتساب، وإغلاق القائمة. لا شيء غيرهما |
| `photos/photos.json` | قائمة الصور: المفتاح، الملف، النص البديل، المصدر، نقطة التركيز |
| `photos/src/` | الصور الأصلية · `public/img/` المخرجات بمقاسات AVIF و WebP · `photos/manifest.json` يكتبه `images.py` |
| `public/fonts/` | ثلاثة خطوط مقتطعة (Amiri للعناوين، El Messiri للأزرار، Almarai للنص) مع نصوص رخصها |
| `scripts/check.mjs` | البوابة |
| `scripts/images.py` | معالجة الصور (Pillow 11.3 أو أحدث بدعم AVIF و WebP) |

## إضافة صفحة
1. ملف `content/pages/<slug>.json` بالحقول: `slug` `draft` `title` `desc` `kicker` `h1` `lead` `blocks` (`prose` أو `cards` أو `faq`) `cta` `updated`.
2. سطر في `pages` داخل `site.config.json`: `label` و`type` (`service` · `city` · `page` · `areas` · `gallery` · `quote` · `legal`) وصورة الواجهة والصفحات ذات الصلة.
3. `node site/build.mjs && node site/scripts/check.mjs`. الصفحة تدخل خريطة الموقع آليًّا.

البوابة ترفض صفحة تشبه صفحة أخرى بأكثر من 0.3 (تشابه ثلاثيات الكلمات). صفحة مدينة جديدة تُكتب بكلام يخص المدينة، لا بتبديل الاسم.

## تبديل الصور
1. ضع الصور في `photos/src/` وعدّل `photos/photos.json`.
2. `python3 site/scripts/images.py` ثم أعد البناء.
3. حين تصير الصور كلها صور العميل: احذف `"placeholder": true`.

## ما تفحصه البوابة
طول العنوان (30–70) والوصف (110–165) وعدم تكرارهما · `lang` و`dir` · H1 واحد وترتيب العناوين · `canonical` و`og:url` · الروابط الداخلية والمراسي · أن روابط واتساب والاتصال تحمل الرقم المضبوط فقط · الصور (نص بديل، أبعاد، وجود الملفات) · البيانات المهيكلة (كيان نشاط واحد، بلا FAQPage ولا تقييمات) · كلمات ممنوعة وأرقام في النص · خريطة الموقع تطابق الصفحات المبنية · التشابه بين الصفحات · منع الفهرسة في التجريبي.
الحدّان 30–70 و110–165 من بوابة المالك السابقة، لا من جوجل ([standards.md](../docs/research/standards.md) البند 13).

## ما لا تفحصه
المتصفح نفسه (لذلك `site-smoke.mjs`) · Safari وآيفون حقيقي · صحة ما يقوله النص عن النشاط: هذا يؤكده العميل.
