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

## 13) شكل النتيجة في صفحة البحث (الاسم، العنوان، الوصف، الرابط)
ما يراه الباحث قبل أن يدخل. كل عنصر له صفحة رسمية؛ فُتحت كلها يوم التحقق.

| العنصر | القاعدة | المصدر (آخر تحديث) |
|---|---|---|
| اسم الموقع (فوق العنوان) | يُؤخذ من بيانات `WebSite` في **الصفحة الرئيسية** ومن `og:site_name` والعنوان والترويسات. "Use a concise, commonly-recognized name". يدعم `alternateName`. "Google Search does not support site names at the subdirectory level." | `…/appearance/site-names` (2025-12-10) |
| الأيقونة | "Your favicon must be a square (1:1 aspect ratio) that's at least 8x8px"، والموصى به أكبر من 48×48. رابطها ثابت لا يتغير. | `…/appearance/favicon-in-search` (2026-10-27) |
| العنوان | "Write descriptive and concise text for your <title> elements." · "Avoid keyword stuffing." · لا عنوان مكرر بتبديل كلمة واحدة («boilerplate») · "Brand your titles concisely": اسم الموقع في أول العنوان أو آخره بفاصل. | `…/appearance/title-link` (2025-12-10) |
| طول العنوان | **لا حدّ بالأحرف**: "While there's no limit on how long a <title> element can be, the title link is truncated in Google Search results as needed, typically to fit the device width." | نفسه |
| من أين يأخذ جوجل العنوان | `<title>`، ثم العنوان المرئي الرئيسي، وعناصر الترويسة مثل `<h1>`، و`og:title`، ونص الروابط المؤدية للصفحة، وبيانات `WebSite`. أي أن جوجل قد يستبدل العنوان بالـH1. | نفسه |
| الوصف | "There's no limit on how long a meta description can be, but the snippet is truncated … typically to fit the device width." · وصف فريد لكل صفحة · يصح أن يحمل معلومات محددة لا جملة فقط · قوائم الكلمات المفتاحية مثال سيئ · جوجل قد يأخذ المقتطف من نص الصفحة بدل الوصف. | `…/appearance/snippet` (2026-04-20) |
| الروابط الفرعية تحت النتيجة (sitelinks) | "At the moment, sitelinks are automated." يساعد عليها: عناوين وترويسات «informative, relevant, and compact»، بنية منطقية، نص روابط داخلية موجز ودالّ، وعدم التكرار. | `…/appearance/sitelinks` (2025-12-10) |
| مربع البحث تحت النتيجة | **أُلغي**: "The sitelinks search box feature is no longer available in Google Search results" (مدخل 29 نوفمبر 2024). لا فائدة من `SearchAction`. | `developers.google.com/search/updates` |

**الرابط (URL)** — `…/crawling-indexing/url-structure` (2026-10-21):
- "Use words in your audience's language in the URL (and, if applicable, transliterated words)." كلمات عربية أو منقولة بحروف لاتينية: كلاهما مقبول.
- غير اللاتيني يُرمَّز (percent-encoding) داخل `href`.
- الفاصل بين الكلمات شرطة `-` لا شرطة سفلية `_`.
- كلمات مقروءة بدل أرقام تعريف طويلة.

**نص الرابط الداخلي** — `…/crawling-indexing/links-crawlable` (2025-12-10):
- الرابط القابل للزحف هو `<a href="…">` فقط. `<a onclick=…>` بلا `href` لا يُتبع.
- "Good anchor text is descriptive, reasonably concise, and relevant". أمثلة السيئ في الصفحة نفسها: "Click here" و "Read more".
- رابط على صورة: نصّه هو `alt` الصورة.

## 14) الفهرسة من نسخة الجوال، والصور
**Mobile-first indexing** — `…/crawling-indexing/mobile/mobile-sites-mobile-first-indexing` (2025-12-10):
- "Google uses the mobile version of a site's content, crawled with the smartphone agent" للفهرسة والترتيب.
- "Don't lazy-load primary content upon user interaction." ما يحتاج نقرًا أو سحبًا ليُحمَّل لا يراه جوجل.
- محتوى الجوال = محتوى سطح المكتب. يجوز طيّه في أكورديون أو تبويبات ما دام موجودًا في الصفحة.
- نفس الترويسات ونفس البيانات المهيكلة في النسختين.

**الصور** — `…/appearance/google-images` (2026-03-02):
- الصورة التي يُراد ظهورها تكون في `<img src>`. "Google doesn't index CSS images."
- `srcset` أو `<picture>` للأحجام، مع `<img src>` احتياطي.
- اسم الملف: "short, but descriptive". يعطي «very light clues» فقط.
- `alt` هو الأهم؛ يُكتب وصفًا مفيدًا في سياق الصفحة. "Avoid filling alt attributes with keywords".
- الصورة قرب نص يخصها، في صفحة تخص موضوعها.

**حقوق الصورة** — `…/structured-data/image-license-metadata` (2025-12-10):
- جوجل يعرض مع الصورة اسم صاحبها والنسبة وشروط الاستعمال إن وُجدت. تكفي طريقة واحدة: بيانات مهيكلة في الصفحة، **أو** بيانات IPTC مضمَّنة في ملف الصورة. عند التعارض يُؤخذ بالبيانات المهيكلة.
- هذا عرضٌ للحقوق، لا منعٌ للنسخ.

## 15) Google Business Profile (الخرائط)
المصادر: `support.google.com/business/answer/3038177` (الإرشادات) · `…/answer/9157481` (نشاط منطقة الخدمة) · `…/answer/7091` (الترتيب المحلي) · `support.google.com/contributionpolicy/answer/7400114` و `…/business/answer/3474122` (التقييمات). صفحات الدعم لا تُظهر تاريخ تحديث.

- **نشاط يذهب إلى العميل ولا يستقبله في مقر** = «service-area business»: ملف **واحد**، والعنوان يُخفى. "If you don't serve customers at your business address, remove your address from your Business Profile."
- "You can have up to 20 service areas." وحدودها "shouldn't be more than about 2 hours of driving time from where your business is based."
- عنوان بريدي مستأجر بلا عمل فعلي فيه («virtual office») غير مؤهل.
- **الاسم**: "Your name should reflect your business's real-world name, as used consistently on your storefront, website, stationery, and as known to customers." لا كلمات بحث ولا مدن ولا أرقام في الاسم.
- **الهاتف**: "The phone number must be under the direct control of the business." ولا رقم يحوّل إلى جهة أخرى.
- **الترتيب المحلي**: "Local results are mainly based on relevance, distance, and popularity." الشهرة تشمل عدد الروابط والتقييمات. اكتمال البيانات ودقتها يرفعان الظهور.
- **التقييمات**: يجوز طلبها برابط أو رمز QR. لا يجوز: مقابل (خصم، هدية، مال)، ولا "selectively solicit positive reviews"، ولا تقييم من موظف أو قريب أو منافس.

**لم أتحقق من:** طريقة توثيق الملف (فيديو أم غيره)، وشروط الأهلية لنشاط بلا سجل تجاري في السعودية.

## 16) الجوال: المقاسات، اللمس، الارتفاع
**من يزور من ماذا في السعودية** — StatCounter، أكتوبر 2026 (`gs.statcounter.com`، تنزيل CSV يوم التحقق):
| | |
|---|---|
| المنصة | جوال 66.36% · سطح مكتب 32.33% · لوحي 1.3% |
| نظام الجوال | Android ‏57.99% · iOS ‏42.01% |
| متصفح الجوال | Chrome ‏54.29% · Safari ‏38.51% · UC ‏2.76% · Samsung Internet ‏2.67% · Opera ‏1.29% |
| أكثر مقاسات الشاشة (CSS px) | 414×896 (27.46%) · 360×800 (6.95%) · 384×832 (6.38%) · 390×844 (6.04%) · 412×915 (2.87%) · 393×873 (2.59%) |

هذه أرقام عامة للسعودية. نسبة «95% جوال» قالها المالك عن عملائه؛ تُؤخذ من بياناته هو، لا من هنا.

**قواعد**
| القاعدة | النص | المصدر |
|---|---|---|
| وسم العرض | `<meta name="viewport" content="width=device-width, initial-scale=1">`. منع التكبير (`maximum-scale`، `user-scalable`) غير موصى به. | `web.dev/articles/responsive-web-design-basics` (2019-02-12) |
| لا تمرير أفقي | المحتوى يُعرض بلا تمرير في اتجاهين عند عرض **320 بكسل CSS**. | WCAG 2.2 ‏1.4.10 Reflow (AA) |
| تكبير النص | حتى 200% بلا فقد محتوى أو وظيفة. | WCAG 2.2 ‏1.4.4 (AA) |
| الاتجاه | لا يُقفل على الطولي أو العرضي. | WCAG 2.2 ‏1.3.4 (AA) |
| هدف اللمس، الحد الأدنى | 24×24 بكسل CSS، أو تباعد يعوّض. | WCAG 2.2 ‏2.5.8 (AA) |
| هدف اللمس، الموصى به | "around 48 device independent pixels" (نحو 9مم)، مع تباعد بين الأهداف. | `web.dev/articles/accessible-tap-targets` (2020-03-31) |
| ارتفاع الشاشة | `100vh` على الجوال يساوي الشاشة **وأشرطة المتصفح مطويّة**، فيختبئ أسفل العنصر تحتها عند أول فتح. `svh` = الارتفاع والأشرطة ظاهرة. `lvh` = وهي مطويّة. `dvh` يتغير بينهما. | `web.dev/blog/viewport-units` (2022-11-29) |
| الحواف الآمنة | `env(safe-area-inset-bottom)` يُبعد الشريط السفلي عن حافة الأجهزة ذات النتوء والزوايا. | MDN ‏`env()` |
| أولوية صورة الواجهة | الصور تبدأ بأولوية منخفضة؛ `fetchpriority="high"` على صورة LCP يقدّمها. | `web.dev/articles/fetch-priority` (2023-11-14) |
| الرجوع الفوري | ذاكرة الرجوع والتقدّم (bfcache) تعيد الصفحة السابقة فورًا من الذاكرة. "Never use the unload event". | `web.dev/articles/bfcache` (2026-10-16) |
| ما يُحسب في INP | النقر واللمس ولوحة المفاتيح. التمرير والتحويم لا يُحسبان. جيد: 200 مللي ثانية أو أقل عند الشريحة 75. | `web.dev/articles/inp` (2025-09-02) |

**`viewport-fit=cover` والحواف الآمنة** (أُضيف في الجولة الرابعة):
- `webkit.org/blog/7929/designing-websites-for-iphone-x/` (22 سبتمبر 2017): "The default value of viewport-fit is auto, which results in the automatic insetting behavior". لمدّ الصفحة على كامل الشاشة: `viewport-fit=cover`، ثم تُبعَد العناصر المهمة بـ`env(safe-area-inset-*)`.
- MDN، صفحة وسم `viewport`: "cover: The viewport is scaled to fill the device display. It's highly recommended to use the safe area inset variables".
- ⇐ نكتب الاثنين معًا: `viewport-fit=cover` في الوسم و`env(safe-area-inset-bottom)` على الشريط السفلي.
- **لم أجد** نصًّا يقول صراحةً إن قيم `env()` تساوي صفرًا بلا `cover`. يُفحص على آيفون حقيقي.

## 17) حركة بلا JavaScript، ودعم المتصفحات
| الميزة | ما هي | الدعم يوم التحقق | المصدر |
|---|---|---|---|
| انتقال بين صفحتين (`@view-transition { navigation: auto }`) | انتقال بصري عند فتح صفحة أخرى من نفس النطاق. تختاره الصفحتان بسطر CSS. | Chrome منذ 126. MDN يصنّفها «Limited availability … not Baseline». | `developer.chrome.com/docs/web-platform/view-transitions/cross-document` (2024-04-14) و MDN |
| حركة مربوطة بالتمرير (`animation-timeline: view()` و `scroll()`) | حركة CSS يتحكم التمرير في تقدّمها، وتعمل خارج الخيط الرئيسي. | MDN: «Baseline 2026 — Newly available». | `developer.chrome.com/docs/css-ui/scroll-driven-animations` (2023-05-05) و MDN |

«Newly available» تعني أن الأجهزة غير المحدَّثة لا تدعمها. **القاعدة:** المحتوى ظاهر افتراضًا، والحركة تحسين لمن يدعمها. لا يُخفى شيء بانتظار حركة.
لم أستخرج جدول الإصدارات لكل متصفح؛ الحكم من تصنيف MDN فقط.

**احترام إعداد تقليل الحركة** (أُضيف في الجولة الرابعة) — MDN، `prefers-reduced-motion`: مصنّفة «Baseline — Widely available»، "available across browsers since January 2020". القيمة `reduce`: "a user has enabled the setting on their device for reduced motion". ⇐ كل حركة تُكتب داخل `@media (prefers-reduced-motion: no-preference)`.

## 18) وعود لا يملكها أحد
- "No one can guarantee a #1 ranking on Google." — `…/fundamentals/do-i-need-seo` (2026-06-05).
- أثر أي تغيير: "Some changes might take effect in a few hours, others could take several months." والتقييم بعد «a few weeks». — `…/fundamentals/seo-starter-guide` (2025-12-10).
- روابط تُصنع للترتيب سبام: "Link spam is the practice of creating links to or from a site primarily for the purpose of manipulating search rankings." ومن أمثلته "Creating low-value content primarily for the purposes of manipulating linking and ranking signals". — سياسات السبام (2026-08-28).
- IndexNow: القائمة في `indexnow.org/faq` تذكر Amazon و Bing و Naver و Seznam و Yandex و Yep. **جوجل ليست فيها.**

## 19) حقائق عن Next.js (للمقارنة فقط)
- `nextjs.org/docs/app/api-reference/file-conventions/proxy` (2026-11-18): "The middleware file convention is deprecated and has been renamed to proxy.".
- `nextjs.org/docs/app/api-reference/components/image` (2026-11-18): "Starting with Next.js 16, the priority property is deprecated. Use preload".
- `nextjs.org/blog/CVE-2025-66478`: ثغرة في بروتوكول RSC، درجتها CVSS 10.0. تصيب App Router على 15.x و 16.x و 14.3.0-canary.77 فما بعد. لا تصيب 13.x ولا 14.x المستقرة ولا Pages Router. أُصلحت في 15.0.5 · 15.1.9 · 15.2.6 · 15.3.6 · 15.4.8 · 15.5.7 · 16.0.7.

## 20) حالات الفهرسة في Search Console
المصدر: `support.google.com/webmasters/answer/7440203` («Page indexing report»). فُتحت يوم 2026-11-21 بلا `?hl=en`؛ لا تاريخ تحديث ظاهر في النص.
| الحالة | نص جوجل |
|---|---|
| Discovered – currently not indexed | "The page was found by Google, but not crawled yet. Typically, Google wanted to crawl the URL but this was expected to overload the site; therefore Google rescheduled the crawl. This is why the last crawl date is empty on the report." |
| Crawled – currently not indexed | "The page was crawled by Google but not indexed. Google doesn't index all pages across the web, so this is a common message for many sites and doesn't necessarily indicate an issue that needs attention." |
| Duplicate without user-selected canonical | الصفحة نسخة من أخرى ولم تُحدِّد رابطًا أساسيًّا؛ جوجل اختارت الأخرى ولن تعرض هذه. |
| Duplicate, Google chose different canonical than user | حدّدتَ رابطًا أساسيًّا وجوجل رأت غيره أصلح، ففهرست ما اختارته. |
| Soft 404 | صفحة تقول «غير موجود» لكنها تردّ 200. المطلوب ردّ 404 حقيقي. |

**الفرق عن مهارة المالك:** مهارته تقول إن «Crawled» حكمٌ على جودة المحتوى، وإن «Discovered» سببها أولوية منخفضة. نص جوجل أهدأ: الأولى «شائعة ولا تعني بالضرورة مشكلة»، والثانية سببها المذكور تجنّب إثقال الموقع. تفسير المالك خبرة ميدانية، لا نص رسمي.

## 21) ترخيص الخطوط المفتوحة على الويب (SIL OFL 1.1)
المصدر: `openfontlicense.org/ofl-faq/` (آخر تحديث 9 نوفمبر 2026). التطبيق على خطوطنا: [arabic-fonts.md](arabic-fonts.md).
- استعمال الخط بـ`@font-face` واستضافته مع ملفات الموقع مسموحان (2.1).
- WOFF2 بلا تغيير في بيانات الخط ليس تعديلًا (2.2.1).
- "Removing any parts of the font when delivering a webfont to a browser, including unused glyphs and smart font code, is considered modification. This is permitted by the OFL but would not normally allow the use of RFNs." (2.6)
- الاسم المحجوز (Reserved Font Name) لا تحمله نسخة معدّلة إلا باتفاق مكتوب مع صاحب الحقوق (5.8).
**لم أقرأ** الورقة المفصّلة «Webfonts and Reserved Font Names».

## ما لم أتحقق منه (لا تعتمد عليه من هذا الملف)
- **المعايير البصرية والتصميمية**: لا يوجد لها معيار رسمي. ما جُمع عنها بحث وقياس في [luxury-ux-research.md](luxury-ux-research.md)، وهو اتجاه لا معيار.
- **الخطوط العربية**: الوزن والترخيص والتغطية قيست لـ12 عائلة ([arabic-fonts.md](arabic-fonts.md)). **المقروئية** لم تُختبر مع أشخاص، والشكل على جوال حقيقي لم يُرَ.
- **قانون حماية البيانات وإشعار الكوكيز** في بلد النشاط: لم يُبحث.
- **Lindgaard وآخرون 2006** («50 مللي ثانية») و **Pracejus وآخرون 2006** (الفراغ الأبيض): تأكدتُ من وجود المرجعين بالبحث فقط؛ لم أقرأهما.
- **دعم المتصفحات لميزات CSS الحديثة**: بُحث لميزتين فقط (البند 17)؛ جدول الإصدارات لكل متصفح لم يُستخرج.
- **Google Business Profile**: القواعد في البند 15 فُتحت من المصدر. طريقة التوثيق وأهلية نشاط بلا سجل تجاري: لم تُبحثا.
- **تاريخ إلغاء HowTo**: لاحظتُ أنه غير موجود في قائمة ميزات البيانات المهيكلة الحالية؛ التاريخ (سبتمبر 2023) من مصادر غير رسمية.
- **توثيق إصدارات الأدوات في البند 8**.
- **أحجام البحث** لكل عبارة: لا مصدر عندي. الإكمال التلقائي يثبت أن العبارة تُكتب، لا كم مرة.
