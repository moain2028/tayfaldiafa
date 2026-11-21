---
verified: 2026-11-21
---
# المعايير المرجعية — متحقق منها من المصدر

كل بند هنا فُتح مصدره الرسمي يوم `verified` أعلاه. تاريخ «آخر تحديث» هو ما تكتبه الصفحة نفسها.
النصوص الإنجليزية بين علامتي التنصيص منقولة حرفيًا. ما لم أتحقق منه مذكور في آخر الملف صراحةً.
إذا تجاوز عمر `verified` تسعين يومًا: أعد فتح المصادر قبل الاعتماد على الملف.

## 1) الأداء — Core Web Vitals
المصدر: `developers.google.com/search/docs/appearance/core-web-vitals` (آخر تحديث 2025-12-10) و `web.dev/articles/vitals`

| المقياس | يقيس | حد «جيد» |
|---|---|---|
| LCP | سرعة ظهور أكبر عنصر | خلال 2.5 ثانية |
| INP | الاستجابة للتفاعل | أقل من 200 مللي ثانية |
| CLS | ثبات التخطيط | أقل من 0.1 |

- الحكم على **الشريحة المئوية 75** من زيارات المستخدمين الحقيقيين، منفصلة للجوال وسطح المكتب (web.dev).
- القياس المحلي (Lighthouse) مؤشر مختبري، وليس ما تقيسه جوجل للموقع الحي.

**أجزاء LCP** — `web.dev/articles/optimize-lcp` (آخر تحديث 2025-03-31). التوزيع المستهدف لزمن LCP:
| الجزء | النسبة المستهدفة |
|---|---|
| زمن أول بايت (TTFB) | نحو 40% |
| تأخّر بدء تحميل المورد (load delay) | أقل من 10% |
| مدة تحميل المورد (load duration) | نحو 40% |
| تأخّر الرسم (render delay) | أقل من 10% |

أي أن صورة الواجهة يجب أن تُكتشف من HTML فورًا، وألا ينتظر رسمها تنفيذ JavaScript.

## 2) المحتوى
المصدر: `developers.google.com/search/docs/fundamentals/creating-helpful-content` (آخر تحديث 2026-10-05)
- لا يوجد عدد كلمات مفضّل: "Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"
- "Of these aspects, trust is most important." و E-E-A-T "isn't a specific ranking factor".

## 3) سياسات السبام
المصدر: `developers.google.com/search/docs/essentials/spam-policies` (آخر تحديث 2026-08-28)
- Doorway abuse، ومن أمثلته: "Having multiple domain names or pages targeted at specific regions or cities that funnel users to one page".
- Keyword stuffing، ومن أمثلته: "Blocks of text that list cities and regions that a web page is trying to rank for".
- Scaled content abuse: "many pages are generated for the primary purpose of manipulating search rankings and not helping users".
- Back button hijacking: سياسة أضيفت 2026-04-13. لا عبث بسجل التصفح أو زر الرجوع.

## 4) البيانات المهيكلة
**قواعد عامة** — `…/structured-data/sd-policies` (آخر تحديث 2026-07-10)
- "Don't mark up content that is not visible to readers of the page."
- لا محتوى مضلل أو مراجعات مزيفة.

**LocalBusiness** — `…/structured-data/local-business` (آخر تحديث 2026-09-08)
- المطلوب: `name` و `address`.
- الموصى به: `geo` (دقة 5 خانات عشرية على الأقل)، `openingHoursSpecification`، `telephone` (مع رمز الدولة)، `url`، `priceRange` (أقل من 100 حرف).
- "Use the most specific LocalBusiness sub-type possible". الأنواع المتعددة تُكتب كمصفوفة.
- `aggregateRating` و `review`: "only recommended for sites that capture reviews about other local businesses".

**المراجعات** — `…/structured-data/review-snippet` (آخر تحديث 2026-09-08)
- مراجعات النشاط عن نفسه (self-serving) غير مؤهلة لـ LocalBusiness و Organization.
- "Don't include fake or undisclosed incentivized reviews" (أضيفت 2026-07-24).

**FAQ** — `developers.google.com/search/updates`
- "This feature will no longer appear in Google Search starting May 7, 2026." وحُذف توثيقها في 2026-06-15.
- الأسئلة الشائعة كمحتوى مرئي ما زالت مفيدة للزائر؛ الملغى هو النتيجة المنسّقة.

**Breadcrumb** — نفس الصفحة، مدخل 2025-01-22: تظهر على سطح المكتب فقط.

**أنواع schema.org** — فحصتُ ملف المفردات `schema.org/version/latest/schemaorg-current-https-types.csv` (1485 نوعًا):
| النوع | النتيجة |
|---|---|
| `CateringService` | **غير موجود** (والصفحة تعطي 404) |
| `Caterer` | **غير موجود** |
| `FoodService` | موجود، لكنه فرع من `Service` وليس من `LocalBusiness` |
| `ProfessionalService` | فرع من `LocalBusiness` |
| `FoodEstablishment` | فرع من `LocalBusiness` (فروعه: Bakery, BarOrPub, Brewery, CafeOrCoffeeShop, Distillery, FastFoodRestaurant, IceCreamShop, Restaurant, Winery) |

أُعيد الفحص في نفس اليوم على الملفين `current` (1485 نوعًا) و`all` (1486 نوعًا): `CateringService` و`Caterer` غير موجودين في أيٍّ منهما. ثلاثة من مواقع المالك الأربعة المدروسة تستخدم `CateringService` ([own-sites-study.md](own-sites-study.md)).

لا يوجد في المفردات نوع خاص بخدمات الضيافة أو التموين. النوع المناسب لهذا المشروع **لم يُحسم**؛ يتوقف على FACTS رقم 2 و4.

## 5) خريطة الموقع
- `developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap` (آخر تحديث 2026-07-08): "Google ignores <priority> and <changefreq> values. Google uses the <lastmod> value if it's consistently and verifiably … accurate."
- `sitemaps.org/protocol.html`: "all URLs … must be URL-escaped"، والقيم entity-escaped، والملف UTF-8. الروابط العربية تُرمَّز.

## 6) البحث بالذكاء الاصطناعي (AI Overviews / AI Mode)
المصدر: `developers.google.com/search/docs/fundamentals/ai-optimization-guide` (آخر تحديث 2026-07-10)
- أساسيات السيو نفسها هي المطلوبة؛ الصفحة يجب أن تكون مفهرسة ومؤهلة للظهور بمقتطف.
- شرط إضافي بنص الصفحة: "a site must be included in Search generative AI features in Search Console to be eligible for display in generative AI features". يُفحص هذا الإعداد عند ربط Search Console (M5).
- **لا حاجة** إلى: `llms.txt`، تقطيع المحتوى (chunking)، إعادة الكتابة للذكاء الاصطناعي، أو schema خاص. عن llms.txt (ملاحظة 2026-06-15): لا يؤثر سلبًا ولا إيجابًا.
- المهم: محتوى غير مكرر عن الشائع (non-commodity) من خبرة مباشرة، صور وفيديو جيدة، وملف Google Business للأنشطة المحلية.
- القياس: تقرير Generative AI performance في Search Console.

## 7) إمكانية الوصول — WCAG 2.2
المصدر: `w3.org/WAI/standards-guidelines/wcag/new-in-22/` — توصية W3C منذ 2023-10-05.
الجديد عن 2.1 في المستويين A و AA:
| المعيار | المستوى | المطلوب |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | العنصر المركَّز عليه لا يُحجب كليًا (انتبه للشرائط الثابتة) |
| 2.5.7 Dragging Movements | AA | بديل بنقرة لكل سحب (يخص معارض الصور والسلايدر) |
| 2.5.8 Target Size (Minimum) | AA | هدف اللمس 24×24 بكسل CSS على الأقل، مع استثناءات |
| 3.3.8 Accessible Authentication (Minimum) | AA | لا اختبار ذهني عند تسجيل الدخول |
| 3.2.6 Consistent Help | A | وسيلة المساعدة/التواصل في نفس الموضع بكل الصفحات |
| 3.3.7 Redundant Entry | A | لا يُطلب إدخال نفس المعلومة مرتين |

4.1.1 Parsing أُلغي. 2.4.13 Focus Appearance مستواه AAA وليس AA.

## 8) إصدارات الأدوات على npm (لقطة يوم التحقق)
ناتج `npm view <pkg> version`. **الأرقام فقط** — لم أقرأ ملاحظات الإصدار ولا التوافق بينها.

astro 7.4.13 (يتطلب Node ‎>=22.23.4) · next 16.4.6 · vite 8.3.8 · tailwindcss 4.3.5 · hono 4.13.19 · wrangler 4.166.0 · typescript 7.0.2 · @astrojs/sitemap 3.7.6 · @playwright/test 1.65.1 · lighthouse 13.6.0 · @lhci/cli 0.16.1 · sharp 0.35.5 · eslint 10.15.0 · prettier 3.10.1
بيئة العمل: Node v22.23.4 · npm 10.9.9

## 9) النص العربي على الويب
المصدر: `w3.org/TR/alreq/` — «Arabic & Persian Layout Requirements». **مسودة مجموعة عمل (Group Draft Note)**، وتنص على أنها عمل قيد التطوير ولا تُستشهد بها كمرجع نهائي. الوثيقة طويلة؛ **قرأتُ نحو ثلثها الأول** (الاتجاه، أنماط الخط، الاتصال، الأرقام). لم أقرأ أقسام كسر الأسطر والمحاذاة وما بعدها.
- المسافة داخل الكلمة لا تُعدَّل إلا عند الحروف غير المتصلة: "Moving two joined characters closer to or further from each other creates undesirable results." ⇐ لا `letter-spacing` على العربي.
- الشفافية على الحروف تكشف تراكب الوصلات، وحدّ النص (border) لا يُرسم حول كل حرف منفردًا؛ الحروف المتصلة تُعامل شكلًا واحدًا.
- تلوين حرف واحد داخل كلمة يجب ألا يقطع اتصاله بجيرانه.
- النسخ هو خط القراءة المتصلة وأساس أغلب خطوط الطباعة. الثلث للعناوين والاستعمال الزخرفي. الرقعة مدمجة وبسيطة الشكل عند التكبير، «popular in contemporary lettering».
- "Numbers, even Arabic numbers, are written from left to right".
- الأرقام العربية-الهندية (٠–٩) تُستخدم في بلدان المشرق، والوثيقة تذكر منها السعودية ومصر والعراق؛ الأوروبية (0–9) في المغرب العربي. للنوعين صنف اتجاهي مختلف (AN و EN) فيختلف ترتيبهما داخل النص المختلط.
- علامة النسبة والعملة والفواصل لها مواضع خاصة مع كل نظام أرقام.

## 10) أداء الخطوط
المصدر: `web.dev/articles/font-best-practices` (لم يظهر تاريخ التحديث في النص المجلوب).
- تعريف `@font-face` لا يحمّل الخط؛ يُحمَّل عند استعماله في الصفحة.
- يُفضَّل تضمين تعريفات الخطوط داخل `<head>` بدل ملف خارجي.
- `preload` للخطوط بحذر: يأخذ من موارد غيره ويتجاهل `unicode-range`.
- الاستضافة الذاتية ليست أسرع تلقائيًا: تحتاج CDN و HTTP/2، مع اقتطاع الحروف وضغط WOFF2.
- "Use only WOFF2 and forget about everything else."
- الاقتطاع (subset) يصغّر الملف كثيرًا؛ يُتحقق أولًا من أن ترخيص الخط يسمح به.
- أقل عدد من الخطوط. خط النظام خيار لنص الجسم.
- `font-display`: ‏`optional` للأداء (لا قفزة تخطيط، وقد لا يظهر الخط إن تأخر) · `swap` لإظهار النص فورًا مع إيصال الخط مبكرًا. يمكن الجمع: `swap` لعناصر الهوية و`optional` لنص الجسم.
- `size-adjust` يقلّل القفزة بين الخط البديل وخط الويب.
- المتصفحات المبنية على Chromium وفايرفوكس تحجب النص حتى 3 ثوانٍ بانتظار الخط افتراضيًا؛ سفاري يحجبه بلا حد.

## 11) أبحاث تجربة الاستخدام (Nielsen Norman Group)
مقالات بحثية، ليست معايير رسمية. تواريخ النشر لم تظهر في النص المجلوب لثلاث منها.
| المقال | ما فيه |
|---|---|
| «Scrolling and Attention» (تتبّع عين، 120 مشاركًا، 2018) | 57% من زمن المشاهدة فوق الطيّة · 74% في أول شاشتين · 81% في أول ثلاث · أكثر من 65% من زمن ما فوق الطيّة في نصفه الأعلى · تجنّب الأرضية الوهمية · أبقِ الدعوات الأساسية فوق الطيّة |
| «How Long Do Users Stay on Web Pages» | المغادرة غالبًا خلال 10–20 ثانية؛ أول 10 ثوانٍ حرجة |
| «Hamburger Menus and Hidden Navigation Hurt UX Metrics» (179 مشاركًا، 6 مواقع) | استعمال القائمة المخفية: سطح المكتب 27% مقابل 48–50% للظاهرة والمدمجة؛ الجوال 57% مقابل 86% للمدمجة · قابلية اكتشاف المحتوى تنخفض أكثر من 20% · زمن المهمة أطول 39% على سطح المكتب و15% على الجوال · التوصية: على الجوال أظهر الروابط إن كانت 4 أو أقل؛ على سطح المكتب لا تُخفِ التنقل |
| «Sticky Headers: 5 Ways to Make Them Better» | أصغر ارتفاع ممكن · خلفية معتمة متباينة · حركة قليلة؛ الظهور عند التمرير للأعلى 300–400 مللي ثانية · هدف اللمس 1سم×1سم · اسأل إن كان الرأس الثابت لازمًا أصلًا |
| «Executing UX Animations: Duration and Motion Characteristics» | أغلب الحركات 100–500 مللي ثانية · 100 للاستجابة البسيطة · 200–300 للتغيّر الكبير · عند 500 تصير عبئًا · ease-out للدخول · احترام «تقليل الحركة» · Parallax وخطف التمرير والسلايدر التلقائي مزعجة ومسببة للدوار |

بحث الانطباع الأول: Tuch وآخرون، *International Journal of Human-Computer Studies* 70(11)، 2012، ص 794–811 — قرأتُ **الملخص** في `research.google/pubs`: التعقيد البصري والمألوفية يؤثران في التقييم الجمالي خلال 50 مللي ثانية، والتعقيد حتى عند 17؛ "websites with low VC and high PT were perceived as highly appealing". لم أقرأ الورقة كاملة.

## 12) النوافذ التي تحجب المحتوى
المصدر: `developers.google.com/search/docs/appearance/avoid-intrusive-interstitials` (لم يظهر تاريخ التحديث في النص المجلوب).
- "Instead of full page interstitials, use banners that take up only a small fraction of the screen".
- "Don't obscure the entire page with interstitials." و "Don't redirect the user to a separate page for their consent or input."
- النوافذ **الإلزامية قانونًا** مستثناة، مع التوصية بأن تعلو المحتوى لا أن تستبدله.
- هل إشعار الكوكيز إلزامي لهذا المشروع؟ يتوقف على بلد النشاط وعلى استعمال تتبّع أصلًا. **لم يُبحث.**

## ما لم أتحقق منه (لا تعتمد عليه من هذا الملف)
- **المعايير البصرية والتصميمية**: لا يوجد لها معيار رسمي. ما جُمع عنها بحث وقياس في [luxury-ux-research.md](luxury-ux-research.md)، وهو اتجاه لا معيار.
- **اختيار الخطوط العربية وتراخيصها ومقروئيتها**: لم يُبحث. (قواعد التحميل في البند 10.)
- **قانون حماية البيانات وإشعار الكوكيز** في بلد النشاط: لم يُبحث.
- **Lindgaard وآخرون 2006** («50 مللي ثانية») و **Pracejus وآخرون 2006** (الفراغ الأبيض): تأكدتُ من وجود المرجعين بالبحث فقط؛ لم أقرأهما.
- **دعم المتصفحات لميزات CSS الحديثة**: لم يُبحث.
- **إرشادات Google Business Profile**: موجودة في مستودع `osoul-aldiafa` بتاريخ 2026-08-22؛ لم أفتح مصدرها بنفسي.
- **تاريخ إلغاء HowTo**: لاحظتُ أنه غير موجود في قائمة ميزات البيانات المهيكلة الحالية؛ التاريخ (سبتمبر 2023) من مصادر غير رسمية.
- **توثيق إصدارات الأدوات في البند 8**.
