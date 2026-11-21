# Runbook: بداية الجلسة ونهايتها
**متى:** كل جلسة عمل، بلا استثناء · **المدة المتوقعة:** دقائق في البداية ومثلها في النهاية · **الصلاحيات:** push إلى `main`

## بداية الجلسة
1. `git pull` ثم `node scripts/check-memory.mjs`. إن فشل: أصلح الذاكرة قبل أي شيء آخر.
2. اقرأ بالترتيب المكتوب في [AGENTS.md](../../AGENTS.md).
3. قارن ما تقوله STATUS بالواقع: `git log --oneline -10` و `git status`. إن اختلفا فالواقع هو الصحيح؛ صحّح STATUS وسجّل الفرق.
4. إن كان الطلب يحتاج معلومة «مجهولة» في FACTS: اسأل المالك أولًا.

## نهاية الجلسة
1. [STATUS.md](../../STATUS.md): حدّث «قيد العمل»، «معطّل»، «تم مؤخرًا»، وتاريخ `updated`.
2. `docs/sessions/YYYY-MM-DD.md` (أضف قسمًا إن وُجد الملف) بهذه العناوين:
   - **الطلب** — ما طلبه المالك.
   - **ما أُنجز**
   - **ما تُحقق منه وكيف** — الأمر ونتيجته.
   - **ما لم يُتحقق منه**
   - **مفتوح للجلسة القادمة**
   - **لم يُحفظ** — أي تغيير لم يدخل commit أو لم يُدفع.
3. [CHANGELOG.md](../../CHANGELOG.md). و FACTS / LESSONS / ADR / standards إن تغيّر ما يخصها.
4. `node scripts/check-memory.mjs`
5. `git add -A && git commit` ثم `git push origin main`.

## التحقق من النجاح
`git status` نظيف، و `git rev-parse HEAD` يساوي `git ls-remote origin refs/heads/main`.

## التراجع (Rollback)
إن فشل الـpush: لا force-push. `git pull --rebase` ثم أعد المحاولة. إن بقي فاشلًا: اكتب في ردّك للمالك ما الذي لم يُحفظ بالضبط.
