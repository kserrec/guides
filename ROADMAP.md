# Ham Calculus — Project Roadmap

Live site: **https://kserrec.github.io/guides/** (GitHub Pages from `main`; pushes deploy in ~1 min)
Last updated: 2026-07-04

## Step-sizing rule

Every step below is scoped so a single agent prompt (Sonnet-5-class model) can execute
it reliably end-to-end: one coherent deliverable, bounded file surface, verifiable on
completion. If a step grows beyond that during execution, split it before starting.

---

## Current state (evaluated 2026-07-04)

### What exists

| Area | Status |
|---|---|
| Shared engine (`engine.js`) | ✅ Data-driven renderer; 3 exercise kinds (`valid-or-invalid`, `multiple-choice` with shuffled display order, `write-expression`); localStorage progress |
| Shared styles (`style.css`) | ✅ Single-column, max-width 720px, light theme, per-subject accent overrides |
| Lambda Lab (Track A, A1–A8) | ✅ Parser/evaluator/prelude with 140+ node tests, right-panel UI, lesson chips, lab-graded exercises |
| Lambda Calculus: Foundations | ✅ 15 lessons |
| Lambda Calculus: Under the Hood | ✅ 8 lessons |
| TFL: Introduction | ✅ 8 lessons |
| TFL: The Full Language | ✅ 7 lessons |
| TFL: Relational Syllogisms (Course 3) | ✅ 3 lessons |
| TFL: Statement Logic & MPL (Course 4) | ✅ 6 lessons — **TFL curriculum complete (24 lessons)** |

Tracks A, B, and C are fully executed. Track D below is the next body of work.

### Strengths

- Clean separation of engine vs. curriculum data; adding lessons/courses requires no engine changes.
- No build step, no dependencies — trivially deployable anywhere.
- Curriculum quality is high: concept → quick-check → review cadence, explanations on every item.
- Proven lab pattern (Track A): pure logic module with node tests → panel UI → lesson chips →
  lab-graded exercise kind. Track D reuses it wholesale.

### Gaps / debt

1. **No unit tests for `engine.js`** (the λ-lab logic has them; engine behavior is exercised via
   ad-hoc headless-Chrome runs per change). Tolerable; revisit if the engine grows.
2. **TFL has no interactive tool** — learners can check answers but can't *run* the algebra
   they've learned. Addressed by Track D below.

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

### A7. Verification & polish ✅
Full-curriculum audit: all 91 syntax boxes driven through the engine; after fixes,
Foundations 44/50 runnable and Under the Hood 18/41 (every skip verified as schematic
notation, pseudocode, or a deliberate non-definition), zero fuel issues at default budget.
Fixes: identifiers accept Unicode letters except λ (courses use `ω`/`Ω`), course-faithful
`ω`/`Ω` prelude entries, parse-error caret in the panel (ProgramError carries
source/offset), iOS focus-zoom prevention + safe-area insets. 140 tests.

### A8. `write-expression` exercise kind ✅
Free-input exercises graded by the lab engine. Three modes per item: `tests`
(apply the user's expression to argument lists and compare outputs — required for
function-writing tasks, since different correct implementations have different normal
forms), `beta` (normal-form equivalence, default), `alpha` (as-written, for syntax drills).
Registered into `ExerciseHandlers` from `lab/write-exercise.js` — engine.js and TFL
untouched. Retries allowed; "Show answer" after 3 misses scores as incorrect; wrong-answer
feedback never leaks the expected answer; scoring reuses the engine's countCorrect
convention. First real usage: "Write It Yourself" in Foundations Lesson 5 (TRUE from
scratch, reduce-to-FALSE, XOR graded by truth table). Authoring pattern for future
lessons: add `kind: "write-expression"` blocks — no new wiring needed.

---

## Track B — TFL Courses 3 & 4

Lesson-level content plan lives in `term-functor-logic/ROADMAP.md` (source: Sommers &
Englebretsen, *An Invitation to Formal Reasoning*). Steps here are execution-sized:

- **B1** ✅ Scaffold Course 3 (`relational-syllogisms/`: index.html, curriculum skeleton, hub card) + write Lesson 1 (Dictum applied to relational arguments — position-blind cancellation, failure modes, the De Morgan horse's-head via the tautology move).
- **B2** ✅ Lesson 2 (Distributed terms and DDO — net sign rule by sign multiplication, classical
  distribution rules as theorems, whole-complex donation; L3 hook: indirect proof + proterms).
- **B3** ✅ Lesson 3 (Indirect proofs and distributed proterms — counterclaim refutation as a
  procedure, pronominalization rule + anchors, distributed proterms as TFL's instantiation,
  full 9-line worked proof). **Course 3 complete.**
- **B4** ✅ Scaffold Course 4 (`statement-logic-and-mpl/`) + Lesson 1 (the trichotomy; contradiction
  signature +X−X; tautology test via self-destructing contradictories; excluded middle as −X+X with
  X=(−p); validity restated as counterclaim-is-a-contradiction, P/Z as the detector).
- **B5** ✅ Lesson 2 (Direct proofs and the tree method — bare p = +p+p, statement rules as one
  cancellation, tree decomposition with counterexample-reading open branches).
- **B6** ✅ Lesson 3 (DNF and the subsumption of statement logic — world-descriptions, DNF read
  off tree branches, expressive completeness via or/and/not, statements as singular terms of the
  singleton universe with wild quantity; the Frege-inversion framing).
- **B7** ✅ Lesson 4 (MPL's syntax and the predicate way — names/variables/predicates and the
  caste system, quantifiers with variables-as-pronouns vs proterms, the →/∧ asymmetry with the
  two classic mistranslations, vacuous truth, quantifier order vs sign placement; two-towers recap).
- **B8** ✅ Lesson 5 (Translating between TFL and MPL — the dictionary with the four-move
  procedure, term operations as connectives on open sentences, quantifier-negation laws vs the
  sign flip, the left-to-right relational rule, singulars→names, validity preserved both ways).
- **B9** ✅ Lesson 6 (The limits and power of TFL — the indictment audited count by count with
  the horse's-head replay, honest concessions on numerical quantity and infrastructure, the
  naturalness/one-engine/architecture case, Sommers' wager; curriculum-spanning final review).
  **Course 4 complete — Track B complete: full TFL curriculum, 4 courses / 24 lessons.**

Resolve the open questions listed at the bottom of the TFL roadmap (REGAL acronym,
commutation/association laws placement) as they come up in the relevant lesson's step.

---

## Track C — Housekeeping

- **C1** ✅ `git init`, add `.gitignore` (`.DS_Store`), remove stray `.DS_Store` files, initial commit.
- **C2** ✅ Consistency pass: unify hub back-link labels, real home page content (subject cards
  instead of bare hero), verify lesson-count tags.

---

## Track D — TFL^PL: a term-logic programming language (the "TFL Lab")

Goal: a Lambda-Lab-style panel alongside the TFL courses hosting a small **logic programming
language in TFL notation** — a program is a list of propositions, queries are answered by
cancellation, and every answer explains itself in natural language. The key insight from the
literature: because TFL's ternary syntax erases the fact/rule distinction (a singular and a
universal proposition have the same shape), such a language "organically induces a database
à la Mozes" — the Aristotelian-database behaviors fall out of the logic instead of being
bolted on. Learners get to *run* the algebra all four courses taught.

### Sources

- J. M. Castro-Manzano, L. I. Lozano-Cobos, P. O. Reyes-Cárdenas, **"Programming with Term
  Logic,"** *BRAIN* 9(3), 2018 — defines TFL^PL over TFL⁺: BNF
  (`<proposition> ::= <termⁿ>±<term⁰>`), quantity levels 0–3 (some/every, many, most,
  few/predominant), the three-condition decision method (premise sum = conclusion; particular
  count matches; conclusion level ≤ max premise level), a C prototype limited to two-term
  propositions + DON, and — as named future work — exactly our D-steps: a relational module
  and a numerical module.
- E. Mozes, **"A Deductive Database Based on Aristotelian Logic,"** *J. Symbolic Computation*
  7(5):487–507, 1989 — the five Aristotelian-database features: natural-language explanations
  of deductions; volunteering stronger/weaker answers; "possibility" answers; suggesting
  missing rules; flagging where analogy/induction would help.
- Rule inventory (the paper's Appendix B, after Englebretsen 1996): immediate rules —
  DN, EN, IN, Com, Assoc, Contrap, PD, Iteration; mediate rules — DON, Simp, Add.
- W. Murphree, **"Numerical Term Logic,"** *Notre Dame J. Formal Logic* 39(3), 1998 — the
  wider frontier past most/many/few (exact and comparative counts); D9's context.

### Design decisions (made now so steps stay single-prompt)

- **Course notation in, course notation out.** The lab parses what the lessons print —
  `−S+P`, `±s*`, negative terms `(−T)`, compound terms, relational complexes `−B+(Lov+G)`,
  statement terms — plus plain-ASCII aliases (`-S+P`, `*s`). We build on the full course
  fragment, relationals included: Course 3's rules exist precisely for this, and it is the
  paper's own named future work.
- **Architecture mirrors Track A:** pure logic module `term-functor-logic/lab/tfl.js`
  (no DOM, node-tested), UI module `lab.js`, styles appended to `style.css`, plain-node tests.
- **Scope guard:** the engine's power stays at the courses' until D8 — DON, Simp, Add, and the
  immediate rules; no most/many/few before the numerical steps.
- **Numerical-ready AST from D1.** Every quantified term occurrence carries a quantity-level
  field, fixed at 0 (classical some/every) until D8; the printer omits level 0, so classical
  notation is unchanged forever. D8 then touches only parser, printer, and one validity
  condition — no AST migration.
- **Terms are strings, not letters.** Bare identifiers: Unicode letters, digits, underscores,
  starting with a letter (`Wise`, `German_Shepherd`, `H2O`). No hyphens — ASCII `-` and
  typographic `−` are normalized to the minus functor, so `non-smoker` cannot lex as one term.
  Quoted terms `"non-smoker"`, `"head of a horse"` allow anything except the quote char and
  newline. Whitespace is insignificant; the printer emits typographic `−`.
- **Quantity levels use an explicit marker**, not the paper's bare trailing digit: ASCII
  `+V^2+C^0`, pretty-printed `+V²+C⁰`. (With multi-char terms, `+V2` must mean the term "V2",
  so `^` disambiguates level from name.)
- **Relationals from day one, n-ary and nested.** The grammar is recursive (a relational
  complex is a relation plus one or more signed objects, each itself a term), so arity and
  nesting depth are unbounded — `(Gave+Rose+Girl)` is three-place, and the paper's own first
  relational example is nested. Restricting to dyadic would cost extra code *and* fail the D1
  harness. Inference is staged instead: direct relational DON (net-sign distribution) in D2;
  the subtle machinery — passive transformation, proterms, indirect proof — is its own step
  (D3). Runaway derivations are bounded by fuel, not by parse-time arity limits.
- **No existential import**, faithful to Sommers: `−S+P` alone never yields `+S+P`;
  subalternation needs an explicit existence premise `+S+S` (the paper's own convention for
  import-requiring moods). The Aristotelian layer turns the gap into a suggestion: "it would
  follow if some S exists — add `+S+S`?"
- **Three-way query semantics:** *yes* (derivation shown) / *provably no* (refutation shown)
  / *unknown* (neither derivable). Negation-as-failure appears only as an explicitly labeled
  guess line ("by negation as failure: …"), as in Mozes' own example output — the
  open-vs-closed-world distinction is itself a lesson.
- **Propositional terms wear square brackets**: `+[p]+[q]`, `−[p]+[q]` (the paper's footnote
  13 convention). With multi-character general terms, brackets are what keep "rain the
  statement" distinct from "Rain the kind of situation."
- **Correctness oracle:** the rule engine is fuzzed against a tiny finite-model semantic
  checker (enumerate small models, decide entailment semantically; syntactic verdict must
  match on thousands of random arguments). An engine that certifies validity must be held to
  a higher standard than spot tests — Track A's "an incorrect reducer teaches wrong lessons,"
  squared.
- **Panel and standalone page from one codebase:** the λ-Lab-style side panel on course pages
  for lesson chips, plus a full-page lab at `term-functor-logic/lab/` where document-scale
  fact bases and derivation panes get room.

### Steps

- **D1** ✅ Parser + printer core (`tfl.js` + `tfl.test.js` + `audit.js`).
  Implementation notes (decisions made during execution):
  - Group disambiguation is purely syntactic, matching the courses' own convention: a
    parenthesized group whose first element is *signed* is a negative term `(−T)` or
    compound `(+White+Horse)`; an *unsigned* head makes it a relational complex
    `(Lov+Girl)`, n-ary and nested. `(T)` and `(+T)` are transparent.
  - `parseSignedTerm` is exposed alongside `parseProposition`/`parseTerm` — the signed
    term is D2's working unit, and the courses display them constantly (`+T`, `±Mary*`).
  - A `"` following a name character lexes as a double prime (Course 2 prints `+A"+C`
    for `+A″+C`); unambiguous, since a quoted term can never directly follow a name.
    Typographic `′`/`″` normalize to ASCII `'`/`''` inside names; subscript digits are
    name characters (`S₁₂`, `B'₁`).
  - Quantity-level *syntax* (`^2` / superscript `²`, level on any signed-term occurrence,
    printer omits level 0) landed here rather than D9 — it's pure syntax, so D9 now only
    touches the decision method. The D2–D8 engine stays level-0.
  - ASCII wild alias is `+-` (adjacent), safe because negative terms are always
    parenthesized. Printer emits typographic `−`/`±`, superscript levels, compact
    spacing, and quotes any name that isn't a bare identifier.
  - Acceptance harness (`audit.js`, node): drives all 631 unique formula snippets
    (syntax boxes *and* `<code>` runs) from the four curricula through the parser —
    484 parse as lab notation (394 single propositions/terms/signed terms, the rest
    premise-sum algebra and multi-formula argument displays, every part parsed), 146
    verified foreign (MPL, prose, tree diagrams, schemas), 1 whitelisted with a reason
    (`non-Lov`, whose `non-` prefix the lab deliberately reads as minus). Exits nonzero
    on any unexplained snippet. 63 node tests incl. a seeded random-AST round-trip
    property (parse ∘ print = id at the AST level).
- **D2** ✅ Inference core (`tfl.js` inference layer + `oracle.js`).
  Implementation notes (decisions made during execution):
  - **Equality up to Com/Assoc/DN is a canonical form**: DN strips, compounds flatten and
    sort, I/E propositions sort their sides; singular quantity signs normalize to ± (the
    wild pun as an identity, on subjects and relational objects). Conversion never appears
    as a derivation step — it's free. Side effect: double obversion can hand back the
    contrapositive (the intermediate E-form commutes); both are correct.
  - **Rules**: IN (obversion), Contrap (A and O), It (only −T+T — +T+T would smuggle
    import), DON, Simp (conjunct-drop at net-+ occurrences, plus +X+Y ⊢ +X+X), Add
    (same-subject compound intro). EN is exposed as the `contradictory` operation, not an
    entailment. PD deferred to D4 (it needs statement-conjunction objects). Wild ±
    resolves per use; substitution at a ± slot fixes the slot to the resolution that made
    the net sign + — the fuzzer caught the naive always-+ version claiming "R's some
    non-A" where only "R's every non-A" was licensed.
  - **DON is monotone substitution**: donor −M+D (or ±m*+D, or −M−E donating (−E))
    licenses replacing any net-+ occurrence of M — through negations, compound elements,
    and relational objects at any depth. Proved out on the horse's head (via the It
    tautology premise), Course 3 L2's donate-a-whole-complex showcase, a nested
    faster-than chain, and Twain/Clemens (one DON step with the wild resolved universal —
    identity chains do fall out, as conjectured).
  - **The validity verdict is two-tier.** Atomic-categorical arguments (every side an
    atom under negations) get the complete counterclaim decision — but implemented as
    literal-implication closure with singular-point merging, NOT the flat zero-sum: the
    fuzzer showed textbook P/Z misses vacuous-subject inconsistencies like {+A+B, −A+C,
    −A−C} and singular-existence cases (names denote, so every singular seeds a point).
    The classic one-particular/zero-sum cancellation is still computed as the display
    certificate when it exists. Everything else (relational, compound-cored) gets
    derivation verdicts: valid / contradicted / unknown — honest about what direct proof
    reaches until D3 adds indirect proofs.
  - **The oracle earned its keep.** `oracle.js`: finite-model semantics (bitmask sets,
    n-ary relations, singleton singulars, brackets as truth-valued units, no import
    anywhere) + three fuzz suites: categorical exactness (engine verdict ≡ semantic
    entailment, 20k args), rule-step soundness (~92k steps incl. compound and relational
    hosts), relational-derivation soundness (~20k found proofs, no counter-model to n=3).
    All green after the two bugs above were fixed. 115 unit tests total.
- **D3** 🔲 Deep relational layer: the passive transformation with Course 2 L3's symmetry
  guard (equivalent only when both participants share quantity or one is singular); proterms
  with fresh markers, anchors, and wild quantity; the indirect-proof procedure (counterclaim,
  pronominalize, derive a proterm contradiction). Tests: Course 3's 9-line worked proof,
  scope-trap cases where naive commuting is invalid.
- **D4** 🔲 Programs & queries: program = propositions + `--` comments; queries `? s`
  ("what is s" — saturate DON+Simp about a term, fuel-budgeted; results DN-normalized,
  subsumption-filtered, strongest form first) and `? −s+P` with the three-way verdict
  (yes / provably no / unknown, per design decisions). Facts and rules share one shape — the
  language's defining feature. Program-level **consistency check** (P/Z over the fact base,
  returning the contradiction's derivation when found) as an engine API for D6's banner.
  Plus the database-independent **equivalence query** `?= <statement>`: closure under the
  bidirectional immediate rules only (DN-normalized so it terminates), each equivalent
  listed with its rule name and English reading (obverse, contrapositive, …); pairwise form
  `?= A , B` decides equivalence by canonical form and shows the rewrite path (for
  propositional statements, the DNF fingerprint as certificate). Tests reproduce the paper's
  Socrates/Fido example program in course notation.
- **D5** 🔲 The Aristotelian layer (what makes it a *database*, not a proof checker):
  natural-language explanation per answer ("Because Socrates is a man, and every man is
  mortal…"); volunteer the stronger answer when a weaker one is asked (asked *some*, prove
  *every*); "possibility" answers from I-forms (Mozes' *perhaps*); labeled
  negation-as-failure guess lines on *unknown* verdicts; missing-premise suggestion via
  enthymeme recovery under Course 2 L6's three constraints — including the
  existential-import case ("would follow if `+S+S`; add it?").
- **D6** 🔲 Lab UI, two surfaces from one codebase: the λ-Lab-style panel on TFL course
  pages (toggle button, right panel, per-pathname localStorage buffer) and a standalone
  full page at `term-functor-logic/lab/` for document-scale work. Editor + query line +
  derivation pane with rule names, parse-error caret; input palette for − + ± ( ) * [ ];
  always-on consistency banner wired to D4's check (shows the contradiction's derivation).
  Import/export of fact files: load a plain-text `.tfl` document into the editor via file
  picker (client-side FileReader — the file never leaves the browser) and download the
  current program back out. Optional square-of-opposition view on `?=` results: equivalents
  + contradictory + contrary + subaltern as the statement's logical neighborhood.
- **D7** 🔲 Lesson integration: "▸ try" chips on TFL syntax boxes that parse as programs
  (A6's MutationObserver pattern); curated examples per course (Barbara, horse's head, a
  REGAL check, the proterm proof); verified headlessly across all four courses.
- **D8** 🔲 `tfl-expression` exercise kind graded by the D2 engine (modes: transcribe-English
  — equal up to immediate rules; derive-the-conclusion; find-the-missing-premise); first real
  usage in one existing lesson, wiring pattern documented like A8.
- **D9** 🔲 Numerical quantifiers, engine half (TFL⁺): quantity levels 0–3 on subject terms
  (`+V²+C⁰` — "most voters are citizens"), ASCII `+V^2+C^0` (explicit `^` marker; see design
  decisions); the three-condition decision method; parser/printer/derivation support. Tests
  straight from the paper's Tables 10–13: kaa-1 ⊬, akt-4 ⊬, bao-3 ⊢, ekg-2 ⊢.
- **D10** 🔲 Numerical quantifiers, lesson half: an advanced lesson teaching most/many/few as
  quantity levels (Peterson/Thompson SYLL⁺ → TFL⁺'s algebraic method), lab-integrated
  examples, Murphree's numerical term logic framed as the frontier beyond. Soften Course 4
  L6's "Real Limits" concession accordingly (most/many/few now taught; exact counts remain
  beyond) and resolve the TFL roadmap's Murphree open question.

---

## Suggested order

1. ~~C1~~ · ~~A1–A8~~ · ~~B1–B9~~ · ~~C2~~ — all complete.
2. **D1 → D2 → D3 → D4** (language core, node-testable without UI)
3. **D5** (the Aristotelian layer — the differentiator)
4. **D6 → D7** (lab usable end-to-end, integrated into lessons)
5. **D8** anytime after D2
6. **D9 → D10** last, in that order (numerical quantifiers: engine, then lesson)
