# المساهمة
- الفرع: `main` (الفرع المربوط بالمشروع). لا force-push.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) — `feat: …` `fix: …` `docs: …`
- قبل كل commit: `node scripts/check-memory.mjs`، وعند وجود كود: البناء والاختبارات خضراء **قبل** الـpush.
- تعريف «مكتمل»: كود + اختبار + توثيق + [STATUS.md](STATUS.md) محدّث + مدخل في [docs/sessions/](docs/sessions/).
- Pull request فقط حين يطلبه المالك؛ القالب في [.github/pull_request_template.md](.github/pull_request_template.md).
