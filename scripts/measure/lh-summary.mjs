// Summarise Lighthouse JSON reports named <site>-<n>.json: median of the runs per site.
// Usage: node lh-summary.mjs <dirWithJson> [summary.json]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const [dir, outFile] = process.argv.slice(2);
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const sites = {}; let meta = null;
for (const f of readdirSync(dir).filter((n) => /-\d+\.json$/.test(n)).sort()) {
  const d = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); const site = f.replace(/-\d+\.json$/, '');
  if (d.runtimeError) { console.log(`${f}: runtime error ${d.runtimeError.code}`); continue; }
  meta ??= { lighthouse: d.lighthouseVersion, formFactor: d.configSettings.formFactor, throttling: d.configSettings.throttlingMethod, cpuSlowdown: d.configSettings.throttling.cpuSlowdownMultiplier };
  const a = d.audits, c = d.categories, pct = (k) => Math.round(c[k].score * 100);
  const failing = ['accessibility', 'best-practices', 'seo'].flatMap((k) => c[k].auditRefs.filter((r) => a[r.id].score !== null && a[r.id].score < 1).map((r) => r.id));
  (sites[site] ??= []).push({ perf: pct('performance'), a11y: pct('accessibility'), bp: pct('best-practices'), seo: pct('seo'),
    fcpMs: Math.round(a['first-contentful-paint'].numericValue), lcpMs: Math.round(a['largest-contentful-paint'].numericValue),
    tbtMs: Math.round(a['total-blocking-time'].numericValue), cls: +a['cumulative-layout-shift'].numericValue.toFixed(3),
    kb: Math.round(a['total-byte-weight'].numericValue / 1024), benchmarkIndex: d.environment?.benchmarkIndex ?? null, failing });
}
const summary = { meta, sites: {} };
console.log(JSON.stringify(meta));
console.log('site'.padEnd(16), 'runs perf(all)        med  a11y bp  seo  FCPs LCPs  TBTms CLS   KB   bench');
for (const [site, rs] of Object.entries(sites)) {
  const m = (k) => median(rs.map((r) => r[k]));
  summary.sites[site] = { runs: rs.length, perfRuns: rs.map((r) => r.perf), lcpMsRuns: rs.map((r) => r.lcpMs), tbtMsRuns: rs.map((r) => r.tbtMs),
    median: { perf: m('perf'), a11y: m('a11y'), bp: m('bp'), seo: m('seo'), fcpMs: m('fcpMs'), lcpMs: m('lcpMs'), tbtMs: m('tbtMs'), cls: m('cls'), kb: m('kb') },
    benchmarkIndex: rs.map((r) => r.benchmarkIndex), failing: [...new Set(rs.flatMap((r) => r.failing))] };
  console.log(site.padEnd(16), String(rs.length).padEnd(4), JSON.stringify(rs.map((r) => r.perf)).padEnd(17), String(m('perf')).padEnd(4), String(m('a11y')).padEnd(4), String(m('bp')).padEnd(3), String(m('seo')).padEnd(4),
    (m('fcpMs') / 1000).toFixed(1).padEnd(4), (m('lcpMs') / 1000).toFixed(1).padEnd(5), String(m('tbtMs')).padEnd(5), String(m('cls')).padEnd(5), String(m('kb')).padEnd(4), JSON.stringify(rs.map((r) => Math.round(r.benchmarkIndex))));
}
if (outFile) writeFileSync(outFile, JSON.stringify(summary, null, 1));
