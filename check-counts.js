// check-counts.js — verify the hardcoded lesson/course counts in the HTML
// pages against the actual curricula. Run with: node check-counts.js
// Exits nonzero if any count has drifted (run after adding a lesson/course).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = __dirname;

const SUBJECTS = {
  'lambda-calculus': ['foundations', 'under-the-hood'],
  'term-functor-logic': ['introduction', 'language-extended', 'relational-syllogisms', 'statement-logic-and-mpl'],
};

// TFL curricula call helpers from tfl-helpers.js at load time.
const TFL_HELPERS = fs.readFileSync(path.join(ROOT, 'term-functor-logic/tfl-helpers.js'), 'utf8');

function lessonCount(subject, course) {
  const src = fs.readFileSync(path.join(ROOT, subject, course, 'curriculum.js'), 'utf8');
  const prelude = subject === 'term-functor-logic' ? TFL_HELPERS + '\n' : '';
  const curriculum = vm.runInContext(prelude + src + '\n;CURRICULUM', vm.createContext({}));
  return curriculum.lessons.length;
}

let failures = 0;
function check(what, actual, expected) {
  if (actual === expected) {
    console.log(`ok: ${what} = ${expected}`);
  } else {
    failures++;
    console.error(`DRIFT: ${what} — page says ${actual}, curricula say ${expected}`);
  }
}

const counts = {};
for (const [subject, courses] of Object.entries(SUBJECTS)) {
  counts[subject] = Object.fromEntries(courses.map((c) => [c, lessonCount(subject, c)]));
}

// Course cards on the subject hub pages: first number of the tag ("15 lessons",
// "2 of 6 lessons") must match that course's lesson count.
for (const [subject, courses] of Object.entries(SUBJECTS)) {
  const html = fs.readFileSync(path.join(ROOT, subject, 'index.html'), 'utf8');
  for (const course of courses) {
    const m = html.match(new RegExp(
      `href="${course}/index\\.html"[^>]*>\\s*<div class="course-card-tag">(\\d+)(?: of \\d+)? lessons?<`));
    if (!m) { failures++; console.error(`DRIFT: no course-card tag found for ${subject}/${course}`); continue; }
    check(`${subject}/index.html → ${course}`, Number(m[1]), counts[subject][course]);
  }
}

// Subject cards on the home page: "N courses · M lessons".
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const [subject, courses] of Object.entries(SUBJECTS)) {
  // Anchor to the card itself — the top nav links the same hrefs.
  const m = home.match(new RegExp(
    `href="${subject}/index\\.html" class="subject-card[\\s\\S]*?<div class="subject-card-tag">(\\d+) courses? · (\\d+) lessons?<`));
  if (!m) { failures++; console.error(`DRIFT: no subject-card tag found for ${subject}`); continue; }
  const total = Object.values(counts[subject]).reduce((a, b) => a + b, 0);
  check(`index.html → ${subject} courses`, Number(m[1]), courses.length);
  check(`index.html → ${subject} lessons`, Number(m[2]), total);
}

console.log(failures ? `${failures} count(s) out of date` : 'all counts match');
process.exit(failures ? 1 : 0);
