# Ham Calculus — Project Roadmap

Last updated: 2026-07-03

## Step-sizing rule

Every step below is scoped so a single agent prompt (Sonnet-5-class model) can execute
it reliably end-to-end: one coherent deliverable, bounded file surface, verifiable on
completion. If a step grows beyond that during execution, split it before starting.

---

## Current state (evaluated 2026-07-03)

### What exists

| Area | Status |
|---|---|
| Shared engine (`engine.js`, 381 lines) | ✅ Data-driven renderer; 2 exercise kinds (`valid-or-invalid`, `multiple-choice`); localStorage progress |
| Shared styles (`style.css`, 1062 lines) | ✅ Single-column, max-width 720px, light theme, per-subject accent overrides |
| Lambda Calculus: Foundations | ✅ 15 lessons |
| Lambda Calculus: Under the Hood | ✅ 8 lessons |
| TFL: Introduction | ✅ 8 lessons |
| TFL: The Full Language | ✅ 7 lessons |
| TFL: Relational Syllogisms (Course 3) | 🔲 planned in `term-functor-logic/ROADMAP.md` |
| TFL: Statement Logic & MPL (Course 4) | 🔲 planned in `term-functor-logic/ROADMAP.md` |

### Strengths

- Clean separation of engine vs. curriculum data; adding lessons/courses requires no engine changes.
- No build step, no dependencies — trivially deployable anywhere.
- Curriculum quality is high: concept → quick-check → review cadence, explanations on every item.

### Gaps / debt

1. **No version control.** Not a git repo. Highest-priority fix — everything else builds on it.
2. **No interactive evaluation.** All exercises are choose-an-answer; learners can't *write*
   lambda terms and see them reduce. (Addressed by Track A below.)
3. **No tests** for `engine.js`. Tolerable now; the Lambda Lab engine (Track A) must have them,
   since an incorrect reducer teaches wrong lessons.
4. Minor inconsistencies: hub back-links differ ("← Ham Calculus" vs "← All Subjects");
   lesson-count tags on hub cards are hardcoded; home page is a bare hero; stray `.DS_Store` files.

---

## Track A — Lambda Lab (side editor for arbitrary lambda calculus)

Goal: a collapsible panel alongside both lambda calculus courses where the user writes
arbitrary lambda calculus (with named definitions), runs it, and watches normal-order
reduction step by step with the active redex highlighted.

Architecture: pure-logic module `lambda-calculus/lab/lambda.js` (no DOM; node-testable),
UI module `lambda-calculus/lab/lab.js`, styles appended to `style.css`, tests in
`lambda-calculus/lab/lambda.test.js` run with plain `node`.

### A1. Parser core ✅
`lambda-calculus/lab/lambda.js` + `lambda.test.js`.
- AST: `Var`, `Lam`, `App`.
- Tokenizer/parser: accept both `λ` and `\`; multi-arg sugar `λx y.M` / `λxy.M` (single-letter
  run splitting only when unambiguous — decide and document); application left-associative;
  abstraction body extends maximally right; parens.
- Parse errors carry position + message.
- Pretty-printer emitting minimal parentheses; round-trip property (parse ∘ print = id) in tests.
- Plain-assert tests runnable via `node lambda.test.js`.

### A2. Evaluator ✅
Extend `lambda.js` + tests.
- Free variables; capture-avoiding substitution with fresh-name generation (`x` → `x'`).
- Single-step **normal-order** reduction returning the new term plus the path of the reduced
  redex (for later highlighting); `null` at normal form.
- `reduce(term, {maxSteps})` → `{steps: [...], status: 'normal' | 'fuel-exhausted'}`.
- Alpha-equivalence predicate (needed for tests now, exercise-checking later).
- Tests: Church arithmetic (`PLUS 2 3 → 5` shape), Ω hits the fuel limit, classic capture cases.

### A3. Definitions & readback ✅
Implementation notes (decisions made during the cross-check):
- Course names differ from the original sketch: `ADD` (not PLUS), `IS_NIL` (not ISNIL);
  the course defines **no IF or TAIL** — prelude matches the course exactly, including
  `SHIFT`, `FACT/DIV/MOD/RANGE` with their `_STEP` helpers, `ANY ALL LENGTH SUM FLATTEN`.
- Digit literals (`0`, `1`, `42`) are built-in names for Church numerals, expanded on demand
  (the course uses them in definitions, e.g. `PRED`). They cannot be λ-parameters.
- Programs use the offside rule: indented lines continue a statement; `--` comments.
- User definitions may shadow the prelude (needed for Under the Hood's Scott encodings) with
  a warning; self-reference errors suggest Y; forward references are errors.
- Readback: numerals, TRUE, pairs `⟨a, b⟩`, fold-lists `[1, 2]`; `λa.λb.b` reads back as
  `0 ≡ FALSE ≡ NIL` (the course's own pun).
- Fuel data for A5: FACT 3 ≈ 1.5k betas, FACT 5 ≈ 78k — the UI needs a "keep going" action.

### A4. Panel layout ✅
Implemented as a fixed right panel (400px) rather than a grid rework: opening it adds
`padding-right` to the body on ≥1200px screens (content re-centers in the remaining space);
below that it's a slide-over. Floating "λ Lab" toggle button; open state in localStorage;
styles scoped under `.lab*` classes; TFL pages untouched (no markup there).
Verified via headless-Chrome screenshots at 1440px and 420px.

### A5. Editor wire-up ✅
As specced: trace opt-in behind "Show steps" (renders lazily, capped at 200 lines), δ steps
mark the expanding name, β steps mark the firing redex via `printHtml` (pure, in lambda.js,
unit-tested). Fuel exhaustion offers "Keep going ×10"; `\`→λ preserves cursor; buffer keyed
by pathname in localStorage. Deferred to A7: caret-position display under parse errors.

### A6. Lesson integration ✅
Implemented with zero engine.js/curriculum changes: lab.js watches `#stage` with a
MutationObserver and adds a "▸ try" chip to every `.syntax-box` whose text parses as a
valid lab program (schematics/tables fail the parse and are skipped automatically).
Clicking a chip opens the lab, loads, and runs. Examples dropdown curated per course
(8 for Foundations, 4 for Under the Hood). Verified headlessly incl. the observer path.

### A7. Verification & polish 🔲
Audit already run (2026-07-03, all 91 syntax boxes through the engine): Foundations 43/50
runnable with zero fuel issues; Under the Hood 16/41 (skips are all correct — schematics,
pseudocode, deliberate non-definitions). Remaining worklist:
- Identifiers should accept Unicode letters other than λ — the courses use `ω`/`Ω` as names
  (`ω = λx.x x` currently fails to parse). Add course-faithful `ω`/`Ω` prelude entries.
- Error-caret display under parse errors (deferred from A5).
- Mobile pass: slide-over usability, keyboard behavior.
- After completion: publish via GitHub Pages (user-approved; repo must go public first).

### A8 (future, optional). `write-expression` exercise kind
Reuse the A1–A3 engine to power free-input exercises checked by alpha/beta equivalence.
Big pedagogical win; deliberately out of scope until the lab is stable.

---

## Track B — TFL Courses 3 & 4

Lesson-level content plan lives in `term-functor-logic/ROADMAP.md` (source: Sommers &
Englebretsen, *An Invitation to Formal Reasoning*). Steps here are execution-sized:

- **B1** 🔲 Scaffold Course 3 (`relational-syllogisms/`: index.html, curriculum skeleton, hub card) + write Lesson 1 (Dictum applied to relational arguments).
- **B2** 🔲 Lesson 2 (Distributed terms and DDO).
- **B3** 🔲 Lesson 3 (Indirect proofs and distributed proterms).
- **B4** 🔲 Scaffold Course 4 (`statement-logic-and-mpl/`) + Lesson 1 (Contradictions, tautologies, contingency).
- **B5–B9** 🔲 Lessons 2–6, one per step (see TFL roadmap for chapter mappings).

Resolve the open questions listed at the bottom of the TFL roadmap (REGAL acronym,
commutation/association laws placement) as they come up in the relevant lesson's step.

---

## Track C — Housekeeping

- **C1** ✅ `git init`, add `.gitignore` (`.DS_Store`), remove stray `.DS_Store` files, initial commit.
- **C2** ✅ Consistency pass: unify hub back-link labels, real home page content (subject cards
  instead of bare hero), verify lesson-count tags.

---

## Suggested order

1. **C1** (version control before anything else)
2. **A1 → A2 → A3** (lab engine, testable without UI)
3. **A4 → A5** (lab usable end-to-end)
4. **A6 → A7** (integration + polish)
5. **B1–B9** interleaved as desired — Track B is independent of Track A
6. **C2** anytime
