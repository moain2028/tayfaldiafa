# AGENTS.md — tayfaldiafa (موقع ضيافة فاخر)

> **هذا المستودع هو الذاكرة الوحيدة للمشروع.** ما ليس مكتوبًا هنا لا تعرفه.
> إن احتجت معلومة غير موجودة: اسأل المالك أو تحقق من مصدرها، ثم اكتبها هنا. لا تخمّن.

## ابدأ هنا (بهذا الترتيب، قبل أي تعديل)
1. [STATUS.md](STATUS.md) — أين نحن، ما المعطّل، ما التالي.
2. أحدث ملف في [docs/sessions/](docs/sessions/) — ما فعله من قبلك وما تركه مفتوحًا.
3. [docs/FACTS.md](docs/FACTS.md) — حقائق النشاط التجاري، والمجهول منها.
4. [LESSONS.md](LESSONS.md) ثم [docs/research/inherited-lessons.md](docs/research/inherited-lessons.md) — أخطاء لا تُكرَّر.
5. [docs/research/standards.md](docs/research/standards.md) — المعايير المتحقق منها بمصادرها.
6. [docs/design/architecture.md](docs/design/architecture.md) و [docs/adr/](docs/adr/) — القرارات ولماذا. كود الموقع: [site/README.md](site/README.md).
7. [docs/research/own-sites-study.md](docs/research/own-sites-study.md) و [luxury-ux-research.md](docs/research/luxury-ux-research.md) — ما دُرس وما يؤخذ منه.
8. [skills/](skills/README.md) — الخطوات والبوابات لبناء الموقع. اقرأ المهارة التي تخص مهمتك قبل البدء.

## الأوامر
- فحص سلامة الذاكرة: `node scripts/check-memory.mjs` (يجب أن ينجح قبل كل commit)
- قياس موقع (أول شاشة + Lighthouse + المرونة): [scripts/measure/README.md](scripts/measure/README.md)
- العميل وما قاله: [docs/client/brief.md](docs/client/brief.md) · هيكل الموقع المقترح: [docs/design/site-structure.md](docs/design/site-structure.md)
- **المستودع عام:** لا هاتف، لا مبلغ، لا تفريغ محادثات، لا أسماء أطراف أخرى. العميل طلب السرّية.
- بناء الموقع وفحصه: `node site/build.mjs` ثم `node site/scripts/check.mjs` (يجب أن ينجحا قبل أي commit يمسّ `site/`). التفصيل وبناء النشر: [site/README.md](site/README.md).
- فحص الموقع في المتصفح: `node scripts/measure/site-smoke.mjs <الرابط>` ([scripts/measure/README.md](scripts/measure/README.md)).
- **رقم الهاتف لا يُكتب في أي ملف يدخل git.** يُعطى عند البناء بـ`TAYF_PHONE` أو `site/.private.json`.

## القواعد
- **لا معلومة عن النشاط بلا مصدر.** اسم، هاتف، مدن، أسعار، أرقام خبرة أو عملاء: تؤخذ من [docs/FACTS.md](docs/FACTS.md) فقط. إن كانت «مجهول» فاسأل المالك ولا تخترع قيمة مؤقتة تبدو حقيقية.
- **لا معيار من الذاكرة.** أي رقم أو قاعدة (جوجل، WCAG، إصدارات) يُؤخذ من [standards.md](docs/research/standards.md). إن لم يكن هناك أو تجاوز عمره 90 يومًا: افتح المصدر الرسمي، ثم حدّث الملف.
- **لا «تمّ» بلا دليل.** كل ادعاء إنجاز يرافقه الأمر الذي شُغّل ونتيجته. ما لم يُفحص يُكتب «لم يُفحص».
- **«لا أراه» ليست «غير موجود».** عند تعذر الوصول لمورد اذكر السبب المرجّح، ولا تنفِ وجوده.
- قرار ← [docs/adr/](docs/adr/) · مشكلة أخذت أكثر من 30 دقيقة ← [LESSONS.md](LESSONS.md) · متطلب ← [docs/requirements/](docs/requirements/).
- القرارات التجارية والبصرية (الاسم، الألوان، الصور، النصوص التسويقية، النشر) يقررها المالك. اعرض الخيارات بأدلتها.
- **المستودع عام.** لا يدخله هاتف ولا رمز ولا بيانات عملاء ولا كود أو نص من مستودع خاص للمالك. مخرجات القياس الخام واللقطات ونسخ المستودعات تبقى في `.tools/` و`.refs/` (مستثناة من git).
- كل الملفات المؤقتة داخل مجلد المشروع، لا في `/tmp`.
- **كاتب واحد في المجلد.** قبل أول كتابة: `git status` ثم `find . -path ./.git -prune -o -type f -mmin -10 -print`. إن ظهرت ملفات تتغير ولم تكتبها أنت، فجلسة أخرى تعمل: لا تكتب في المستودع، اترك سطرًا في `.tools/COORDINATION-READ-ME.md`، وانتظر حتى تدفع ثم تحقق من عملها. حدث هذا يوم 2026-11-21 ([LESSONS.md](LESSONS.md)).
- Git: فرع `main` على `moain2028/tayfaldiafa`. commit لكل جولة عمل ثم push. لا force-push ولا إعادة كتابة تاريخ.

## نهاية كل جلسة (إلزامي)
1. حدّث [STATUS.md](STATUS.md) (وتاريخ `updated`).
2. أضف مدخلًا في `docs/sessions/YYYY-MM-DD.md`: ما أُنجز، ما تُحقق منه وكيف، ما بقي مفتوحًا، ما لم يُحفظ.
3. حدّث [CHANGELOG.md](CHANGELOG.md)، و FACTS / LESSONS / ADR إن تغيّر شيء.
4. `node scripts/check-memory.mjs` ثم commit ثم push، وتأكد أن الـpush وصل.

التفصيل: [docs/runbooks/session-handoff.md](docs/runbooks/session-handoff.md)
