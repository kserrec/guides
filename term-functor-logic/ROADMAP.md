# Term Functor Logic — Course Roadmap

Source: Sommers & Englebretsen, *An Invitation to Formal Reasoning: The Logic of Terms* (2000, Routledge/Ashgate)

**Scope decision (firm):** Chapter 1 (metaphysical argument for term logic over Frege) is skipped. Formal logic only.

**Key finding:** The book has **no figure organization**. "First figure," "second figure," etc. do not appear as organizing chapters. The book teaches one algebraic validity test (REGAL) that handles all argument configurations uniformly.

---

## Status key

- ✅ Done
- 🔜 Next to build
- 🔲 Not started

---

## Book → Course mapping

| Book chapter | Content | Course |
|---|---|---|
| Ch. 1 | Metaphysical framing | skipped |
| Ch. 2 | Picturing propositions, term-way vs predicate-way | Intro L1 (partial) |
| Ch. 3 | Sign algebra, laws, transcription, singular statements | Intro L1–L3, L7 |
| Ch. 4 | Compound statements, 'or', relational statements, passive transformation, proterms | **Course 2** |
| Ch. 5 | REGAL method, enthymemes, matrix method, identity laws | Intro L5–L6 + **Course 2** |
| Ch. 6 | Relational syllogisms, dictum, distributed terms, indirect proofs | **Course 3** |
| Ch. 7 | Full statement logic: proofs, trees, DNF, statement logic as syllogistic branch | Intro L8 (highlight) + **Course 4** |
| Ch. 8 | TFL ↔ MPL bridge, translating relational statements | **Course 4** |

---

## Course 1: Introduction — 8 lessons ✅

All in `~/guides/term-functor-logic/introduction/curriculum.js`

| # | Title | Status |
|---|-------|--------|
| 1 | Terms and Propositions | ✅ |
| 2 | The Plus-Minus Sign Algebra | ✅ |
| 3 | The Four Categorical Forms (A/E/I/O) | ✅ |
| 4 | Immediate Inferences | ✅ |
| 5 | The Syllogism | ✅ |
| 6 | Named Patterns and the Figure Tradition | ✅ revised |
| 7 | Singular Terms | ✅ |
| 8 | Statement Logic as Term Logic | ✅ |

---

## Course 2: The Full Language — 7 lessons ✅

Dir: `guides/term-functor-logic/language-extended/`
Book: Ch. 4 (Language of Logic II) + Ch. 5 depth

| # | Title | Book | Status |
|---|-------|------|--------|
| 1 | Compound Statements | Ch. 4 §§1–6 | ✅ |
| 2 | Relational Statements | Ch. 4 §§8–12 | ✅ |
| 3 | The Passive Transformation | Ch. 4 §§14–16 | ✅ |
| 4 | Proterms and Pronominal Reference | Ch. 4 §§17–20 | ✅ |
| 5 | REGAL and Why It Works | Ch. 5 §§1–7 | ✅ |
| 6 | Enthymemes and the Matrix Method | Ch. 5 §§3, 11 | ✅ |
| 7 | Identity and the Laws of Identity | Ch. 5 §§9–10 | ✅ |

---

## Course 3: Relational Syllogisms — 3 lessons ✅

Dir: `guides/term-functor-logic/relational-syllogisms/`
Book: Ch. 6

| # | Title | Book | Status |
|---|-------|------|--------|
| 1 | The Dictum Applied to Relational Arguments | Ch. 6 §§1–2 | ✅ |
| 2 | Distributed Terms and DDO | Ch. 6 §§3–5 | ✅ |
| 3 | Indirect Proofs and Distributed Proterms | Ch. 6 §§6–9 | ✅ |

L1 conventions to carry forward: donor/host vocabulary from Course 2 L6; "cancellation is
position-blind"; the tautology move `−(R+T)+(R+T)`; L1 defers *computing* distribution inside
complexes (net signs, sign multiplication) to L2 — L1 only uses "+ occurrence vs − occurrence."

---

## Course 4: Statement Logic and the MPL Bridge — 6 lessons ✅

Dir: `guides/term-functor-logic/statement-logic-and-mpl/`
Book: Ch. 7 + Ch. 8

| # | Title | Book | Status |
|---|-------|------|--------|
| 1 | Contradictions, Tautologies, and Contingency | Ch. 7 §§1–5 | ✅ |
| 2 | Direct Proofs and the Tree Method | Ch. 7 §§6–13 | ✅ |
| 3 | DNF and the Subsumption of Statement Logic | Ch. 7 §§8, 16–17 | ✅ |
| 4 | MPL's Syntax and the Predicate Way | Ch. 8 §§1–6 | ✅ |
| 5 | Translating Between TFL and MPL | Ch. 8 §§7–10, 12–13 | ✅ |
| 6 | The Limits and Power of TFL | Ch. 8 §§14–19 | ✅ |

---

## Lesson counts

| Course | Lessons | Status |
|--------|---------|--------|
| Introduction | 8 | ✅ complete |
| The Full Language | 7 | ✅ complete |
| Relational Syllogisms | 3 | ✅ complete |
| Statement Logic and MPL | 6 | ✅ complete |
| **Total** | **24** | ✅ **curriculum complete** |

---

## Open questions

- **Laws of Commutation / Association** (Ch. 3 §§13, 19): used implicitly throughout Introduction but never explicitly taught. Could be a short addition to Introduction L2, or the opening of Course 2 L1.
- **REGAL acronym:** Not expanded in accessible excerpts — check the book directly when building Course 2 L5. Until confirmed, refer to it as "Sommers' algebraic validity test."
- **Course 2 lesson 1 note:** Compound statements builds on Introduction L8 (propositions as terms, if-then = A-form). Assume that lesson as prerequisite — don't re-teach, just recall.
- **Penguins item (L6, ex-mixed-final item 6):** Explanation revised in L6 rewrite — cleaner now but keep an eye on it.
- **Numerical quantifiers (Murphree):** Beyond the core book. Now planned: main roadmap
  Track D, steps D9 (TFL⁺ quantity levels in the lab engine) and D10 (advanced lesson —
  most/many/few via Peterson/Thompson/TFL⁺, Murphree as the frontier).
