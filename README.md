# tayfaldiafa

موقع «طيف الضيافة» (قهوجيين وصبابين، المنطقة الشرقية) — **قيد التأسيس**. لا يوجد كود للموقع بعد. الموجود: نظام الذاكرة، المعايير المرجعية، دراسات مقيسة، ملخص العميل، هيكل الموقع المقترح مع مخطط هيكلي يُفتح على الجوال، مقارنة الخطوط، ومهارات لبناء مواقع العملاء.

| أنا… | أبدأ من |
|---|---|
| وكيل ذكاء اصطناعي | [AGENTS.md](AGENTS.md) — إلزامي قبل أي تعديل |
| المالك وأريد معرفة الحالة | [STATUS.md](STATUS.md) |
| أريد معرفة المطلوب مني كمالك | [STATUS.md](STATUS.md) قسم «معطّل / ينتظر» و [docs/FACTS.md](docs/FACTS.md) |

## فكرة المستودع
أي وكيل يدخل هذا المستودع في بيئة جديدة يجب أن يستطيع إكمال العمل من حيث توقف من قبله، بلا سياق خارجي وبلا تخمين.
لذلك كل معرفة المشروع تعيش في ملفات محددة:

| الملف | يجيب عن |
|---|---|
| [STATUS.md](STATUS.md) | أين نحن الآن وما التالي؟ |
| [docs/sessions/](docs/sessions/) | ماذا حدث في كل جلسة عمل؟ |
| [docs/FACTS.md](docs/FACTS.md) | ما المؤكد عن النشاط التجاري وما المجهول؟ |
| [docs/research/standards.md](docs/research/standards.md) | ما المعايير الحالية، وما مصدر كل منها؟ |
| [docs/research/inherited-lessons.md](docs/research/inherited-lessons.md) | ماذا تعلّمنا من مواقع الضيافة السابقة للمالك؟ |
| [docs/research/reference-sites.md](docs/research/reference-sites.md) | دراسة المواقع المرجعية |
| [docs/research/own-sites-study.md](docs/research/own-sites-study.md) | ماذا نأخذ من مواقع المالك الأربعة وماذا نترك؟ |
| [docs/research/luxury-ux-research.md](docs/research/luxury-ux-research.md) | كيف تبدو الفخامة وكيف تُبنى أول شاشة ورحلة التمرير؟ |
| [docs/research/account-inventory.md](docs/research/account-inventory.md) | ما الموجود في حساب المالك وما قُرئ منه؟ |
| [docs/client/brief.md](docs/client/brief.md) | من العميل، ماذا يريد، وماذا وُعد به؟ |
| [docs/research/search-intent-east.md](docs/research/search-intent-east.md) | ماذا يكتب الناس في جوجل في الشرقية، ومن يظهر لهم؟ |
| [docs/design/site-structure.md](docs/design/site-structure.md) | ما الصفحات، وما ترتيب الرئيسية على الجوال؟ |
| [docs/design/wireframe/](docs/design/wireframe/index.html) | كيف يبدو الترتيب على جوال؟ (مخطط رمادي، ليس تصميمًا) |
| [docs/research/arabic-fonts.md](docs/research/arabic-fonts.md) | أي خط؟ الوزن والترخيص والعيّنة |
| [docs/research/owner-skill-review.md](docs/research/owner-skill-review.md) | ما الذي أُخذ من مهارة المالك وما صُحّح؟ |
| [skills/](skills/README.md) | ما الخطوات لبناء موقع عميل جديد؟ |
| [scripts/measure/](scripts/measure/README.md) | كيف نقيس موقعًا؟ |
| [LESSONS.md](LESSONS.md) | أخطاء هذا المشروع وكيف نمنع تكرارها |
| [docs/adr/](docs/adr/) | القرارات: ماذا ولماذا وما البدائل |
| [docs/design/architecture.md](docs/design/architecture.md) | المعمارية والميزانيات |
| [docs/requirements/](docs/requirements/) | المتطلبات ومعايير القبول |
| [CHANGELOG.md](CHANGELOG.md) | ما تغيّر |

المنهجية مأخوذة من `moain2026/cortex-memory` مع إضافات موثقة في [ADR-0001](docs/adr/0001-repo-as-memory.md).

## التحقق
```
node scripts/check-memory.mjs
```
