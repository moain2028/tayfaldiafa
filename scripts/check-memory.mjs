#!/usr/bin/env node
// Checks that the project's memory files are present, linked and dated consistently.
// It verifies structure only. It cannot tell whether what the files say is true.
// Usage: node scripts/check-memory.mjs   (exit 0 = ok, 1 = errors)
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const STANDARDS_MAX_AGE_DAYS = 90;
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro', '.next', '.vercel', '.wrangler']);

const REQUIRED = [
  'AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'README.md', 'STATUS.md', 'LESSONS.md', 'CHANGELOG.md',
  'docs/FACTS.md', 'docs/research/standards.md', 'docs/research/inherited-lessons.md',
  'docs/research/reference-sites.md', 'docs/design/architecture.md',
  'docs/runbooks/session-handoff.md', 'docs/adr/0000-template.md',
];

const read = (p) => readFileSync(join(root, p), 'utf8');
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const today = new Date().toISOString().slice(0, 10);

function frontMatter(path) {
  const m = read(path).match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*([^#]*)/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function datedField(path, field) {
  const value = frontMatter(path)[field];
  if (!value) { errors.push(`${path}: missing front matter field "${field}"`); return null; }
  if (!isDate(value)) { errors.push(`${path}: "${field}: ${value}" is not a YYYY-MM-DD date`); return null; }
  if (value > today) { errors.push(`${path}: "${field}: ${value}" is in the future (today is ${today})`); return null; }
  return value;
}

function markdownFiles(dir = root) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...markdownFiles(full));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

// 1. Required files
for (const p of REQUIRED) if (!existsSync(join(root, p))) errors.push(`missing required file: ${p}`);

if (errors.length === 0) {
  // 2. Dates
  const statusDate = datedField('STATUS.md', 'updated');
  datedField('docs/FACTS.md', 'updated');
  const standardsDate = datedField('docs/research/standards.md', 'verified');

  // 3. Session log exists and is not older than STATUS
  const sessionsDir = join(root, 'docs/sessions');
  const sessions = existsSync(sessionsDir)
    ? readdirSync(sessionsDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).map((f) => f.slice(0, 10)).sort()
    : [];
  if (sessions.length === 0) errors.push('docs/sessions/: no session log (expected YYYY-MM-DD.md)');
  else {
    const latest = sessions[sessions.length - 1];
    if (latest > today) errors.push(`docs/sessions/${latest}.md is dated in the future (today is ${today})`);
    if (statusDate && statusDate > latest) {
      errors.push(`STATUS.md updated ${statusDate} but the latest session log is ${latest}: add a session entry`);
    }
    if (statusDate && latest > statusDate) {
      errors.push(`session log ${latest} is newer than STATUS.md (${statusDate}): update STATUS.md`);
    }
  }

  // 4. Standards age
  if (standardsDate) {
    const age = Math.floor((Date.parse(today) - Date.parse(standardsDate)) / 86400000);
    if (age > STANDARDS_MAX_AGE_DAYS) {
      warnings.push(`docs/research/standards.md was verified ${age} days ago: re-open the sources before relying on it`);
    }
  }

  // 5. ADR status values
  const adrDir = join(root, 'docs/adr');
  for (const f of readdirSync(adrDir).filter((n) => /^\d{4}-.*\.md$/.test(n) && !n.startsWith('0000'))) {
    const status = frontMatter(`docs/adr/${f}`).status || '';
    if (!/^(proposed|accepted|rejected|superseded by \d{4})$/.test(status)) {
      errors.push(`docs/adr/${f}: status "${status}" must be proposed | accepted | rejected | superseded by NNNN`);
    }
  }

  // 6. Relative Markdown links resolve
  for (const file of markdownFiles()) {
    const rel = relative(root, file).split(sep).join('/');
    const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|tel:|#)/.test(target)) continue;
      const pathPart = decodeURIComponent(target.split('#')[0]);
      if (!pathPart) continue;
      if (!existsSync(resolve(dirname(file), pathPart))) errors.push(`${rel}: broken link -> ${target}`);
    }
  }
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`check-memory: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
