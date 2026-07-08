# Ham Calculus — Architecture & Developer Guide

This document is the owner's manual for the repository. It explains what the site is, how
it is built and deployed, how every layer works — from the page shells down to the lambda
calculus evaluator — and how to do the common jobs (add a lesson, add a course, add an
exercise kind) without breaking anything. After reading it you should be able to explain
the system to someone else and work on it as if you wrote it.

Live site: **https://kserrec.github.io/guides/** — GitHub Pages, served straight from
`main`. A push deploys in about a minute. There is no build step, no bundler, no
`package.json`, and no runtime dependency beyond a browser. Node is used only for
dev-time scripts (test suites, acceptance/fuzz harnesses, and a count checker — see §9).

---

## 1. What the site is

Ham Calculus is a set of interactive, Duolingo-style courses on formal systems. There are
currently two **subjects**, each containing **courses**, each containing **lessons**:

- **Lambda Calculus** (blue theme, `lambda-calculus/`)
  - *Foundations* — 15 lessons: syntax, beta reduction, Church encodings (booleans,
    numerals, pairs, lists), the Y combinator.
  - *Under the Hood* — 8 lessons: evaluation strategies, Scott encodings, CPS, combinators.
  - Plus the **Lambda Lab**: a live editor/evaluator panel available on both course pages.
- **Term Functor Logic** (purple theme, `term-functor-logic/`) — an algebraic treatment of
  Aristotelian logic, sourced from Sommers & Englebretsen, *An Invitation to Formal
  Reasoning* (2000). Four courses, all complete (25 lessons total): *Introduction* (8),
  *The Full Language* (7), *Relational Syllogisms* (3), *Statement Logic and the MPL
  Bridge* (7). A TFL analog of the Lambda Lab — a term-logic programming language and
  Aristotelian database — is Track D in `ROADMAP.md` and is **complete**: a node-tested
  engine (parser, printer, inference, validity, the program/query layer, the natural-language
  Aristotelian layer, and the TFL⁺ numerical decision method), the lab UI (a slide-over panel
  on the course pages plus a standalone page at `term-functor-logic/lab/`), "▸ try" chips on
  lesson syntax boxes, an engine-graded free-input `tfl-expression` exercise kind, and — in
  Statement Logic Lesson 6 — an intermediate-quantifier lesson (most/many/few) that the lab
  runs live.

A lesson is a linear sequence of **blocks** that reveal one at a time: a *concept* block
teaches (prose + examples), then an *exercise* block checks it, repeating in a
concept → quick-check cadence and usually ending with a Final Review exercise. Progress
(which lessons you've completed) lives in the browser's localStorage — there is no backend
of any kind.

## 2. Repository layout

```
guides/
├── index.html                     Home page: hero + one card per subject (static HTML)
├── style.css                      All shared styles (~1606 lines, section-commented)
├── engine.js                      The course runtime: renders CURRICULUM, manages state
├── engine.test.js                 Unit tests for the runtime (node + a tiny DOM stub)
├── check-counts.js                Dev script: verifies hardcoded lesson counts (node)
├── ROADMAP.md                     Project-level roadmap and step log (tracks A–D)
├── ARCHITECTURE.md                This document
│
├── lambda-calculus/
│   ├── index.html                 Subject hub: one card per course (static HTML)
│   ├── foundations/
│   │   ├── index.html             Course page shell (empty #stage, script tags)
│   │   └── curriculum.js          All 15 lessons as one big CURRICULUM object
│   ├── under-the-hood/            Same pair of files
│   └── lab/
│       ├── lambda.js              Lambda Lab core: parser/evaluator/prelude — pure, no DOM
│       ├── lambda.test.js         153 plain-assert tests: `node lambda.test.js`
│       ├── lab.js                 Lambda Lab panel UI (DOM only, no logic)
│       └── write-exercise.js      Registers the 'write-expression' exercise kind
│
└── term-functor-logic/
    ├── index.html                 Subject hub
    ├── tfl-theme.css              Purple accent overrides (8 CSS variables)
    ├── tfl-helpers.js             Template helpers (syl, engSyl, mcPrompt) for curricula
    ├── ROADMAP.md                 Book→course mapping and per-lesson plan for TFL
    ├── introduction/              index.html + curriculum.js
    ├── language-extended/         (course dir names are URL slugs, not display names)
    ├── relational-syllogisms/
    ├── statement-logic-and-mpl/
    └── lab/                       TFL Lab (Track D; live as of D6)
        ├── tfl.js                 Parser/printer + inference core + grading — pure, no DOM
        ├── lab.js                 Panel + full-page UI (loads on course pages and lab/)
        ├── tfl-exercise.js        Registers the 'tfl-expression' exercise kind (TFL pages)
        ├── index.html             Standalone full-page lab
        ├── tfl.test.js            Plain-assert tests: `node tfl.test.js`
        ├── oracle.js              Finite-model semantics + fuzz harness (node-only)
        └── audit.js               Drives every curriculum formula through the parser
```

Three tiers of page, all plain HTML files linked by relative paths:

1. **Home** (`/index.html`) — fully static, subject cards with hardcoded course/lesson
   counts in the card tags.
2. **Subject hubs** (`<subject>/index.html`) — fully static, course cards, also with
   hardcoded lesson counts.
3. **Course pages** (`<subject>/<course>/index.html`) — a shell with an empty
   `<nav id="lesson-nav">` and `<main id="stage">`; everything inside is rendered by
   JavaScript at load.

The hardcoded counts on tiers 1–2 are the one piece of intentional duplication; see
§9 (`check-counts.js`) for how drift is caught.

## 3. The course runtime (`engine.js`)

The whole interactive experience is one file, ~515 lines, no framework. A course page
loads scripts in this order (order matters — see §10):

```html
<script src="curriculum.js"></script>      <!-- defines global CURRICULUM -->
<script src="../../engine.js"></script>     <!-- reads it, boots CourseApp -->
<!-- lambda pages additionally load lambda.js, lab.js, write-exercise.js -->
```

`curriculum.js` defines a single global `const CURRICULUM = {...}`. On `DOMContentLoaded`,
engine.js constructs `new CourseApp(CURRICULUM)`, which:

- Writes the curriculum's `title`/`subtitle` into `#site-title`/`#site-subtitle`.
- Renders the lesson list into `#lesson-nav` (with a ✓ on completed lessons).
- Renders lesson 0 into `#stage`.

**Rendering model.** `renderLesson()` builds a DOM element for every block up front, gives
all of them the `block--hidden` class, then reveals block 0. Each concept block ends in a
"Continue →" button; each exercise completes when all its items are answered (or is
skipped via "Skip →"). Either path calls `advance(index)`, which unhides the next block
and smooth-scrolls to it. Past the last block, `appendLessonComplete()` renders the
completion card, records the lesson id in localStorage, and offers a "Start <next
lesson> →" button. Switching lessons via the nav just re-runs `renderLesson()` — exercise
state within a lesson is deliberately not persisted; only lesson *completion* is.

**Resilience.** Each block is built inside a `try/catch`: if one block throws (an unknown
`kind`, a missing handler, a malformed item), `buildErrorBlock` substitutes a skippable
placeholder with a Continue button, so a single authoring slip degrades one block instead
of blanking the whole lesson. localStorage reads and writes are wrapped (private-mode /
quota safe), `init()` tolerates missing header elements, and the boot is wrapped so a
missing/broken `CURRICULUM` shows a "failed to load" message rather than a blank page.

**DOM construction** uses a tiny hyperscript helper `h(tag, attrs, ...children)`
(`document.createElement` + `Object.assign`). Authored curriculum content is injected with
`innerHTML` — curriculum files are trusted, first-party code (see §8 on trust and CSP).

**Progress persistence.** Completed lesson ids are stored as a JSON array under the key
`progress-${curriculum.title}`. Consequence: the curriculum `title` string is effectively
a storage key — renaming a course title orphans users' progress for it. All localStorage
access is wrapped in try/catch so private-browsing modes degrade gracefully.

**Block types.** `buildBlock` dispatches on `block.type`:
- `concept` → title + `content` HTML + Continue button.
- `exercise` → title (with an "Exercise" or "Final Review" badge from `block.isFinal`),
  `instruction`, then the items rendered by the block's *exercise handler*, a live
  "N / M correct" score line, and the footer (Skip, then completion message + Continue).

### Exercise kinds: the plugin registry

`ExerciseHandlers` is a plain object mapping a `kind` string to
`{ render(block, exState, callbacks) → Element }`. The handler owns everything inside the
items area; the engine owns scoring, completion, and flow. The contract:

- `exState.answers` is a map from item index → the user's stored answer. A handler must
  set `exState.answers[i]` exactly once per item (answers are final — no changing after
  feedback) and then call `callbacks.onItemAnswered()`.
- Scoring: the engine counts an item correct when `exState.answers[i] === items[i].answer`
  (`countCorrect`). Handlers that grade in more complex ways (write-expression) satisfy
  this by storing the item's own `answer` string when correct and anything else when not.
- When every item has an answer, the engine shows the score and the Continue button.

Built-in kinds (in engine.js):

- **`valid-or-invalid`** — two buttons per item. Item: `{ expr | exprHtml, answer:
  'valid'|'invalid', explanation }`.
- **`multiple-choice`** — a button per choice; on answer, the correct choice is
  highlighted green and a wrong pick red. Item: `{ prompt/expr | promptHtml, choices[],
  answer: <index>, explanation, choicesAreCode? }` (`choicesAreCode: false` renders
  choices as prose instead of `<code>`). **Choices display in shuffled order** (fresh
  Fisher–Yates per render); answers are stored and scored by *authored* index, so
  `answer` needs no adjustment and authoring the correct choice first is fine. Corollary:
  a choice must never reference other choices by position ("both of the above").

Two more kinds are registered by side modules, never by engine.js — the mechanism that
keeps it subject-agnostic (see §5.3): **`write-expression`** from
`lambda-calculus/lab/write-exercise.js` (lambda pages only), and **`tfl-expression`** from
`term-functor-logic/lab/tfl-exercise.js` (TFL pages only). Both are thin registrations of
engine.js's `makeFreeInputExercise` scaffold (which owns the input/Check/retry/reveal
shell) over a pure grader in their engine module (`Lambda.checkExpression` /
`TFL.checkExpression`); the
TFL one has three modes — `transcribe` (equal up to the immediate rules),
`derive` (the conclusion from given premises), `premise` (any consistent premise that
completes the argument). Neither leaks the answer on a wrong attempt; both offer an
"open in the lab" button on finished items.

Every item of every kind carries an `explanation`, shown as feedback whether the user was
right or wrong. This is a content-quality invariant, not an engine requirement.

## 4. Curriculum data format

A curriculum file is data-as-code: one giant object literal, with HTML content in template
literals. Shape:

```js
const CURRICULUM = {
  title: "Lambda Calculus",          // page header + localStorage progress key
  subtitle: "An interactive …",
  icon: "λ",                         // shown on the lesson-complete card (default ◆)
  lessons: [
    {
      id: "lesson-01",               // stable id for progress tracking — never renumber
      title: "Lesson 1: Syntax",
      navTitle: "Syntax",            // optional short title for the nav (else derived)
      description: "…",              // shown under the lesson title
      completionText: "…",           // shown on the completion card (may contain HTML)
      blocks: [
        { type: "concept", id: "…", title: "1. Variables", content: `<p>…</p>` },
        { type: "exercise", id: "ex-vars", title: "Quick Check: Variables",
          instruction: "…", kind: "valid-or-invalid", items: [ … ] },
        …
        { type: "exercise", …, isFinal: true, … }   // the Final Review badge
      ]
    },
  ]
};
```

Concept `content` HTML uses a shared vocabulary of CSS classes from style.css — the main
ones you'll see and should reuse: `syntax-box` (displayed formula; on lambda pages these
automatically grow a "▸ try" chip if they parse, see §5.2), `ex-table`/`ex-row` (example
tables), `grammar-rule`, `info-box` (+ variants), `proof-box`, `step-trace`,
`syllogism-display`, `section-divider`. Skim an existing lesson before writing a new one —
the styling vocabulary is the de facto authoring API.

**TFL helpers.** TFL curricula call three template functions at load time (so
`tfl-helpers.js` must be loaded *before* `curriculum.js` on TFL pages):
`syl(rows, conclusion)` renders a symbolic syllogism with `+/−` formula codes and optional
labels, `engSyl(p1, p2, conc)` an English one, `mcPrompt(label, formula)` a labelled
inline formula. They return HTML strings interpolated into `content`/`promptHtml`.

## 5. The Lambda Lab

The Lab is the largest subsystem: a side panel on both lambda course pages where users
write arbitrary lambda calculus (with named definitions), run it, and optionally watch
every reduction step. It is deliberately split into a pure-logic core and a thin UI.

### 5.1 `lambda.js` — the core (pure, node-testable)

A UMD-ish module: `window.Lambda` in the browser, `module.exports` under node. No DOM
access anywhere. Pipeline for a run:

**parse → expand names (δ) → reduce (β, normal order) → readback**

- **AST**: three node shapes — `Var{name}`, `Lam{param, body}`, `App{fn, arg}` — built by
  plain constructor functions. No classes, no positions on nodes.
- **Tokenizer/parser** (recursive descent): accepts `λ` or `\`; multi-parameter sugar
  `λx y.M` (space-separated — identifiers are multi-character, so `λxy.M` is ONE parameter
  named `xy`); application left-associative; abstraction body extends maximally right; a
  trailing abstraction may be an unparenthesized final argument (`f λx.x`). Identifiers
  are Unicode letters except λ itself, plus digits/`_`/`'` after the first character (the
  courses use `ω` and `Ω` as names). Digit tokens (`0`, `42`) are identifiers too — names
  for Church numerals, generated on demand; they cannot be λ-parameters. `ParseError`
  carries a 0-based `pos` for caret display.
- **Printer**: `print()` emits minimal parentheses and keeps nested λs nested (`λx.λy.x`,
  matching course notation). Invariant, enforced by tests: `parse(print(t))` is
  structurally `t`. `printHtml(t, mark)` is the same traversal with HTML escaping and an
  optional `<mark>` around either a redex path or a named free variable — this is how the
  trace highlights what fires next, computed purely and unit-tested.
- **Evaluator**: capture-avoiding substitution (`subst`) with fresh names by priming
  (`x → x'`); `step()` performs one *normal-order* (leftmost-outermost) β-step and returns
  the new term plus the `path` of the reduced redex (a list of `'fn'|'arg'|'body'` moves
  from the root, locating the redex in the *input* term); `reduce(term, {maxSteps})`
  iterates to `{steps, result, status: 'normal'|'fuel-exhausted'}`. Fuel is how Ω is
  survivable. `alphaEq` compares terms up to bound-variable renaming (used for grading).
- **Prelude**: ~40 named definitions (`TRUE`, `ADD`, `PAIR`, `Y`, `FACT`, `MAP`, …), each
  **verbatim from the Foundations course** — that fidelity is a hard rule. The course's
  names are the API: `ADD` not PLUS, `IS_NIL` not ISNIL, no `IF`, no `TAIL`.
- **Programs** (`evalProgram`): a program is zero or more `NAME = expr` definition lines
  plus at most one final expression. Lines starting with whitespace continue the previous
  statement (offside rule); `--` starts a comment. Definitions may reference only
  *earlier* definitions and the prelude — self-reference is an error (the message points
  you at Y), forward reference is an error, and shadowing the prelude is allowed with a
  recorded warning (Under the Hood redefines `SUCC` etc. Scott-style, so this must work).
  Name expansion (δ) happens up front, one name at a time, before β-reduction begins.
  `ProgramError` carries line/source/offset so the UI can draw a caret.
- **Readback**: pattern-matches normal forms back into friendly values — Church numerals
  → `5`, `TRUE`, pairs → `⟨a, b⟩`, fold-lists → `[1, 2]`. `λa.λb.b` is simultaneously 0,
  FALSE, and NIL; the top-level readback prints `0 ≡ FALSE ≡ NIL` (a pun the course
  itself teaches).
- **`checkExpression(userSrc, expectedSrc, opts)`**: the grading entry point for
  write-expression exercises. Three modes — `tests` (apply the user's expression to given
  argument lists and compare outputs; **required** for "write a function" tasks, because
  different correct implementations have different normal forms), `beta` (default:
  normal forms alpha-equivalent), `alpha` (as-written alpha-equivalence, for syntax
  drills). Failure messages are written to never leak the expected answer.

### 5.2 `lab.js` — the panel UI

Builds the panel DOM inside the `#lambda-lab` element that the course page shells provide
(along with the floating `#lab-toggle` button); if those elements are absent (TFL pages),
the script is a no-op. Notable behaviors:

- Open state persists in localStorage (`lab-open`); the editor buffer persists per page
  (`lab-src:<pathname>`). On screens ≥1200px, opening the lab pads the body right so
  content re-centers beside the 400px panel; below that it's a slide-over.
- `\` is rewritten to `λ` on input with the cursor preserved. Ctrl/Cmd+Enter runs.
- Runs call `Lambda.evalProgram` with 5000 fuel. Fuel exhaustion shows a "Keep going ×10"
  button that multiplies the budget and re-runs. Parse/program errors render with a caret
  under the offending column.
- The step trace is **opt-in** ("Show steps", a deliberate product decision), rendered
  lazily, and capped at 200 lines. Each line shows the term with the thing that fires
  *next* highlighted: δ lines mark the name about to expand, β lines the firing redex.
- An examples dropdown is curated per course (keyed off `location.pathname`).
- **Lesson integration**: a MutationObserver on `#stage` watches blocks appear and adds a
  "▸ try" chip to every `.syntax-box` whose text actually parses as a valid lab program
  (`evalProgram` with 1 fuel inside a try/catch). Schematic notation, tables, and prose
  fail the parse and are skipped automatically — no authoring flags needed, and no
  engine.js or curriculum changes were required for the integration.
- Exposes `window.LambdaLab = { load }` for write-exercise.js.

### 5.3 `write-exercise.js` — the free-input exercise kind

Registers `ExerciseHandlers['write-expression']` (it loads after engine.js and lambda.js
and requires both globals). This file is the bridge that lets the shared engine stay
lambda-free: TFL pages never load it, so the kind simply doesn't exist there.

Item shape: `{ prompt | promptHtml, answer, explanation, check?: 'beta'|'alpha',
tests?: [{args, expect}] }`. The input/Check/retry shell is engine.js's
`makeFreeInputExercise` (unit-tested in engine.test.js); this file supplies the lambda
specifics — the `\`→λ input rewriting, the `Lambda.checkExpression` grading call, and the
lab chip. Users may retry freely; after 3 misses a "Show answer" button appears, and
revealing scores the item as incorrect (stored answer `'__revealed__'`, which fails the
engine's `countCorrect` comparison by construction). On completion, an "open in λ Lab" chip lets the user explore
their own submission. First real usage: Foundations Lesson 5 ("Write It Yourself").

## 6. The TFL Lab engine (Track D, complete)

`term-functor-logic/lab/` holds the TFL Lab — a term-logic programming language and
Aristotelian database (see Track D in `ROADMAP.md` for the full design record, including
the source papers). As of D6 it is **user-visible**: `tfl.js` (the pure-logic UMD engine)
plus `lab.js` (the DOM UI) load in a slide-over panel on all four course pages and on the
standalone page `lab/index.html`; `oracle.js`/`audit.js` remain node-only dev harnesses.
It follows the Lambda Lab split exactly — pure-logic module, UI module, node dev tools.

- **`tfl.js`** (`window.TFL` / `module.exports`) — five layers in one file:
  - *D1, parser + printer*: AST for terms (atoms with proterm primes and subscripts,
    singulars `Socrates*`, quoted multi-word terms, negatives `(−T)`, compounds
    `(+White+Horse)`, n-ary/nested relational complexes `(Lov+(Adm−Teacher))`,
    propositional `[p]`) and ENF propositions (signed pairs, quantity levels parsed but
    engine-rejected until D9). Parses exactly what the four courses print plus ASCII
    aliases (`-`, `+-` for ±, `A"` for `A″`); positioned `ParseError`s; the printer emits
    typographic notation and round-trips at the AST level. A parallel
    `printHtmlTerm`/`printHtmlProposition` pair emits the same output with atom names
    HTML-escaped, for rendering user-entered notation into the DOM (see §8).
  - *D2, inference core*: canonical equality up to Com/Assoc/DN (singular quantity is
    wild — ± — by normalization); rules IN/Contrap/It/DON/Simp/Add with `contradictory`
    (EN) as an operation; DON is monotone net-sign substitution reaching inside
    complexes; `derive()` returns traced, fuel-bounded derivations; `checkArgument()`
    gives atomic-categorical arguments a complete valid/invalid decision (counterclaim
    test via per-point 2-SAT with identity merging; the classic P/Z cancellation attached
    as a display certificate) and relational/compound arguments
    valid/contradicted/unknown. No existential import anywhere.
  - *D3, deep relational layer*: the passive transformation with pairing-subscripted
    heads (`Teaches₂₁` — roles in the subscripts, scope in subject position) and the
    Course 2 L3 symmetry guard, applied in derivations as the `Pass` rule; proterms
    (prime-suffixed atoms) as fixed reference with the full singular/wild treatment —
    distributed proterms are D2's wild resolution; `pronominalize()` (Skolemization:
    witnesses to fresh proterms plus `±T'+T` anchors) feeding `indirectProof()` —
    counterclaim, pronominalize, saturate to a ⊥ pair — which `checkArgument` uses as
    its fallback for both valid and contradicted verdicts.
  - *D4, programs & queries*: `parseProgram` (a proposition per line, `--` comments,
    per-line errors); `queryTerm` ("what is X" — DON+Simp saturation oriented back to the
    term, subsumption-filtered); `queryProp` (the three-way yes/no/unknown verdict over
    checkArgument); `checkProgramConsistency` (P/Z certificate + `refuteSet` derivation);
    `equivalents` (`?=` immediate-rule neighbourhood) and `decideEquivalence` (`?= A , B`
    — the DNF fingerprint via `statementModel`'s one-world truth for propositional
    statements, the rewrite path for term-logic ones).
  - *D5, the Aristotelian layer* (Mozes 1989): `readProp` (English glosses, orienting
    singulars back to subject), `explainProof` ("Because …, …"), and `answer` bundling the
    Mozes features — `strongerAnswer` (asked some, prove every), `possibility` (Mozes'
    *perhaps* = consistent-but-unproven), a labelled negation-as-failure guess, and
    `suggestMissingPremise` (enthymeme recovery: existential import `+S+S`, plus a
    consistency-guarded search for the tacit rule). Every suggestion is checkArgument-
    verified before it is offered, so nothing here can be unsound.
  - *D8, exercise grading*: `checkExpression(src, item)` — the pure grader behind the
    `tfl-expression` exercise kind, with the three modes (`transcribe` / `derive` /
    `premise`); parse/validation errors become messages, never throws, and no failure
    message leaks the expected answer.
  - *D9, numerical quantifiers* (TFL⁺, Castro-Manzano et al. 2018): quantity levels 0–3 on a
    particular subject (1 many, 2 most, 3 few) and `numericalDecision` — the three-condition
    method (algebraic sum, particular-count match, conclusion level ≤ max premise level).
    `checkArgument` routes any level-carrying argument here; the level-0-only queries
    (`queryTerm`, `equivalents`, …) refuse levels rather than compute nonsense. Sound and
    complete for the SYLL⁺ moods; the fragment is categorical only.
- **`tfl.test.js`** — plain-assert suite (201 tests): notation round-trips, rule
  behavior, the named derivations (horse's head, Twain/Clemens, the boys-girls-cowards
  indirect proof, scope traps…), the paper's Socrates/Fido program and its queries, and
  oracle spot checks.
- **`oracle.js`** — the correctness oracle: finite-model semantics for the whole
  fragment (empty model included when nothing denotes) and six fuzz suites (categorical
  exactness, rule-step soundness, relational derivation soundness, passive equivalence,
  indirect-proof soundness, statement-model agreement). `node oracle.js -n 20000` is the
  long-haul gate; it has caught real bugs (a DON wild-resolution unsoundness, two rounds
  of P/Z incompleteness, and its own RNG feeding periodic low bits to the generators) and
  is the reason to trust the engine. **Run it after any change to the inference layer.**
- **`audit.js`** — the D1 acceptance harness: extracts every formula snippet from all
  four TFL curricula (631 of them) and classifies each (parsed / foreign / whitelisted),
  exiting nonzero on anything unexplained. It doubles as a regression gate when curricula
  are edited: new lesson content that prints notation the lab can't read will fail it.

- **`lab.js`** — the D6–D7 UI (DOM only), driving both surfaces from one codebase: the
  course-page slide-over panel (`#tfl-lab` + `#tfl-lab-toggle`) and the standalone page
  (`#tfl-lab-page`). Fact-base editor, glyph palette, query line dispatching `? term` /
  `? prop` / `?=`, always-on consistency banner, lazy derivation panes, the `?=` square of
  opposition, and `.tfl` import/export. It validates every fact-base line (invalid-but-
  parseable lines surface in the banner) and catches both `ParseError` and `EngineError` on
  queries. D7 adds the `#stage` MutationObserver that puts "▸ try" chips on `.syntax-box`es
  whose text *validates* as a program, plus per-course example dropdowns. Exposes
  `window.TFLLab.load(src, qry)`.

- **`tfl-exercise.js`** — the D8 handler that registers the `tfl-expression` exercise
  kind (TFL course pages only; §3's exercise-kind registry): engine.js's
  `makeFreeInputExercise` scaffold configured with the engine's `checkExpression` grader. Finished items offer an "open in the TFL Lab" button via
  `window.TFLLab.load`.

Track D is complete (D1–D10). The intermediate-quantifier lesson (Statement Logic Lesson 6)
is authored curriculum, not engine code; it drives the numerical decision method through the
same lab the other courses use.

## 7. Styling and theming

One stylesheet, `style.css`, organized with `/* ── section ── */` banner comments. Layout
is a single centered column, max-width 720px, light theme only.

Theming is CSS-variable–based. `:root` in style.css defines the design tokens with
**blue** accent values (`--accent`, `--accent-hover`, `--accent-code`, `--accent-bg`,
`--accent-border`, `--accent-text`, `--accent-code-bg`, `--page-bg`). TFL pages link
`tfl-theme.css` *after* style.css, which redeclares just those eight variables in purple.
That's the entire theming system — a new subject theme is one small CSS file. (The home
page, which is neutral, styles the TFL card purple via explicit rules instead, since it
can't take a page-wide override.)

Lab styles live at the bottom of style.css scoped under `.lab*` class names, so they're
inert on TFL pages.

## 8. Security posture

Every page ships a strict Content-Security-Policy meta tag:
`default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; base-uri 'none'; form-action 'none'`.
No external resources of any kind are loaded — no fonts, no CDNs, no analytics.

The engine and handlers do use `innerHTML`, but only ever with **authored, first-party
content** from curriculum files and tfl-helpers (marked `// authored HTML — trusted` at
each site). The one place *user* input meets `innerHTML` is the lab trace, where
`printHtml` HTML-escapes every name before marking. Keep both properties: never put user
input through `innerHTML` unescaped, and never point the trusted sinks at anything that
isn't checked-in curriculum content.

The TFL Lab UI (D6) faces the same rule with a sharper edge: TFL quoted terms
(`"non-smoker"`) can contain `<`, `>`, and `&`, which the plain `printTerm`/
`printProposition` emit raw. `lab.js` therefore routes every proposition it puts through
`innerHTML` (derivation lines, answers, the square) through the escaping
`printHtmlProposition` export, and every English gloss (`readProp`) through `textContent` —
so no user-entered name ever reaches the DOM unescaped.

## 9. Dev tooling, tests, verification

There is no package.json; all scripts run on bare node:

- **`node lambda-calculus/lab/lambda.test.js`** — 153 plain-assert tests for the lab
  core: parser round-trips, capture-avoidance cases, Church arithmetic, Ω fuel
  exhaustion, alpha-equivalence, program/prelude semantics, readback, printHtml,
  checkExpression. **Run this after any change to lambda.js.** The bar is absolute: an
  incorrect reducer teaches students wrong lessons.
- **`node engine.test.js`** — 19 plain-assert tests for the course runtime, loaded in a
  `vm` context with a minimal hand-rolled DOM stub. Covers `countCorrect`,
  `shuffledIndices` (permutation invariant), `h`/`setFeedback`, and both built-in exercise
  handlers — including the multiple-choice shuffle-remap (clicking the visually-correct
  choice scores by the authored index under many random shuffles) and the graceful
  per-block failure (a bad block kind/type yields a skippable placeholder, not a blank
  lesson). **Run after any change to engine.js.**
- **`node check-counts.js`** — loads every curriculum in a `vm` sandbox (prepending
  tfl-helpers for TFL), counts lessons, and greps the hub/home HTML for the hardcoded
  card tags ("15 lessons", "7 lessons", "4 courses · 25 lessons"; in-progress courses use
  "N of M lessons"). Exits nonzero on drift. **Run after adding a lesson or course**, and
  update the HTML tags it flags.
- **`node term-functor-logic/lab/tfl.test.js`** — 201 plain-assert tests for the TFL
  engine (notation, rules, named derivations). **Run after any change to tfl.js**, and
  for inference-layer changes also run the fuzz oracle:
- **`node term-functor-logic/lab/oracle.js -n 20000`** — the semantic fuzz gate (§6);
  the same bar as the lambda reducer applies, squared: this engine *certifies validity*.
- **`node term-functor-logic/lab/audit.js`** — checks that every formula the TFL
  curricula print still parses as lab notation. **Run after editing TFL curricula or the
  tfl.js parser.**

engine.js and lab.js have no automated tests; changes there are verified in a browser —
headless-Chrome screenshots at desktop/mobile widths (1440/420px) for visual work, and
headless functional runs for behavior: serve the repo locally, load a copy of the course
page with the CSP meta stripped and a small injected script that drives the UI (click
through blocks, answer exercises by matching authored choice text, assert on classes and
scores via `document.title`), then `--dump-dom` and grep. New lessons also get a data
validation pass (answers in range, explanations present, balanced HTML tags in `content`). To view the site locally, any static server works:
`python3 -m http.server` from the repo root, then browse `localhost:8000`.
(Opening files via `file://` mostly works too, but a server matches production behavior.)

## 10. Invariants and gotchas

Things that will bite you if you don't know them:

1. **Script order on course pages is load-bearing.** `curriculum.js` before `engine.js`
   (engine reads the `CURRICULUM` global at DOMContentLoaded); on TFL pages
   `tfl-helpers.js` before `curriculum.js` (curricula call the helpers at parse time); on
   lambda pages `lambda.js` before `lab.js` and `write-exercise.js`.
2. **Lesson `id`s and curriculum `title`s are persistence keys.** Renaming a title or
   renumbering ids silently orphans users' saved progress.
3. **The prelude mirrors the Foundations course verbatim.** Don't "improve" a definition
   or add a convenience name the course doesn't teach; if the course changes, the prelude
   changes with it (and vice versa).
4. **Answers are final in choice exercises; retries are a write-expression feature.**
   Handlers must guard against double-answering (`if (exState.answers[i] !== undefined)
   return`).
4a. **Multiple-choice display order is shuffled at render time.** Never write a choice
   that refers to other choices by position ("both of the above", "option A"); the
   engine stores answers by authored index, so everything else is order-independent.
5. **Wrong-answer feedback in write-expression must never reveal the expected answer** —
   messages describe what the user's expression did, not what was wanted.
6. **Hardcoded counts** on the home and hub pages must be bumped manually;
   `check-counts.js` is the safety net, but only if you run it.
7. **The tokenizer's identifier charset appears in two places** in lambda.js — the
   tokenizer itself and the `defLine` regex in `evalProgram`. They must stay in sync.
8. **`λxy.M` is one parameter named `xy`**, not sugar for `λx.λy.M`. Multi-parameter
   needs spaces. This was an explicit design decision (multi-char identifiers won).
9. Redex `path`s in `reduce()` steps refer to the term *before* that step — off-by-one
   here breaks trace highlighting.

## 11. How to do the common jobs

**Add a lesson to an existing course.** Append a lesson object to `CURRICULUM.lessons` in
that course's `curriculum.js` (copy an existing lesson's shape; follow the
concept → quick-check cadence; give every exercise item an `explanation`; end with a
`isFinal: true` review). Bump the lesson count in the subject hub's card tag and the home
page's subject tag; run `node check-counts.js` to confirm. No engine changes, ever.

**Add a course to an existing subject.** Create `<subject>/<slug>/` with an `index.html`
copied from a sibling course (fix the relative paths and title) and a fresh
`curriculum.js`. Add a course card to the subject hub, update the home-page subject tag,
add the slug to the `SUBJECTS` map in `check-counts.js`, and run it.

**Add a subject.** New top-level directory with a hub `index.html`, a theme CSS file
overriding the accent variables, course subdirectories as above, a subject card + nav
link on the home page, and an entry in `check-counts.js`.

**Add an exercise kind.** Register a handler on `ExerciseHandlers` — in engine.js if it's
subject-agnostic, or in a separate page-scoped script (the write-exercise.js pattern) if
it depends on subject machinery. Honor the contract in §3: set `exState.answers[i]` once,
call `onItemAnswered()`, and make correct answers satisfy `answers[i] === item.answer`.

**Change the runtime.** Edit engine.js and run `node engine.test.js` — the built-in
handlers and the scoring/shuffle/hardening logic are covered there (via a DOM stub), so a
regression shows up without a browser. Keep the per-block `try/catch` intact: block builders
may throw, but the loop must keep the rest of the lesson alive.

**Change the lab engine.** Edit lambda.js, add tests for the new behavior in
lambda.test.js, and run `node lambda-calculus/lab/lambda.test.js`. Keep the module
DOM-free; anything visual goes in lab.js.

## 12. Planning docs and history

- `ROADMAP.md` (root) is both plan and log: Track A (Lambda Lab, A1–A8, complete),
  Track B (TFL Courses 3–4, B1–B9, complete), Track C (housekeeping, complete), and
  Track D (TFL^PL — a term-logic programming language / Aristotelian database lab):
  D1–D10 complete (parser/printer, inference core, deep relational layer, program/query
  layer, Aristotelian layer, the lab UI, lesson chips, the exercise kind, the numerical
  decision method, and the intermediate-quantifier lesson — §6) — Track D, and with it the
  whole roadmap, is done, with the full design-decision record in the track's preamble.
  Completed steps carry implementation
  notes recording decisions made along the way — it's the closest thing to an ADR log;
  read it before re-deciding anything.
- `term-functor-logic/ROADMAP.md` maps book chapters to courses/lessons, records firm
  scope decisions (Ch. 1 skipped; the book has no figure organization), lists
  lesson-by-lesson status, and keeps open content questions.
- The project follows a **step-sizing rule**: every roadmap step is scoped so a single
  agent prompt can execute it end-to-end. If a step grows, split it before starting.
- Git history is legible by design — one roadmap step per commit, prefixed with the step
  id (`B5: …`, `A8: …`). Keep doing that.

## 13. Deployment

GitHub Pages serves the `main` branch of `kserrec/guides` as-is at
`https://kserrec.github.io/guides/`. Deployment *is* `git push` — there is no pipeline,
no build artifacts, nothing to configure. Corollary: everything on `main` is live, so
don't merge half-finished lessons; scaffold new courses with their hub card saying
"N of M lessons" (the existing convention for in-progress courses).
