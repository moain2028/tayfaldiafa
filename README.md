# tayfaldiafa

موقع ضيافة فاخر — **قيد التأسيس**. لا يوجد كود للموقع بعد؛ الموجود حاليًا هو نظام الذاكرة والمعايير المرجعية.

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
