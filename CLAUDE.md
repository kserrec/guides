# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Ham Calculus — interactive, Duolingo-style courses on formal systems (Lambda Calculus and Term Functor Logic), live at https://kserrec.github.io/guides/. Plain HTML/CSS/JS: **no build step, no bundler, no package.json, no backend**. Node is used only for dev-time test scripts. Deployment *is* `git push` to `main` (GitHub Pages, ~1 min) — everything on `main` is live, so never push half-finished lessons.

`ARCHITECTURE.md` is the full owner's manual — read the relevant section before nontrivial work. `ROADMAP.md` is both plan and decision log (all tracks A–D complete); read it before re-deciding anything.

## Commands

All tests are plain-assert scripts on bare node (no test runner; run the file directly):

```bash
node engine.test.js                              # course runtime (run after engine.js changes)
node lambda-calculus/lab/lambda.test.js          # lambda evaluator (run after lambda.js changes)
node term-functor-logic/lab/tfl.test.js          # TFL engine (run after tfl.js changes)
node term-functor-logic/lab/oracle.js -n 20000   # TFL semantic fuzz gate (also run for tfl.js inference changes)
node term-functor-logic/lab/audit.js             # every curriculum formula still parses (after TFL curriculum/parser edits)
node check-counts.js                             # hardcoded lesson counts on home/hub pages (after adding lessons/courses)
```

Local preview: `python3 -m http.server` from the repo root, browse `localhost:8000`.

Correctness bar for the logic engines is absolute: `lambda.js` teaches reduction and `tfl.js` *certifies validity* — a wrong answer teaches students wrong logic.

## Architecture (big picture)

Three page tiers, all static HTML linked by relative paths: home (`index.html`) → subject hubs (`<subject>/index.html`) → course pages (`<subject>/<course>/index.html`). Course pages are empty shells; everything is rendered by `engine.js` from a global `CURRICULUM` object defined in that course's `curriculum.js`. Progress lives in localStorage only.

The two labs follow one pattern: a **pure, DOM-free logic module** with node tests (`lambda-calculus/lab/lambda.js`, `term-functor-logic/lab/tfl.js`) + a **DOM-only UI layer** (`lab.js`) + a page-scoped script registering a lab-graded exercise kind on `ExerciseHandlers` (`write-exercise.js`, `tfl-exercise.js`). Keep logic and DOM strictly separated.

`engine.js` and the `lab.js` files have no automated tests — verify those changes in a real browser (headless Chrome against a local server; see ARCHITECTURE.md §9 for the technique).

Adding a lesson/course/subject/exercise kind: follow the recipes in ARCHITECTURE.md §11 — none of them require engine changes.

## Invariants that will bite you

Full list in ARCHITECTURE.md §10; the ones most often relevant:

- **Script order on course pages is load-bearing**: `curriculum.js` before `engine.js`; on TFL pages `tfl-helpers.js` first; on lambda pages `lambda.js` before `lab.js`/`write-exercise.js`.
- **Lesson `id`s and curriculum `title`s are localStorage persistence keys** — renaming/renumbering orphans users' saved progress.
- **The lambda prelude mirrors the Foundations course verbatim** — change both together or neither.
- **Multiple-choice display order is shuffled at render** — never write a choice referring to others by position; answers are stored by authored index.
- **Write-expression feedback must never reveal the expected answer** — describe what the user's expression did.
- **Hardcoded lesson counts** on home/hub pages are intentional duplication — bump them manually and run `check-counts.js`.
- **`λxy.M` is one parameter named `xy`**, not `λx.λy.M` — multi-parameter needs spaces (deliberate design decision).
- **CSP is strict** (`script-src 'self'`, no external resources ever). User input never reaches `innerHTML` unescaped; the `// authored HTML — trusted` sinks take only checked-in curriculum content.

## Workflow conventions

- Roadmap steps are sized for one agent prompt end-to-end; if a step grows, split it before starting.
- One roadmap step per commit, prefixed with the step id (`D8: …`). Completed steps get ✅ implementation notes in ROADMAP.md.
- Curriculum style: concept → quick-check cadence, an `explanation` on every exercise item, lessons end with an `isFinal: true` review.
