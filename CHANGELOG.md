# Changelog
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

## [Unreleased]
### Added
- نظام الذاكرة: `AGENTS.md`، `STATUS.md`، `LESSONS.md`، `docs/FACTS.md`، سجل الجلسات، ADR، القوالب.
- `docs/research/standards.md`: معايير الأداء والسيو والوصول متحقق منها من مصادرها الرسمية بتاريخ 2026-11-21.
- `docs/research/inherited-lessons.md`: دروس من `osoul-aldiafa` و `keif-aldiafa-web`.
- `scripts/check-memory.mjs`: فحص آلي لسلامة الذاكرة.
- `docs/research/own-sites-study.md`: دراسة مقيسة لأربعة مواقع للمالك وحكم إعادة الاستخدام.
- `docs/research/luxury-ux-research.md`: بحث الفخامة، أول شاشة، رحلة التمرير، هندسة المعلومات، الرأس، الخط العربي، الحركة.
- `docs/research/account-inventory.md`: جولة حساب المالك وما قُرئ منه.
- `docs/research/data/2026-11-21/`: ملخصا Lighthouse وفحص أول شاشة (منقّيان).
- `scripts/measure/`: خادم ثابت، فحص أول شاشة، ملخص Lighthouse، ودليل تشغيل.
- `skills/`: ست مهارات بحالة مسودة لبناء موقع عميل جديد.
- `docs/research/standards.md`: أجزاء LCP، والبنود 9–12.

- `docs/client/brief.md`: ملخص العميل ونيته ونطاق ما وُعد به، منقّى للمستودع العام.
- `docs/research/search-intent-east.md` وبياناته: ما يُكتب في جوجل في الشرقية ومن يظهر.
- `docs/research/owner-skill-review.md`: مراجعة مهارة المالك (يُؤخذ / يُصحَّح / بلا مصدر / لا يُنقل).
- `docs/design/site-structure.md`: الصفحات، ترتيب الرئيسية على الجوال، شكل النتيجة في البحث.
- `scripts/measure/responsive.mjs`: فحص ستة مقاسات.
- `skills/`: خمس مهارات جديدة (local-search-study، search-appearance، mobile-first، motion، after-launch).
- `docs/research/standards.md`: البنود 13–19.

- `docs/design/wireframe/`: مخطط هيكلي رمادي للصفحة الرئيسية (HTML و CSS فقط) وصورته.
- `docs/research/arabic-fonts.md` وبياناته وصورة العيّنة: مقارنة 12 عائلة خط عربي بالوزن والترخيص والتغطية.
- `scripts/measure/fonts.py` و`scripts/measure/fullshot.mjs`.
- `docs/research/standards.md`: البندان 20 (حالات الفهرسة في Search Console) و21 (ترخيص الخطوط المفتوحة)، و`viewport-fit=cover`، و`prefers-reduced-motion`، وإلغاء `middleware` في Next.
- `docs/research/data/2026-11-21/wireframe-responsive.json`.

- `site/`: موقع «طيف الضيافة» بحالة تجريبية. مولّد ثابت بلا اعتماديات (`build.mjs`)، ورقة أنماط وسكربت واحد، 18 صفحة نصوصها مسودة، 18 صورة مؤقتة بمقاسات AVIF و WebP، خطّان مستضافان، بوابة (`scripts/check.mjs`)، معالجة صور (`scripts/images.py`)، و`README.md`.
- `scripts/measure/cpu.mjs` (كلفة المعالج لصفحة) و`scripts/measure/site-smoke.mjs` (فحص الموقع في المتصفح).
- `docs/adr/0003-visual-direction.md`: الألوان والخطوط والحركة.
- `docs/design/preview/home-390.jpg`: لقطة أول شاشة.
- `docs/research/data/2026-11-21/`: ‏`suggest-round5.json` و`site-lighthouse.json` و`site-responsive.json`.

### Changed
- `docs/adr/0002-tech-stack.md`: **مقبول** — مولّد ثابت خاص بالمشروع، مع الدليل المقيس.
- `STATUS.md` و`README.md` و`AGENTS.md` (أوامر البناء، قاعدة رقم الهاتف) و`docs/FACTS.md` و`docs/design/site-structure.md` و`docs/design/architecture.md` و`docs/research/search-intent-east.md`: حُدّثت بما في الجولة الخامسة.
- `skills/`: ‏quality-gates و motion و mobile-first إلى 0.3 بما تعلّمناه من أول بناء.
- `scripts/measure/`: ‏`responsive.mjs` لا يعدّ ما بداخل `<details>` مغلق؛ `fullshot.mjs` يحمّل الصور المؤجلة ويرسم الأقسام البعيدة؛ `static-server.mjs` يقبل عنوان الاستماع ويخدم `404.html`.
- `.gitignore`: ‏`site/.private.json` و`site/.build-meta.json`.
- `skills/`: ‏after-launch و search-appearance و motion و mobile-first إلى 0.2، و arabic-web إلى 0.3.
- `docs/research/owner-skill-review.md`: الملفات التي لم تكن مقروءة قُرئت (البند 6)، وصُحّح عمود «أين صار».
- `docs/adr/0002-tech-stack.md`: تجربة المسار المتداخل وما وُجد في روابط القائمة. الحالة ما زالت «مقترح».
- `docs/design/architecture.md` و`docs/research/reference-sites.md` و`README.md` و`scripts/measure/README.md` و`skills/README.md`: حُدّثت بما في الجولتين الثالثة والرابعة.
- `docs/FACTS.md`: النطاق غير مسجَّل بفحصين. `AGENTS.md`: قاعدة «كاتب واحد». `LESSONS.md`: ثلاثة دروس.
- `skills/` الخمس القديمة إلى 0.2 بما دُمج من مهارة المالك. `docs/FACTS.md` بحقائق العميل. `ADR-0002` بتجربة تعدد الصفحات.
- `docs/adr/0002-tech-stack.md`: دليل مقيس وخيار رابع؛ الميل المبدئي من Astro إلى محرّك المالك. الحالة ما زالت «مقترح».
- `scripts/check-memory.mjs`: يتجاوز `.refs/` و`.tools/`.
- `STATUS.md`، `docs/FACTS.md`، `docs/research/reference-sites.md`، `AGENTS.md`، `README.md`، `LESSONS.md`.
