---
verified: 2026-11-21
---
# مراجعة مهارة المالك `nextjs-seo-mastery`

**ما هي:** ملف مضغوط أرسله المالك يوم 2026-11-21: ‏55 ملفًا، 7524 سطرًا. مهارة لبناء مواقع Next.js بسيو وأداء وحركة واختبارات.
**المطلوب:** أخذ المفيد، حذف غير المفيد، والتحقق.
**النتيجة:** المفيد دخل مهارات هذا المستودع (العمود الأخير). الأصل لم يُعدَّل ولم يُرفع: فيه معرّفا إعلانات ورقما حساب إعلاني واسم موقع عميل آخر، والمستودع عام.

**حدود المراجعة.** قرأتُ كاملًا: `PHILOSOPHY` · `SKILL` · `discovery/01,02,03,05` · `references/01,03,04,06,07,08,09` وأغلب `02` · `design/rtl-arabic` و`homepage-blueprint` وأول `design-tokens` · `animation/README` و`motion-performance` · `checklists/launch-checklist` · خمسة قوالب (sitemap, robots, schemas, city-service-page, page-plan).
مررتُ بالبحث فقط على: `testing/*` · `animation/framer-motion-recipes` و`gsap-scrolltrigger` و`lenis-smooth-scroll` · `design/dark-mode`.
**لم أقرأ:** `references/05-rendering-strategies` · `design/shadcn-setup` · `checklists/developer-checklist` · باقي القوالب · `CHANGELOG`. كلها خاصة بـNext.js ولم يُنقل منها شيء.

## 1) يُؤخذ — أثمن ما في المهارة
| ما هو | أين في الأصل | حكم التحقق | أين صار |
|---|---|---|---|
| اختبار حذف اسم المدينة: إن لم يُعرف لأي مدينة الصفحة فهي doorway | `references/08` §2 | يوافق سياسة جوجل ([standards.md](standards.md) البند 3). الواقعة نفسها (47 صفحة، 9 مفهرسة، 24 صفحة تتشارك نحو 85% من النص) خبرة المالك؛ لا أستطيع إعادة قياسها | [scroll-journey-ia](../../skills/scroll-journey-ia/SKILL.md) |
| لا تشخّص من عدّاد مجمّع؛ افحص عيّنة صفحات | `references/08` | خبرة المالك | [after-launch](../../skills/after-launch/SKILL.md) |
| `lastmod` صادق أو لا شيء | `references/08` §3 | ✔ نص جوجل (البند 5) | [search-appearance](../../skills/search-appearance/SKILL.md) |
| canonical لكل صفحة باسمها، لا موروث من القالب العام | `references/08` §4 | منطقي؛ خبرة المالك | نفسها |
| عبارة واحدة ⇐ صفحة واحدة تملكها | `references/08` §8 | خبرة المالك | [scroll-journey-ia](../../skills/scroll-journey-ia/SKILL.md) |
| المفرد والجمع في العربية نيّتان مختلفتان | `references/09` §8 | خبرة المالك، ويوافقها ما رأيتُه في إكمال جوجل ([search-intent-east.md](search-intent-east.md)) | [local-search-study](../../skills/local-search-study/SKILL.md) |
| دروس الإعلانات: أهداف أساسية وثانوية، لا مزايدة بالقيمة وقيمك صفر، نقرة واتساب وسيط لا عميل | `references/09` | خبرة المالك | [after-launch](../../skills/after-launch/SKILL.md) |
| تتبّع التحويل: `send_to` بصيغة `معرّف/رمز`، وحدث `generate_lead` | `references/06` | ✔ الصيغتان في صفحتي دعم Google Ads و GA4 | نفسها |
| كل زر واتساب أو اتصال رابط `<a href>` حقيقي | `references/06` | ✔ (البند 13) | [search-appearance](../../skills/search-appearance/SKILL.md) |
| لا تقييم ذاتي في البيانات المهيكلة؛ `LocalBusiness` كيان واحد لا واحد لكل مدينة | `references/04` | ✔ (البند 4) | نفسها |
| نشاط منطقة خدمة: عنوان مخفي، حتى 20 منطقة، نحو ساعتي قيادة | `references/04` (ج) | ✔ (البند 15) | [after-launch](../../skills/after-launch/SKILL.md) |
| التقييمات: لا مقابل، لا انتقاء للراضين | نفسه | ✔ (البند 15) | نفسها |
| أسئلة المكان L1–L4 وبروتوكول دراسة المنافسين | `discovery/05` | منهج؛ جرّبتُه اليوم على الشرقية | [local-search-study](../../skills/local-search-study/SKILL.md) و[new-client-site](../../skills/new-client-site/SKILL.md) |
| لا `letter-spacing` على العربي | `design/rtl-arabic` ① | ✔ W3C (البند 9) | [arabic-web](../../skills/arabic-web/SKILL.md) (موجودة) |
| فحص الأوزان غير المحمّلة (faux-bold)، خطّان على الأكثر، لا إيموجي كأيقونات | `design/rtl-arabic` ②④⑤ | فحص عملي؛ «خطّان» توافق web.dev (البند 10) | [arabic-web](../../skills/arabic-web/SKILL.md) |
| الذهبي على الفاتح يسقط في التباين | `testing/a11y-axe` | ✔ أعدتُ الحساب: ‎`#b8860b` على `#0f0f0f` = 5.89 · على `#f5f5dc` = 2.94 · `#d4a017` على `#f5f5dc` = 2.15 | [quality-gates](../../skills/quality-gates/SKILL.md) (بوابة التباين موجودة) |
| قِس قبل أن تُصلح؛ وافصل بين المقيس والمنفَّذ والمتوقَّع | `homepage-blueprint` و`references/08` | مبدأ هذا المستودع نفسه | [AGENTS.md](../../AGENTS.md) (موجود) |
| لموقع محتوى أو خدمات: Astro أولًا، و Next للتطبيقات | `SKILL.md` و`references/07` | يوافق قياسي: مواقع Next عند المالك نفّذت 1219–1287 مللي ثانية من JavaScript مقابل 75–108 للبديلين ([ADR-0002](../adr/0002-tech-stack.md)) | [ADR-0002](../adr/0002-tech-stack.md) |
| `priority` أُلغيت في Next 16 لصالح `preload`؛ نطاق ثغرة CVE-2025-66478 | `references/02` و`07` | ✔ (البند 19) | للمقارنة فقط |
| تكييف الخليج: واتساب مدخل واحد، صور حقيقية، أندرويد 360 أولًا، شريط سفلي | `homepage-blueprint` | يوافق أرقام السعودية (البند 16) | [mobile-first](../../skills/mobile-first/SKILL.md) |

## 2) يُصحَّح
| ما في المهارة | أين | الصحيح | المصدر |
|---|---|---|---|
| `FAQPage` «فرصة Rich Results»، ومقيَّدة «منذ 2023»، و«أبقِها» | 9 ملفات | النتيجة المنسّقة **أُلغيت** في 7 مايو 2026 وحُذف توثيقها. الأسئلة كنص مرئي مفيدة؛ البيانات المهيكلة لها بلا عائد في جوجل. ادعاء أنها تنفع في Discover وملخصات الذكاء **بلا مصدر**، ودليل جوجل يقول لا حاجة لـschema خاص | البندان 4 و6 |
| `WebSite + SearchAction` لمربع البحث | `references/04` §6 | الميزة أُلغيت في نوفمبر 2024 | البند 13 |
| `changeFrequency` و`priority` في خريطة الموقع | ملفان | "Google ignores <priority> and <changefreq> values" | البند 5 |
| `Title ≤ 60 حرفًا` و`Description ≤ 160` | `page-plan` وقالب صفحة المدينة | لا حدّ بالأحرف عند جوجل؛ القطع بعرض الشاشة. المهارة نفسها تقول في `references/08`: «يُراجع بالبكسل لا بعدد الأحرف» | البند 13 |
| وصف الصفحة ينتهي برقم الهاتف | `page-plan` | الوصف ملخص للصفحة. الأرقام في الأوصاف هي ما يملأ نتائج المنافسين | البند 13، و[search-intent-east.md](search-intent-east.md) |
| «1000–1500 كلمة: الحد الأدنى للمنافسة» | `page-plan`، `discovery/02`، قائمة الإطلاق | "Are you writing to a particular word count…? (No, we don't.)" | البند 2 |
| «اذكر 6–10 أحياء بالاسم (إشارة جغرافية)» | `page-plan` وقالب صفحة المدينة | من أمثلة الحشو عند جوجل: "Blocks of text that list cities and regions" | البند 3 |
| «صفحة مستقلة لكل (خدمة × مدينة): أكبر فرق تنافسي» | `SKILL`، `PHILOSOPHY`، `page-plan`، قائمة الإطلاق | **تناقض داخلي:** `references/08` في المهارة نفسها يوثّق أن هذا النمط أسقط الفهرسة. القاعدة الصحيحة هي قاعدة 08: صفحة فقط حين توجد مادة محلية لا توجد في غيرها | البند 3 |
| `"@type": "LocalBusiness"` مع تعليق «استبدل بـCaterer» | `templates/schemas.ts` | `Caterer` غير موجود في schema.org | البند 4 |
| إعداد Lighthouse CI بـ`preset: desktop` | `testing/lighthouse-ci` | جمهور هذه المواقع جوال؛ البوابة تكون على الجوال | البند 16 |
| البوابة تشترط `interaction-to-next-paint` من Lighthouse | نفسه | **تناقض داخلي:** قائمة الإطلاق في المهارة تقول «Lighthouse لا يقيس INP» | — |
| اختبار Playwright على `Desktop Chrome` و`Pixel 5` فقط | `testing/playwright-e2e` | 42% من جوالات السعودية iOS، وسفاري 38.5% من متصفحات الجوال | البند 16 |
| وسوم axe حتى `wcag21aa` والهدف المعلن WCAG 2.2 | `testing/a11y-axe` | يُضاف `wcag22aa` | البند 7 |
| `border-color: hsl(var(--color-border))` والمتغيّر نفسه قيمته `hsl(…)` | `design/design-tokens` | النتيجة `hsl(hsl(…))`: قيمة غير صالحة. تُكتب `var(--color-border)` | قراءة الكود |
| «ممنوع `position: fixed` بلا `will-change` أو `translateZ(0)`» | `PHILOSOPHY` §2 | **تناقض داخلي:** `motion-performance` في المهارة يقول «`will-change` بحذر، فعّلها ثم أزلها» | — |
| «واجب: Framer Motion و GSAP و Lenis و Lottie و R3F» | `PHILOSOPHY` §2 | **تناقض داخلي:** ميزانية المهارة نفسها لمواقع الخدمات «Framer فقط». وخطف التمرير و Parallax مزعجان بنص NN/g | البند 11 |
| أرقام في أمثلة الصفحة: «+500 مناسبة»، «4.9»، «تبدأ من 500 ريال»، «نعم نوفّر فريقًا نسائيًا» | `homepage-blueprint` وقالب صفحة المدينة | تخالف بند المهارة نفسها «ممنوع اختراع الأرقام». قيمة مؤقتة تبدو حقيقية تصل إلى الإنتاج. تُكتب `[من FACTS]` | [inherited-lessons.md](inherited-lessons.md) |
| `font-feature-settings: "ss01"` على كل نص عربي | `design/design-tokens` | بلا تعليل، ويتغيّر أثره من خط إلى آخر | — |
| أرقام إصدارات مكتوبة (Next 16.2.12، Astro 7.1.6) | `references/07` | قديمة: npm يوم التحقق يقول next 16.4.6 و astro 7.4.13. المهارة نفسها تقول تحقق حيًّا | البند 8 |

## 3) بلا مصدر — يبقى موسومًا «غير متحقق» أو يُحذف
- «+35% مقيس» للصور الحقيقية، وادعاء عن التسعير منسوب إلى Baymard (`homepage-blueprint`).
- «الفئة الأساسية أقوى عامل ترتيب في الخرائط» (`references/04`). نص جوجل: الصلة والمسافة والشهرة.
- «ردّ على التقييم خلال 24–48 ساعة يؤثر في الترتيب»، و«كشك تقييم داخل المحل إشارة سبام».
- حدّ طلبات الفهرسة «5–10 يوميًا»، وجدول المدد الزمنية للأرشفة، و«10,000 رابط يوميًا في Bing»، و«Bing يغذّي ChatGPT» (`references/03`).
- `line-height` العربي «1.8–2.0» منسوبًا إلى W3C: لم أجد الرقم في الجزء الذي قرأتُه من الوثيقة.
- «GSAP مجاني منذ 3.13»، و«Cloudflare Pages في وضع صيانة»، و`scheduler.yield()` و Speculation Rules: لم أفتح مصادرها.
- «تحديث سبام مارس 2026»: لم أتحقق من التسمية والتاريخ.

## 4) لا يُنقل
| ما هو | لماذا |
|---|---|
| القوالب (`next.config`, `middleware`, `layout`, `sitemap.ts`…) وأغلب `references/01,02,05` | خاصة بـNext.js، والتوصية لهذه المواقع غيره |
| `shadcn-setup`، `dark-mode`، `vitest`، `bundle-budgets`، وأسئلة الاستبيان عن State و Auth و CMS | لتطبيقات، لا لموقع خدمات محلي ثابت |
| `gsap-scrolltrigger`، `lenis-smooth-scroll`، R3F، Lottie | وزن JavaScript بلا حاجة مثبتة، وخطف للتمرير. البديل: [motion](../../skills/motion/SKILL.md) |
| `templates/page-plan.md` | قالب يُنتج الصفحات المتشابهة التي يحذّر منها `references/08` |
| معرّفا إعلانات، ورقما حساب إعلاني، واسم موقع عميل (4 ملفات) | بيانات خاصة |

## 5) إن أراد المالك إصلاح الأصل
الجدول 2 قائمة الإصلاح سطرًا بسطر. أستطيع تسليم نسخة مصحّحة من الملف المضغوط نفسه إن طلبها؛ لم أفعل لأن المطلوب هنا مهارات تُستعمل لأي تقنية.
