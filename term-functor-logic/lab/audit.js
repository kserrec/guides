// audit.js — D1 acceptance harness. Run with: node audit.js [-v]
//
// Drives every formula printed by the four TFL curricula (syntax boxes and
// <code> snippets) through the parser, A7-style. Each snippet is classified:
//
//   prop     the whole snippet is one TFL proposition
//   term     the whole snippet is one TFL term
//   signed   a signed term mention (+T, −wise, ±Socrates*, −(Head+Horse))
//   algebra  a premise-sum / cancellation display: top-level sum of terms,
//            groups and 0 ("−Dog + Mortal + (−Mammal + Mammal)")
//   multi    several of the above joined by argument punctuation
//            (∴ = ≡ ⊢ , ; · ✗ "and" "infer" …), every part of which parses
//   foreign  not lab notation: MPL formulas, English mentions, schematic
//            placeholders, truth-tree diagrams, prose
//   skip     hand-verified snippets whitelisted below with a reason
//
// Anything else is a FAILURE and exits nonzero: either the parser regressed
// or the curricula started printing notation the lab can't read.

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseProposition, parseTerm, parseSignedTerm } = require('./tfl.js');

const VERBOSE = process.argv.includes('-v');
const BASE = path.join(__dirname, '..');
const COURSES = ['introduction', 'language-extended', 'relational-syllogisms', 'statement-logic-and-mpl'];

// ── Whitelist: hand-verified snippets needing an explicit reason ────────
const SKIP = new Map(Object.entries({
  // The course's non- prefix for negated relation terms. The lab always
  // reads - as the minus functor, so this WOULD parse — but as the bogus
  // relational complex (non −Lov +Woman). Lab notation is (−Lov) or a
  // quoted "non-Lov"; pinned here so the misparse stays visible.
  '−Man−(non-Lov+Woman)': 'non- prefix would misparse; lab notation is (−Lov) or a quoted term',
}));

// ── Snippet extraction (same strings the course pages render) ────────────

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ').replace(/&ensp;/g, ' ').replace(/&emsp;/g, ' ')
    .replace(/&thinsp;/g, ' ').replace(/&minus;/g, '−').replace(/&times;/g, '×')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, (m) => String.fromCodePoint(+m.slice(2, -1)));
}

function extract(course) {
  const helpers = fs.readFileSync(path.join(BASE, 'tfl-helpers.js'), 'utf8');
  const src = fs.readFileSync(path.join(BASE, course, 'curriculum.js'), 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${helpers}\n${src}\nthis.__C = CURRICULUM;`, ctx);
  const snippets = new Set();
  (function walk(v) {
    if (typeof v === 'string') {
      for (const re of [/<div class="syntax-box[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
                        /<code[^>]*>([\s\S]*?)<\/code>/g]) {
        let m;
        while ((m = re.exec(v))) {
          const text = decodeEntities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
          if (text) snippets.add(text);
        }
      }
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  })(ctx.__C);
  return [...snippets];
}

// ── Classification ───────────────────────────────────────────────────────

const parses = (fn, s) => { try { fn(s); return true; } catch { return false; } };

// Split a display string into top-level summands (before each sign that
// sits outside all parens/brackets): "−Dog + Mortal + 0" → −Dog | +Mortal | +0.
function summands(s) {
  const pieces = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (depth < 0) return null;
    if (depth === 0 && '+-−±'.includes(ch) && cur.trim()) {
      pieces.push(cur.trim());
      cur = ch;
    } else cur += ch;
  }
  if (cur.trim()) pieces.push(cur.trim());
  return depth === 0 ? pieces : null;
}

// A cancellation-algebra display: 2+ top-level summands, each a signed term,
// a bare term (first position), or the courses' literal 0.
function isSum(s) {
  const pieces = summands(s);
  if (!pieces || pieces.length < 2) return false;
  return pieces.every((p, i) => {
    if (/^[+\-−±]/.test(p)) {
      const body = p.slice(1).trim();
      return body === '0' || parses(parseSignedTerm, p);
    }
    return i === 0 && (p === '0' || parses(parseTerm, p));
  });
}

// One displayable unit of lab notation. English word mentions ("non-wise",
// "warm-blooded") are excluded before the sum check: they contain no formula
// characters beyond the ASCII hyphen, which would otherwise read as a sum
// of terms (non − wise).
function unit(s) {
  if (parses(parseProposition, s)) return 'prop';
  if (parses(parseTerm, s)) return 'term';
  if (parses(parseSignedTerm, s)) return 'signed';
  if (!/[+−±()[\]^]/.test(s)) return null;
  if (isSum(s)) return 'algebra';
  return null;
}

// Argument/derivation punctuation and words that join formulas in displays.
const SEPARATORS = /∴|⊢|⊬|≡|=|·|;|,|\?\?|✗|—|–|→|\b(?:and|infer)\b/g;

// Marks of other notations or prose (ASCII - deliberately not listed: it is
// the minus functor; word mentions like non-wise are caught by the
// no-formula-characters rule below).
const FOREIGN = new RegExp([
  '[∀∃¬→∧∨↔⊥×≠∓{}λ\\\\?]',          // MPL / set / schema symbols
  '[a-z]\\(',                        // predicate application: Dog(x)
  '\\.\\.\\.', '…',
  '\\b(?:and|or|is|are|the|of|if|then|iff|xor|all|no|some|every|closes|open',
  '|wait|tacit|given|tree|contradiction|impossible|contradicts|sign|quantity',
  '|quality|subject|singular|wild|Barbara|Celarent|Darii|Ferio)\\b',
].join('|'), 'iu');

function classify(raw) {
  // Proof-line numbering ("4. ±Boy'+(Lov±Girl')") is display dressing.
  const s = raw.replace(/^\d+\.\s*/, '').trim();

  if (SKIP.has(s)) return { kind: 'skip', reason: SKIP.get(s) };

  const u = unit(s);
  if (u) return { kind: u };

  // English word mentions: no formula characters beyond the ASCII hyphen
  // ("prime number", "non-wise", "John loves Mary", "8 contradicts 9").
  if (!/[+−±()[\]^]/.test(s)) return { kind: 'foreign' };

  // Multi-formula displays: if separators are present, every part must be
  // a unit or the courses' literal 0.
  const parts = s.split(SEPARATORS).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 0 && parts.join('') !== s.replace(/\s+/g, '') &&
      parts.every((p) => p === '0' || unit(p.replace(/^\d+\.\s*/, '')))) {
    return { kind: 'multi' };
  }

  if (FOREIGN.test(s)) return { kind: 'foreign' };
  if (!/\p{L}/u.test(s)) return { kind: 'foreign' }; // lone punctuation mentions

  return { kind: 'FAIL' };
}

// ── Report ───────────────────────────────────────────────────────────────

let totalFail = 0, grand = { snippets: 0, parsed: 0 };
for (const course of COURSES) {
  const snippets = extract(course);
  const counts = { prop: 0, term: 0, signed: 0, algebra: 0, multi: 0, foreign: 0, skip: 0, FAIL: 0 };
  const failures = [];
  for (const s of snippets) {
    const { kind, reason } = classify(s);
    counts[kind]++;
    if (kind === 'FAIL') failures.push(s);
    if (VERBOSE && kind !== 'foreign') console.log(`  [${kind}] ${s}${reason ? ` — ${reason}` : ''}`);
  }
  const parsed = counts.prop + counts.term + counts.signed + counts.algebra + counts.multi;
  grand.snippets += snippets.length;
  grand.parsed += parsed;
  console.log(`${course}: ${snippets.length} snippets — ${parsed} parsed ` +
    `(${counts.prop} prop, ${counts.term} term, ${counts.signed} signed, ` +
    `${counts.algebra} algebra, ${counts.multi} multi), ` +
    `${counts.foreign} foreign, ${counts.skip} whitelisted, ${counts.FAIL} FAILED`);
  for (const f of failures) console.log(`  ✗ ${JSON.stringify(f)}`);
  totalFail += counts.FAIL;
}

console.log(`\ntotal: ${grand.parsed}/${grand.snippets} snippets parsed as lab notation`);
if (totalFail > 0) {
  console.error(`${totalFail} unexplained snippet(s) — fix the parser or whitelist with a reason.`);
  process.exit(1);
}
console.log('All curriculum snippets accounted for.');
