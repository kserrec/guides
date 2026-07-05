# Ham Calculus — Project Roadmap

Live site: **https://kserrec.github.io/guides/** (GitHub Pages from `main`; pushes deploy in ~1 min)
Last updated: 2026-07-05

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
| TFL Lab engine (Track D) | 🔶 D1–D5 done: parser/printer, inference core (DON, immediate rules, two-tier validity, traced derivations), the deep relational layer (guarded passive, proterms, indirect proof), the program/query layer (`parseProgram`, `? term`/`? prop`/`?=`, consistency check), and the Aristotelian layer (NL explanations, stronger-answer, possibility, negation-as-failure, enthymeme recovery). 174 tests, six fuzz suites. |
| TFL Lab UI (Track D) | 🔶 D6–D8 done: `lab.js` drives both the course-page panel and the standalone page at `term-functor-logic/lab/` (fact-base editor, palette, query line, consistency banner, derivation pane, `?=` square of opposition, `.tfl` import/export), "▸ try" chips + curated examples, and the engine-graded `tfl-expression` exercise kind (transcribe / derive / find-the-premise). |
| Numerical quantifiers (Track D) | 🔶 D9 done: TFL⁺ quantity levels 0–3 (some/many/most/few) with the paper's three-condition decision method in the engine (`numericalDecision`, `checkArgument` routing); all four of Tables 10–13 verified. Next: D10 advanced lesson. |

Tracks A, B, and C are fully executed. Track D is in progress — language core first
(D1–D5 ✅), lab UI live, lesson-integrated, and exercise-graded (D6–D8 ✅), the numerical
engine done (D9 ✅), then the numerical lesson (D10).

### Strengths

- Clean separation of engine vs. curriculum data; adding lessons/courses requires no engine changes.
- No build step, no dependencies — trivially deployable anywhere.
- Curriculum quality is high: concept → quick-check → review cadence, explanations on every item.
- Proven lab pattern (Track A): pure logic module with node tests → panel UI → lesson chips →
  lab-graded exercise kind. Track D reuses it wholesale.

### Gaps / debt

1. **No unit tests for `engine.js`** (the λ-lab logic has them; engine behavior is exercised via
   ad-hoc headless-Chrome runs per change). Tolerable; revisit if the engine grows.
2. **Numerical quantifiers taught nowhere yet** — the engine now decides numerical
   syllogisms (D9: most/many/few via the three-condition method), but no lesson teaches
   them and Course 4 L6 still concedes them as a "real limit." D10 adds the advanced lesson
   and softens that concession.

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
- **D3** ✅ Deep relational layer: the passive transformation with Course 2 L3's symmetry
  guard (equivalent only when both participants share quantity or one is singular); proterms
  with fresh markers, anchors, and wild quantity; the indirect-proof procedure (counterclaim,
  pronominalize, derive a proterm contradiction). Tests: Course 3's 9-line worked proof,
  scope-trap cases where naive commuting is invalid.
  Implementation notes (decisions made during execution):
  - **The bare-notation passive is never formula-sound.** Swapping participants while
    keeping the bare relation symbol claims the relation is symmetric — the courses fix
    the reading in the English gloss ("teaches" → "is taught by"), which a formula cannot
    carry. The engine emits the courses' own suppressed device explicitly: pairing
    subscripts on the head (Course 2 L4's `S₁₂`), so the passive of
    `−Philosopher+(Teaches+Student)` is `+Student+(Teaches₂₁−Philosopher)` — roles live in
    the subscripts, scope in subject position. Identity subscripts strip canonically
    (`Sees₁₂` ≡ `Sees`); a double passive composes back to the bare head. The symmetry
    guard then governs the subscripted form exactly: equivalent iff every participant pair
    whose relative scope order changes shares a quantity sign or has a fixed-reference
    member (n-ary swaps check all crossed pairs). Guarded passives are a derivation rule
    (`Pass`); unguarded ones are returned flagged — they are the scope traps.
  - **Proterms are name-carried fixed reference**: an atom whose name ends in a prime gets
    the entire singular treatment — ± validation and normalization, wild resolution in DON
    (the course's "distributed proterms" fall out of D2's machinery for free), point
    seeding in P/Z, singleton denotations in the oracle. Course 3 L3's anchor-hosting and
    distributed-donor quick-checks are unit tests.
  - **Pronominalization is Skolemization** — satisfiability-preserving, not
    entailment-preserving — so it lives only in indirect-proof setup, never in `derive()`.
    Witnesses: a `+` general-atom subject and general atoms at `+` object slots through
    nested complexes; one anchor `±T'+T` per witness; fresh primes from a used-name
    registry (a second pronominalization gets `''`); orientations hidden by conversion are
    retried and the richest taken.
  - **Indirect proof** = counterclaim, pronominalize its particulars, saturate until some
    line's contradictory is already on the board; the trace prunes to the two clashing
    lines plus a synthetic ⊥ line. `checkArgument` falls back direct → indirect for
    *valid*, then both again for *contradicted*. The engine refutes the course's 9-line
    showcase counterclaim in 5 lines (whole-complex DON needs no witnesses); the test that
    genuinely needs the full stack is "some boy loves every girl, some girl is a rebel ⊢
    some boy loves a rebel" — universal-object instantiation via Pron + Anchor + guarded
    Pass around the fixed witness + wild DON. The one-way scope entailment ∃∀ ⊢ ∀∃ is
    provable too (at ~4× default fuel; a passive of a tautology line feeds the chain), and
    its converse stays unfound.
  - **The fuzzer's RNG was lying.** The oracle's LCG handed out its low bits, which are
    (nearly) periodic, so rigid generator call patterns cycled through a handful of
    formulas — D2's suites were far weaker than their iteration counts suggested. Fixed
    (high bits); the honest RNG immediately caught a real D2 gap: the P/Z verdict's
    closure is unit propagation and misses case-split consequences (a fixed individual
    with `{B→¬B, ¬B→¬A, ¬A→B}` must be B either way). Point consistency is now a
    per-point 2-SAT decision, with 2-SAT-backbone extraction of forced fixed-reference
    literals feeding identity merging. Dually, the oracle now admits the **empty model**
    when nothing denotes — no existential import for the world itself — so pure-universal
    sets cannot prove existence on either side of the comparison.
  - Oracle suites now number five: passive equivalence (with Course 2 L3's two scope
    traps as deterministic cases) and indirect-proof soundness join the original three;
    rule-step soundness includes `Pass`; all generators now produce proterms. Green at
    `-n 5000`: 21k rule steps, 5.2k passive equivalences (2.2k guarded off), 876 indirect
    refutations, all model-checked. 138 unit tests.
- **D4** ✅ Programs & queries: program = propositions + `--` comments; queries `? s`
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
  Implementation notes (decisions made during execution):
  - **`--` comment marker** (respelling the paper's `//`): two adjacent minuses can never
    lex in valid notation — negative terms are always parenthesized, so `--` is never
    double negation and `+-` (the wild alias) needs the `-` glued to a `+`. `parseProgram`
    returns `{ propositions: [{prop,text,line}], errors: [{line,message,pos}] }` — one bad
    line is reported with its line number, the rest survive, ready for D6's margin markers.
  - **`? term` orients through conversion.** Canonical form converts `±Socrates*+Man` to
    `+Man+Socrates*` (I-forms sort their sides), burying the singular in the predicate, so
    the query re-orients each saturated line via the D3 `orientations` helper to put the
    queried term back in subject position, dedups on the *canonical* key, and drops
    tautologies (the `It` line and its obversions). Saturation runs DON+Simp+immediate
    rules only — **not Add**, whose compounds would bury the answer. Subsumption filtering
    keeps only unary-entailment-maximal answers (a small restricted saturation decides
    a ⊢ b); no-import is respected, so `−Man+Animal` never subsumes `+Man+Animal`.
  - **`? proposition` is checkArgument, read three ways**: `valid` → yes, `contradicted` →
    no; for the categorical fragment (where checkArgument returns valid/invalid, never
    `contradicted`) a second check on the query's contradictory decides provably-no vs
    unknown. Open-world by construction — the negation-as-failure guess is D5's job.
  - **Consistency** reuses D3's indirect-proof engine: `refuteSet` (the counterclaim
    machinery, generalized to refute any set) always returns the ⊥ derivation, and the
    categorical fragment additionally gets the P/Z certificate. `complete: true` flags the
    categorical case (exact); relational `consistent: true` means "no refutation within
    fuel," honest about reach exactly as checkArgument is.
  - **The DNF fingerprint is one-world semantics** (Course 4 L3: "statement logic is the
    syllogistic run in a one-member universe"). `statementModel` returns `{atoms, sat}`
    or `null`; it opts *out* the moment a singular, relational complex, or **uppercase**
    (general-term) atom appears, so term-logic statements keep their coarser, correct
    equivalence and only genuine lowercase statement propositions get the truth-table
    decision. `decideEquivalence` compares satisfying sets over the *union* of both atom
    sets (so a contradiction over {p,q} equals one over {p}); term-logic pairs fall back
    to the immediate-rule rewrite path. Cross-checked against the oracle's finite-model
    semantics at n = 1 (new suite 6) — truth values on every assignment and the DNF
    equivalence verdict both match.
  - **PD** (the rule D2 parked here) needed no separate implementation: its
    conjunctive-predicate half — `−X+(+Y+Z)` ⊣⊢ {`−X+Y`, `−X+Z`} — is exactly Simp one
    way and Add the other (both already in the engine, and they operate on compound
    structure whether the conjuncts are terms or statement brackets), and its propositional
    content is decided completely by the DNF fingerprint. So the promise is kept by
    composition rather than a new rule.
  - Six oracle suites now (statement-model agreement joins the five); `saturate` gained an
    `opts.rules` gate so the term query can run a restricted rule set. Green at `-n 4000`:
    17k rule steps, 4.1k passive equivalences, 699 indirect refutations, 17k statement-model
    evals + 4k DNF-equivalence verdicts, all model-checked. 156 unit tests.
- **D5** ✅ The Aristotelian layer (what makes it a *database*, not a proof checker):
  natural-language explanation per answer ("Because Socrates is a man, and every man is
  mortal…"); volunteer the stronger answer when a weaker one is asked (asked *some*, prove
  *every*); "possibility" answers from I-forms (Mozes' *perhaps*); labeled
  negation-as-failure guess lines on *unknown* verdicts; missing-premise suggestion via
  enthymeme recovery under Course 2 L6's three constraints — including the
  existential-import case ("would follow if `+S+S`; add it?").
  Implementation notes (decisions made during execution):
  - **`readProp` orients before reading.** Canonical form converts `±Socrates*+Man` to
    `+Man+Socrates*`; the reader runs the D3 `orientations` helper first to put the fixed
    individual back in subject position, so it reads "Socrates is a man," not "some man is
    Socrates." General terms lowercase to common nouns; singulars keep their case as proper
    names and take an article on a plain-noun predicate ("Socrates is a man"), matching the
    courses' own glosses. Relationals/compounds read mechanically but unambiguously.
  - **`answer` assembles the Mozes bundle** over `queryProp`'s verdict: `explanation`
    (from a re-derived trace — "Because <givens>, <conclusion>"; a refutation ends "— which
    is impossible"), `stronger`, `possibility`, `nafGuess`, `suggestions`. Each piece is
    also a standalone export so D6 can compose the panel as it likes.
  - **Stronger-answer and enthymeme suggestions are verified by construction** — every one
    calls `checkArgument` to confirm the completed argument is actually valid before it is
    offered, so the heuristic layer can never emit an unsound suggestion (this is why D5
    needs no oracle suite of its own: it only ever reports what the fuzz-checked engine
    certifies).
  - **The ex-falso trap in enthymeme search.** Recovering the tacit premise in a *fact
    base* (not the courses' isolated two-line argument) is a bounded search over the
    argument's own general terms for a premise that makes the query follow. The catch the
    first cut missed: a premise that makes the base *inconsistent* validates the query ex
    falso — "no animal is a man" "proves" Fido is mortal — so candidates are filtered
    through `checkProgramConsistency`, and the survivors are ranked (introduces a goal term
    first, universals/rules before particulars). The isolated Poodle/Ted cases still
    recover their unique premise; a database offers the handful of consistent bridging
    rules, mortality-about-dogs first.
  - **Possibility = consistency** (Mozes' *perhaps*): an unknown positive particular that
    stays consistent with the base is offered as possible-but-unproven — a faithful reading
    of "perhaps" that stays honest about the open-world gap the NAF guess also flags.
  - No engine changes; 173 unit tests (17 new). Six oracle suites unchanged and still green.
- **D6** ✅ Lab UI, two surfaces from one codebase (`term-functor-logic/lab/lab.js` +
  `lab/index.html`, styles appended to `style.css`): the ∴-Lab-style slide-over panel on all
  four TFL course pages (toggle button, right panel, per-pathname localStorage buffer for
  both program and query) and the standalone full page at `term-functor-logic/lab/` (linked
  as an "interactive" card on the TFL hub). Editor + query line + derivation pane with rule
  names and parent citations, parse-error caret; input palette (− + ± ( ) * [ ] ′ ″);
  always-on consistency banner wired to D4's check (green ✓ / amber parse errors / red
  ⚠ with a "Why?" toggle showing the refutation derivation). `.tfl` import (client-side
  FileReader) / export (Blob download). Square-of-opposition view on `?=` neighbourhood
  results (given / contradictory / contrary / subaltern, flipping to sub-contrary /
  super-altern for particulars).
  Implementation notes (decisions made during execution):
  - **One `lab.js`, surface-detected.** It builds a single `.tfl-lab-core` (toolbar,
    editor, palette, banner, query row, output) and either drops it into `#tfl-lab-page`
    (full page, given room by CSS) or wraps it in the panel chrome under `#tfl-lab` with a
    `#tfl-lab-toggle` and `body.lab-open` (reusing the λ-Lab `.lab*` classes wholesale, so
    only the TFL-specific controls are new CSS). Distinct ids (`tfl-lab*`) keep it clear of
    the λ-lab's `#lambda-lab` on their respective pages.
  - **Query dispatch is parse-driven, no mode switch.** `?=` routes to the equivalence
    layer (a quote/paren-aware top-comma split picks `decideEquivalence` vs `equivalents`);
    otherwise the body is tried as a proposition first (`answer` — the full Aristotelian
    bundle) and falls back to a bare term (`queryTerm` — "what is …?"). A proposition always
    leads with a sign, so `? Socrates*` and `? +Man+Socrates*` disambiguate for free.
  - **Answers surface the whole D5 bundle**: verdict pill (yes/no/unknown), the English
    question from `readProp`, the explanation, a lazy "Show derivation" pane (from
    `support.proof` or a fresh `derive`, incl. the refutation of the contradictory on a
    *no*), and the extras — stronger (↑), possibility (~), NAF guess (⊘), and enthymeme
    suggestions each with a one-click **+ add** that appends the premise to the fact base and
    re-runs. Derivation lines render via the XSS-safe `printHtmlProposition`; all English
    text goes in through `textContent`.
  - **Banner debounced 250 ms** on editor input; parse errors short-circuit the consistency
    call and list line numbers. Verified headlessly (Chrome `--dump-dom`) end-to-end: the
    flagship yes + derivation (`+Mortal+Socrates* — DON 2,1`), the refuted no, the
    open-world unknown with perhaps/NAF/suggestions, the term query's three strongest
    answers, the `?=` neighbourhood + square, `decideEquivalence` ✓, the parse-error caret,
    the inconsistent-base red banner, and the palette insert — plus a clean course-page load
    (panel populated, no console errors). No engine changes; 174 engine tests still green.
- **D7** ✅ Lesson integration (in `lab.js`, no curriculum/engine edits): "▸ try" chips on
  TFL `.syntax-box`es (A6's `#stage` MutationObserver, reusing the `.lab-try` chip style),
  plus curated per-course example dropdowns (course detected from the path; the standalone
  page gets a greatest-hits set).
  Implementation notes (decisions made during execution):
  - **Chips gate on *validation*, not just parsing.** A headless audit across all four
    curricula (inject every lesson's HTML, run the filter over each box's `textContent`)
    showed that TFL schematics with placeholder words/letters — `±Subject±(Relation±Object)`,
    `±S+(R±O)` — *parse* but are invalid propositions (wild ± needs a singular/proterm), so
    `parseProgram` alone let them through. The fix, and a real robustness bug it exposed:
    `parseProgram` reports only `ParseError`s, so a parseable-but-invalid line reaches
    `validateProp` and throws `EngineError` — which `runQuery` didn't catch. Now
    `currentProgram` validates every line (surfacing invalid ones in the banner with their
    line number), `runQuery` catches `EngineError` too (friendly message, no caret), and
    `chipPlan` validates before offering a chip. Result: schematic boxes drop out; the
    remaining chips are all valid and meaningful.
  - **What a chip loads.** A single-proposition box loads that proposition with a `?=`
    equivalence query, so the neighbourhood + square of opposition show immediately (the
    A/E/I/O forms `−S+P`/`−S−P`/`+S+P`/`+S−P` in Course 1 become a one-click tour of the
    square). A multi-line box is read as an argument: every line but the last is the fact
    base, the last is the conclusion tested with `? …`.
  - **Coverage, honestly.** Post-filter chip counts: Introduction 4, The Full Language 2,
    Relational Syllogisms 1, Statement Logic 0 (its lessons teach through truth tables,
    trees, and MPL notation the lab doesn't parse as programs) — so the curated examples
    dropdown is Course 4's lab on-ramp. The examples themselves (Barbara, Socrates, the
    square, horse's head, faster-than chain, "some boy loves a rebel," modus-ponens-as-
    Barbara, statement contraposition, and an honest *unknown*) are each verified through
    the engine. Live-verified headlessly: the observer chips a revealed box, the chip opens
    the panel with the query prefilled and the square rendered, an invalid query renders an
    error instead of throwing, and an invalid fact-base line shows in the banner.
    174 engine tests still green.
- **D8** ✅ `tfl-expression` exercise kind graded by the engine. Grading is the pure,
  node-tested `checkExpression(src, item)` in `tfl.js` (A8's split: logic in the engine
  module, DOM in a thin handler); the handler `tfl-exercise.js` registers the kind into
  `ExerciseHandlers` and loads only on the four TFL course pages (after `lab.js`, so its
  finished items can offer an "▸ open in the TFL Lab" button). First real usage: a free-input
  "Write It Yourself: Transcribe to TFL" quick-check in Introduction Lesson 3's transcribing
  lesson (three items), sitting before the existing multiple-choice final.
  Implementation notes (decisions made during execution):
  - **Three modes, each with the right flexibility.** `transcribe` accepts any form equal to
    `answer` up to the immediate rules — `decideEquivalence`, so an obverse or contrapositive
    grades correct but an illicit conversion (`−S+P` vs `−P+S`) or a wrong quantity does not.
    `derive` (given `premises`) accepts any immediate-rule equivalent of the target
    conclusion, and distinguishes "follows, but isn't the one asked for" from "doesn't
    follow." `premise` (given `premises` + `conclusion`) accepts *any* premise that makes the
    argument valid while keeping the base consistent — an ex-falso premise (one that only
    "works" by making the base contradictory) and a bare restatement of the conclusion are
    both rejected; `answer` is only the reveal example, not the sole accepted response.
  - **Robust and non-leaking.** `checkExpression` catches `ParseError`/`EngineError` and
    returns them as messages (never throws), and no failure message ever contains the
    expected answer — the reveal (after three misses) does, and scores the item incorrect,
    matching A8. Grading reuses the engine's `countCorrect` convention (store `item.answer`
    on success, a sentinel otherwise).
  - **Authoring pattern (documented like A8).** Add a block `{ type:'exercise',
    kind:'tfl-expression', id, items:[{ mode, prompt|promptHtml, answer, explanation,
    premises?, conclusion? }] }` — no new wiring. 12 new engine tests cover all three modes
    (pass + fail paths); live-verified headlessly that the DOM handler grades all three,
    shows the non-leaking message, reveals→incorrect (score reflects it), and offers the lab
    button. 186 engine tests green.
- **D9** ✅ Numerical quantifiers, engine half (TFL⁺). The parser/printer already carried the
  quantity-level syntax since D1 (superscript `²` / ASCII `^2`, printer omits level 0); D9
  lifts the level-0-only guard and adds the decision method. All four of the paper's
  Tables 10–13 come out right — kaa-1 ⊬, akt-4 ⊬, bao-3 ⊢, ekg-2 ⊢.
  Implementation notes (decisions made during execution):
  - **Levels mean intermediate quantifiers, on the subject only** (Castro-Manzano et al.
    2018, Table 8): 0 some/every (classical), 1 many (`k`/`g`), 2 most (`t`/`d`), 3
    few/predominant (`b`/`p`). `validateProp` now allows level 0–3 but only on the subject,
    and a *nonzero* level requires a particular (+) subject (every universal a/e is level 0);
    the predicate, compound elements, and relational objects must stay level 0. So `+V²+C`
    is "most voters are citizens"; `−V²+C` and `+V+C²` are rejected with reasons.
  - **The decision method (`numericalDecision`)** is the paper's modified plus-minus algebra:
    a conclusion follows iff (i) the algebraic sum of the premises equals the conclusion
    (a coefficient map over signed terms — occurrence sign times the term's negation parity —
    that must cancel to zero), (ii) the number of particular (+) premises equals the number
    of particular conclusions, and (iii) the conclusion's level ≤ the max premise level.
    akt-4 is the discriminating case: it passes (i) and (ii) and fails **only** (iii) — a
    "most" conclusion off a "many" premise. `checkArgument` routes any argument carrying a
    nonzero level to this method (verdict `valid`/`invalid`, method `numerical`), leaving the
    fuzz-verified level-0 P/Z and derivation paths untouched.
  - **Numerical stays in its lane.** Levels are the syllogistic *decision* only — the paper
    defines nothing else for them — so the level-0 machinery refuses them with a clear
    message rather than compute nonsense: `queryTerm`, `equivalents`, `decideEquivalence`
    throw, `checkProgramConsistency` returns `{ numerical: true }` (undecided), and `answer`
    gives a numerical verdict + a three-condition explanation with none of the Mozes extras.
    `readProp` glosses the quantifiers (many/most/few), including the level-3 "few" polarity
    inversion (`+S³+P` reads "few S are not P", `+S³−P` "few S are P").
  - No numerical oracle suite: the paper proves soundness/completeness for the SYLL⁺
    syllogistic moods, and the intermediate-quantifier semantics aren't in the finite-model
    oracle; the Tables 10–13 plus condition-isolation cases are the gate (14 new tests). The
    six existing oracle suites still pass — the validation restructure left level-0 inference
    unchanged. 200 engine tests green.
- **D10** 🔲 Numerical quantifiers, lesson half: an advanced lesson teaching most/many/few as
  quantity levels (Peterson/Thompson SYLL⁺ → TFL⁺'s algebraic method), lab-integrated
  examples, Murphree's numerical term logic framed as the frontier beyond. Soften Course 4
  L6's "Real Limits" concession accordingly (most/many/few now taught; exact counts remain
  beyond) and resolve the TFL roadmap's Murphree open question.

---

## Suggested order

1. ~~C1~~ · ~~A1–A8~~ · ~~B1–B9~~ · ~~C2~~ · ~~D1~~ · ~~D2~~ · ~~D3~~ · ~~D4~~ · ~~D5~~ · ~~D6~~ · ~~D7~~ · ~~D8~~ · ~~D9~~ — complete.
2. **D10** — numerical quantifiers, lesson half ← next (and last)
