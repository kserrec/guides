// lambda.js — Lambda Lab core engine (pure logic, no DOM).
// Loadable as a browser script (window.Lambda) or via require() in node.
//
// Notation accepted by the parser:
//   λx.M  or  \x.M          abstraction (body extends as far right as possible)
//   λx y z.M                multi-parameter sugar for λx.λy.λz.M
//   M N P                   application, left-associative: ((M N) P)
//   TRUE, x', foo_2         identifiers are multi-character: letters, digits,
//                           _ and ' (must not start with a digit). λxy.M is
//                           therefore ONE parameter named "xy" — separate
//                           multiple parameters with spaces: λx y.M
//   (λx.x) λy.y             a trailing abstraction may appear unparenthesized
//                           as the final argument of an application
//   0, 1, 42                numerals are built-in names for Church numerals
//                           (expanded on demand; cannot be λ-parameters)
//   -- comment              line comments (program level only)
//
// Programs (evalProgram) are definition lines `NAME = expr` followed by one
// final expression; indented lines continue the statement above (offside
// rule). Definitions may reference earlier definitions and the prelude;
// they cannot be recursive (use Y) or reference later definitions.
// User definitions shadow prelude names (Under the Hood redefines SUCC etc.
// Scott-style, so shadowing must work); a warning is recorded when they do.

(function (global, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  global.Lambda = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  // ── AST constructors ──────────────────────────────────────────────────

  const Var = (name)        => ({ type: 'var', name });
  const Lam = (param, body) => ({ type: 'lam', param, body });
  const App = (fn, arg)     => ({ type: 'app', fn, arg });

  // Structural (syntactic) equality. Alpha-equivalence arrives with the
  // evaluator; this is exact-name comparison for tests and round-trips.
  function termEq(a, b) {
    if (a.type !== b.type) return false;
    switch (a.type) {
      case 'var': return a.name === b.name;
      case 'lam': return a.param === b.param && termEq(a.body, b.body);
      case 'app': return termEq(a.fn, b.fn) && termEq(a.arg, b.arg);
    }
  }

  // ── Errors ────────────────────────────────────────────────────────────

  class ParseError extends Error {
    constructor(message, pos) {
      super(`${message} (at position ${pos})`);
      this.name = 'ParseError';
      this.pos = pos; // 0-based index into the source string
    }
  }

  // ── Tokenizer ─────────────────────────────────────────────────────────
  // Token: { kind: 'lambda'|'dot'|'lparen'|'rparen'|'ident'|'eof', text, pos }

  // Any Unicode letter except λ can start a name (the courses use ω and Ω).
  const isIdentStart = (c) => c !== 'λ' && /[\p{L}_]/u.test(c);
  const isIdentChar  = (c) => c !== 'λ' && /[\p{L}0-9_']/u.test(c);

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
      if (c === 'λ' || c === '\\') { tokens.push({ kind: 'lambda', text: c, pos: i }); i++; continue; }
      if (c === '.') { tokens.push({ kind: 'dot',    text: c, pos: i }); i++; continue; }
      if (c === '(') { tokens.push({ kind: 'lparen', text: c, pos: i }); i++; continue; }
      if (c === ')') { tokens.push({ kind: 'rparen', text: c, pos: i }); i++; continue; }
      if (isIdentStart(c)) {
        let j = i + 1;
        while (j < src.length && isIdentChar(src[j])) j++;
        tokens.push({ kind: 'ident', text: src.slice(i, j), pos: i });
        i = j;
        continue;
      }
      if (/[0-9]/.test(c)) {
        let j = i + 1;
        while (j < src.length && /[0-9]/.test(src[j])) j++;
        if (j < src.length && isIdentChar(src[j])) {
          throw new ParseError(`Invalid name '${src.slice(i, j + 1)}…' — names cannot start with a digit`, i);
        }
        tokens.push({ kind: 'ident', text: src.slice(i, j), pos: i });
        i = j;
        continue;
      }
      throw new ParseError(`Unexpected character '${c}'`, i);
    }
    tokens.push({ kind: 'eof', text: '', pos: src.length });
    return tokens;
  }

  // ── Parser ────────────────────────────────────────────────────────────
  // term := lam | app
  // lam  := ('λ'|'\') ident+ '.' term
  // app  := atom+ lam?          (left-associative)
  // atom := ident | '(' term ')'

  function parse(src) {
    const tokens = tokenize(src);
    let i = 0;

    const peek = () => tokens[i];
    const next = () => tokens[i++];

    function expect(kind, what) {
      const t = peek();
      if (t.kind !== kind) {
        throw new ParseError(`Expected ${what}, found ${describe(t)}`, t.pos);
      }
      return next();
    }

    function describe(t) {
      return t.kind === 'eof' ? 'end of input' : `'${t.text}'`;
    }

    function parseTerm() {
      if (peek().kind === 'lambda') return parseLam();
      return parseApp();
    }

    function parseLam() {
      next(); // consume λ
      const params = [];
      while (peek().kind === 'ident') {
        const t = next();
        if (isNumeralName(t.text)) {
          throw new ParseError(`Cannot use numeral '${t.text}' as a parameter`, t.pos);
        }
        params.push(t.text);
      }
      if (params.length === 0) {
        throw new ParseError(`Expected a parameter name after λ, found ${describe(peek())}`, peek().pos);
      }
      expect('dot', "'.' after parameters");
      const body = parseTerm();
      return params.reduceRight((acc, p) => Lam(p, acc), body);
    }

    function parseApp() {
      let term = parseAtom();
      for (;;) {
        const t = peek();
        if (t.kind === 'ident' || t.kind === 'lparen') {
          term = App(term, parseAtom());
        } else if (t.kind === 'lambda') {
          term = App(term, parseLam()); // trailing abstraction as final argument
          return term;
        } else {
          return term;
        }
      }
    }

    function parseAtom() {
      const t = peek();
      if (t.kind === 'ident') { next(); return Var(t.text); }
      if (t.kind === 'lparen') {
        next();
        const term = parseTerm();
        expect('rparen', "')'");
        return term;
      }
      throw new ParseError(`Expected an expression, found ${describe(t)}`, t.pos);
    }

    const term = parseTerm();
    const t = peek();
    if (t.kind !== 'eof') {
      throw new ParseError(`Unexpected ${describe(t)} after expression`, t.pos);
    }
    return term;
  }

  // ── Pretty printer ────────────────────────────────────────────────────
  // Minimal parentheses, matching course notation (nested λs stay nested:
  // λx.λy.x, not λx y.x). Guarantee: parse(print(t)) is structurally t.

  function print(t) {
    switch (t.type) {
      case 'var': return t.name;
      case 'lam': return `λ${t.param}.${print(t.body)}`;
      case 'app': {
        const fn  = t.fn.type === 'lam'  ? `(${print(t.fn)})`  : print(t.fn);
        const arg = t.arg.type === 'var' ? t.arg.name          : `(${print(t.arg)})`;
        return `${fn} ${arg}`;
      }
    }
  }

  // ── Evaluator ─────────────────────────────────────────────────────────

  function freeVars(t, acc = new Set(), bound = new Set()) {
    switch (t.type) {
      case 'var':
        if (!bound.has(t.name)) acc.add(t.name);
        return acc;
      case 'lam': {
        const inner = new Set(bound);
        inner.add(t.param);
        return freeVars(t.body, acc, inner);
      }
      case 'app':
        freeVars(t.fn, acc, bound);
        return freeVars(t.arg, acc, bound);
    }
  }

  // Smallest primed variant of `base` not in `avoid`: x → x' → x'' → …
  function freshName(base, avoid) {
    let name = base;
    do { name += "'"; } while (avoid.has(name));
    return name;
  }

  // Capture-avoiding substitution: t[name := replacement].
  // When a binder would capture a free variable of `replacement`, the
  // binder is alpha-renamed to a fresh primed name first.
  function subst(t, name, replacement) {
    switch (t.type) {
      case 'var':
        return t.name === name ? replacement : t;
      case 'app':
        return App(subst(t.fn, name, replacement), subst(t.arg, name, replacement));
      case 'lam': {
        if (t.param === name) return t; // binder shadows the substitution
        const bodyFree = freeVars(t.body);
        if (!bodyFree.has(name)) return t; // nothing to replace below
        if (freeVars(replacement).has(t.param)) {
          const avoid = new Set([...bodyFree, ...freeVars(replacement), name]);
          const renamed = freshName(t.param, avoid);
          const body = subst(t.body, t.param, Var(renamed));
          return Lam(renamed, subst(body, name, replacement));
        }
        return Lam(t.param, subst(t.body, name, replacement));
      }
    }
  }

  // One normal-order (leftmost-outermost) beta step.
  // Returns { term, path } where `path` locates the reduced redex in the
  // INPUT term as a list of 'fn' | 'arg' | 'body' moves from the root.
  // Returns null when the term is in normal form.
  function step(t) {
    switch (t.type) {
      case 'var':
        return null;
      case 'lam': {
        const s = step(t.body);
        return s ? { term: Lam(t.param, s.term), path: ['body', ...s.path] } : null;
      }
      case 'app': {
        if (t.fn.type === 'lam') {
          return { term: subst(t.fn.body, t.fn.param, t.arg), path: [] };
        }
        let s = step(t.fn);
        if (s) return { term: App(s.term, t.arg), path: ['fn', ...s.path] };
        s = step(t.arg);
        if (s) return { term: App(t.fn, s.term), path: ['arg', ...s.path] };
        return null;
      }
    }
  }

  // Reduce to normal form, or stop after maxSteps.
  // steps[i].redexPath locates the redex in the term BEFORE that step
  // (steps[0]'s path refers to `initial`); steps[i].term is the result.
  function reduce(term, { maxSteps = 1000 } = {}) {
    const steps = [];
    let current = term;
    for (let n = 0; n < maxSteps; n++) {
      const s = step(current);
      if (!s) return { initial: term, steps, result: current, status: 'normal' };
      steps.push({ redexPath: s.path, term: s.term });
      current = s.term;
    }
    return { initial: term, steps, result: current, status: 'fuel-exhausted' };
  }

  // The subterm of `t` at `path` (a list of 'fn' | 'arg' | 'body' moves).
  function getAt(t, path) {
    let cur = t;
    for (const move of path) {
      cur = move === 'fn' ? cur.fn : move === 'arg' ? cur.arg : cur.body;
    }
    return cur;
  }

  // Alpha-equivalence: equal up to consistent renaming of bound variables.
  function alphaEq(a, b) {
    function go(a, b, envA, envB, depth) {
      if (a.type !== b.type) return false;
      switch (a.type) {
        case 'var': {
          const da = envA.get(a.name), db = envB.get(b.name);
          if (da !== undefined || db !== undefined) return da === db;
          return a.name === b.name; // both free
        }
        case 'lam': {
          const ea = new Map(envA); ea.set(a.param, depth);
          const eb = new Map(envB); eb.set(b.param, depth);
          return go(a.body, b.body, ea, eb, depth + 1);
        }
        case 'app':
          return go(a.fn, b.fn, envA, envB, depth)
              && go(a.arg, b.arg, envA, envB, depth);
      }
    }
    return go(a, b, new Map(), new Map(), 0);
  }

  // ── Numerals ──────────────────────────────────────────────────────────
  // Digit tokens (0, 1, 42 …) are ordinary names whose definitions are
  // generated on demand as Church numerals.

  function isNumeralName(s) { return /^[0-9]+$/.test(s); }

  function churchNumeral(n) {
    let body = Var('x');
    for (let i = 0; i < n; i++) body = App(Var('f'), body);
    return Lam('f', Lam('x', body));
  }

  // ── Prelude ───────────────────────────────────────────────────────────
  // Every definition is verbatim from the Foundations course (each may
  // reference only earlier prelude names and numerals). Note the course's
  // names: ADD (not PLUS), IS_NIL (not ISNIL); no IF (booleans are applied
  // directly) and no TAIL (fold-encoded lists don't get one).

  const PRELUDE_SRC = [
    // Booleans — Lesson 5
    ['TRUE',       'λx.λy.x'],
    ['FALSE',      'λx.λy.y'],
    ['NOT',        'λb.b FALSE TRUE'],
    ['AND',        'λb.λc.b c FALSE'],
    ['OR',         'λb.λc.b TRUE c'],
    // Divergence — Lesson 3
    ['ω',          'λx.x x'],
    ['Ω',          '(λx.x x) (λx.x x)'],
    // Numerals & arithmetic — Lessons 6–7
    ['SUCC',       'λn.λf.λx.f (n f x)'],
    ['ADD',        'λm.λn.λf.λx.m f (n f x)'],
    ['MULT',       'λm.λn.λf.m (n f)'],
    ['ISZERO',     'λn.n (λx.FALSE) TRUE'],
    // Pairs & subtraction — Lessons 8–9
    ['PAIR',       'λx.λy.λf.f x y'],
    ['FST',        'λp.p TRUE'],
    ['SND',        'λp.p FALSE'],
    ['SHIFT',      'λp.PAIR (SUCC (FST p)) (FST p)'],
    ['PRED',       'λn.SND (n SHIFT (PAIR 0 0))'],
    ['SUB',        'λm.λn.n PRED m'],
    ['LEQ',        'λm.λn.ISZERO (SUB m n)'],
    ['EQ',         'λm.λn.AND (LEQ m n) (LEQ n m)'],
    // Recursion — Lessons 10–11
    ['Y',          'λf.(λx.f (x x)) (λx.f (x x))'],
    ['FACT_STEP',  'λrec.λn.ISZERO n 1 (MULT n (rec (PRED n)))'],
    ['FACT',       'Y FACT_STEP'],
    ['DIV_STEP',   'λrec.λm.λn.LEQ n m (SUCC (rec (SUB m n) n)) 0'],
    ['DIV',        'Y DIV_STEP'],
    ['MOD_STEP',   'λrec.λm.λn.LEQ n m (rec (SUB m n) n) m'],
    ['MOD',        'Y MOD_STEP'],
    // Lists (fold-encoded) — Lessons 12–15
    ['NIL',        'λc.λn.n'],
    ['CONS',       'λh.λt.λc.λn.c h (t c n)'],
    ['IS_NIL',     'λl.l (λh.λt.FALSE) TRUE'],
    ['HEAD',       'λl.l (λh.λt.h) FALSE'],
    ['MAP',        'λf.λl.l (λh.λr.CONS (f h) r) NIL'],
    ['FILTER',     'λf.λl.l (λh.λr.f h (CONS h r) r) NIL'],
    ['LENGTH',     'λl.l (λh.λr.SUCC r) 0'],
    ['SUM',        'λl.l ADD 0'],
    ['APPEND',     'λl1.λl2.l1 CONS l2'],
    ['REVERSE',    'λl.l (λh.λacc.APPEND acc (CONS h NIL)) NIL'],
    ['FLATTEN',    'λl.l APPEND NIL'],
    ['ANY',        'λf.λl.l (λh.λr.OR (f h) r) FALSE'],
    ['ALL',        'λf.λl.l (λh.λr.AND (f h) r) TRUE'],
    ['RANGE_STEP', 'λrec.λn.ISZERO n NIL (APPEND (rec (PRED n)) (CONS n NIL))'],
    ['RANGE',      'Y RANGE_STEP'],
  ];

  const PRELUDE = new Map(PRELUDE_SRC.map(([name, src]) => [name, parse(src)]));

  // ── Programs: definitions + one expression ────────────────────────────

  class ProgramError extends Error {
    // Wrapped parse errors also carry `source` (the statement's text) and
    // `offset` (index into it) so a UI can draw a caret under the error.
    constructor(message, line, source, offset) {
      super(line ? `Line ${line}: ${message}` : message);
      this.name = 'ProgramError';
      this.line = line;     // 1-based, when known
      this.source = source; // statement text, when wrapping a ParseError
      this.offset = offset; // 0-based index into source, when known
    }
  }

  // First (leftmost-outermost) free variable of `t` for which isDefined
  // holds, or null.
  function findDefinedFree(t, isDefined, bound = new Set()) {
    switch (t.type) {
      case 'var':
        return !bound.has(t.name) && isDefined(t.name) ? t.name : null;
      case 'lam': {
        const inner = new Set(bound);
        inner.add(t.param);
        return findDefinedFree(t.body, isDefined, inner);
      }
      case 'app':
        return findDefinedFree(t.fn, isDefined, bound)
            ?? findDefinedFree(t.arg, isDefined, bound);
    }
  }

  // Delta-expansion: replace defined names with their definitions, one name
  // per step (all its occurrences at once), until none remain. Terminates
  // because definitions may only reference strictly earlier ones.
  function expandNames(term, lookup, isDefined) {
    const deltas = [];
    for (let guard = 0; guard < 10000; guard++) {
      const name = findDefinedFree(term, isDefined);
      if (name === null) return { term, deltas };
      term = subst(term, name, lookup(name));
      deltas.push({ name, term });
    }
    throw new ProgramError('Name expansion did not finish — the program expands to an enormous term');
  }

  // Evaluate a program: `NAME = expr` definition lines, then one final
  // expression. A line starting with whitespace continues the previous
  // statement (offside rule); a line at column 0 starts a new one.
  // `--` starts a comment. Returns:
  //   { definitions, warnings, status: 'no-expression' }               or
  //   { definitions, warnings, expr, deltas, expanded,
  //     steps, result, status: 'normal'|'fuel-exhausted', readback }
  function evalProgram(src, { maxSteps = 5000 } = {}) {
    const lines = src.split('\n').map((l) => l.replace(/--.*$/, ''));
    // Name charset must mirror the tokenizer's: Unicode letters except λ.
    const defLine = /^\s*((?!λ)[\p{L}_](?:(?!λ)[\p{L}0-9_'])*)\s*=\s*(.*)$/u;

    const stmts = [];
    let current = null;
    lines.forEach((raw, idx) => {
      if (raw.trim() === '') { current = null; return; }
      if (current && /^[ \t]/.test(raw)) { current.text += '\n' + raw; return; }
      const m = raw.match(defLine);
      current = m
        ? { kind: 'def', name: m[1], text: m[2], line: idx + 1 }
        : { kind: 'expr', text: raw, line: idx + 1 };
      stmts.push(current);
    });

    const defs  = stmts.filter((s) => s.kind === 'def');
    const exprs = stmts.filter((s) => s.kind === 'expr');
    if (exprs.length > 1) {
      throw new ProgramError('A program is definitions plus ONE final expression — found a second expression', exprs[1].line);
    }

    const userEnv  = new Map();
    const warnings = [];
    const defIndex = new Map(defs.map((d, i) => [d.name, i]));
    defs.forEach((d, i) => {
      if (userEnv.has(d.name)) {
        throw new ProgramError(`'${d.name}' is defined twice`, d.line);
      }
      let term;
      try { term = parse(d.text); }
      catch (e) { throw new ProgramError(`in definition of '${d.name}': ${e.message}`, d.line, d.text, e.pos); }
      for (const f of freeVars(term)) {
        if (f === d.name) {
          throw new ProgramError(`'${d.name}' refers to itself — definitions cannot be recursive. Build recursion with Y instead`, d.line);
        }
        const j = defIndex.get(f);
        if (j !== undefined && j > i) {
          throw new ProgramError(`'${d.name}' uses '${f}' before it is defined`, d.line);
        }
      }
      if (PRELUDE.has(d.name)) warnings.push(`'${d.name}' shadows the built-in definition`);
      userEnv.set(d.name, term);
    });

    const definitions = defs.map((d) => ({ name: d.name, term: userEnv.get(d.name) }));
    if (exprs.length === 0) return { definitions, warnings, status: 'no-expression' };

    let expr;
    try { expr = parse(exprs[0].text); }
    catch (e) { throw new ProgramError(e.message, exprs[0].line, exprs[0].text, e.pos); }

    const isDefined = (n) => userEnv.has(n) || PRELUDE.has(n) || isNumeralName(n);
    const lookup    = (n) => userEnv.get(n) ?? PRELUDE.get(n) ?? churchNumeral(parseInt(n, 10));

    const { term: expanded, deltas } = expandNames(expr, lookup, isDefined);
    const r = reduce(expanded, { maxSteps });
    return {
      definitions, warnings, expr, deltas, expanded,
      steps: r.steps, result: r.result, status: r.status,
      readback: readback(r.result),
    };
  }

  // ── Readback ──────────────────────────────────────────────────────────
  // Recognize encoded values in normal forms for friendly display.

  // λf.λx.f (f … x) → n, else null.
  function numeralValue(t) {
    if (t.type !== 'lam' || t.body.type !== 'lam') return null;
    const f = t.param, x = t.body.param;
    let cur = t.body.body, count = 0;
    while (cur.type === 'app' && cur.fn.type === 'var' && cur.fn.name === f) {
      if (f === x) return null; // both binders share a name: only 0 is unambiguous
      count++;
      cur = cur.arg;
    }
    return cur.type === 'var' && cur.name === x ? count : null;
  }

  function isTrueTerm(t) {
    return t.type === 'lam' && t.body.type === 'lam'
        && t.param !== t.body.param
        && t.body.body.type === 'var' && t.body.body.name === t.param;
  }

  // λc.λn.c h₁ (c h₂ (… n)) → [h₁, h₂, …] (nonempty), else null.
  function listElements(t) {
    if (t.type !== 'lam' || t.body.type !== 'lam') return null;
    const c = t.param, n = t.body.param;
    if (c === n) return null;
    const elems = [];
    let cur = t.body.body;
    while (cur.type === 'app' && cur.fn.type === 'app'
        && cur.fn.fn.type === 'var' && cur.fn.fn.name === c) {
      const h = cur.fn.arg;
      const fv = freeVars(h);
      if (fv.has(c) || fv.has(n)) return null;
      elems.push(h);
      cur = cur.arg;
    }
    return cur.type === 'var' && cur.name === n && elems.length > 0 ? elems : null;
  }

  // λf.f A B → [A, B], else null.
  function pairParts(t) {
    if (t.type !== 'lam') return null;
    const b = t.body;
    if (b.type !== 'app' || b.fn.type !== 'app'
     || b.fn.fn.type !== 'var' || b.fn.fn.name !== t.param) return null;
    const fst = b.fn.arg, snd = b.arg;
    if (freeVars(fst).has(t.param) || freeVars(snd).has(t.param)) return null;
    return [fst, snd];
  }

  // Friendly rendering of an encoded value, or null for a plain function.
  // λa.λb.b is simultaneously 0, FALSE, and NIL (the course makes a point
  // of this pun); at top level we show all three, inside containers just 0.
  function readback(t, { nested = false } = {}) {
    const rb = (e) => readback(e, { nested: true }) ?? print(e);
    const n = numeralValue(t);
    if (n === 0) return nested ? '0' : '0 ≡ FALSE ≡ NIL';
    if (n !== null) return String(n);
    if (isTrueTerm(t)) return 'TRUE';
    const els = listElements(t);
    if (els) return `[${els.map(rb).join(', ')}]`;
    const p = pairParts(t);
    if (p) return `⟨${p.map(rb).join(', ')}⟩`;
    return null;
  }

  // ── Answer checking (write-expression exercises) ──────────────────────
  // Three modes:
  //   tests: [{args, expect}] — apply the user's expression to each args
  //     list and compare normal forms with `expect` (the sound way to grade
  //     function-writing: different implementations of the same function
  //     have different normal forms, but agree on applications).
  //   mode 'beta' (default) — user and expected reduce to alpha-equivalent
  //     normal forms.
  //   mode 'alpha' — the expression as written is alpha-equivalent to the
  //     expected one (no reduction; for syntax drills).
  // Returns { ok } or { ok: false, message } (message names no answers).

  function checkExpression(userSrc, expectedSrc, { mode = 'beta', tests = null, maxSteps = 20000 } = {}) {
    const show = (t) => {
      const r = readback(t);
      return r !== null ? `${r}` : print(t);
    };

    let userProg;
    try { userProg = evalProgram(userSrc, { maxSteps }); }
    catch (e) { return { ok: false, message: e.message }; }
    if (userProg.status === 'no-expression') {
      return { ok: false, message: 'Enter an expression (definitions alone have nothing to check).' };
    }

    if (tests && tests.length) {
      if (userProg.definitions.length > 0) {
        return { ok: false, message: 'Enter a single expression (no definition lines) for this one.' };
      }
      for (const t of tests) {
        const argsSrc = t.args.join(' ');
        let got;
        try { got = evalProgram(`(${userSrc.trim()}) ${argsSrc}`, { maxSteps }); }
        catch (e) { return { ok: false, message: e.message }; }
        if (got.status !== 'normal') {
          return { ok: false, message: `Applied to ${argsSrc}, your expression never reached a normal form.` };
        }
        const want = evalProgram(t.expect, { maxSteps });
        if (!alphaEq(got.result, want.result)) {
          return { ok: false, message: `Applied to ${argsSrc} it gives ${show(got.result)}, but should give ${show(want.result)}.` };
        }
      }
      return { ok: true };
    }

    if (mode === 'alpha') {
      const expected = parse(expectedSrc);
      return alphaEq(userProg.expr, expected)
        ? { ok: true }
        : { ok: false, message: 'Not the same expression (allowing renamed bound variables). Check the structure.' };
    }

    if (userProg.status !== 'normal') {
      return { ok: false, message: 'Your expression never reaches a normal form.' };
    }
    const expProg = evalProgram(expectedSrc, { maxSteps });
    return alphaEq(userProg.result, expProg.result)
      ? { ok: true }
      : { ok: false, message: `Your expression reduces to ${show(userProg.result)} — not what's asked for.` };
  }

  // ── HTML printer ──────────────────────────────────────────────────────
  // print() with HTML escaping and an optional highlight for the trace UI:
  //   { path: [...] }  wraps the subterm at that redex path in <mark>
  //   { name: 'ADD' }  wraps free occurrences of the name in <mark>
  // Parenthesization matches print() exactly.

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function printHtml(t, mark = null) {
    const MARK = (s) => `<mark class="lab-mark">${s}</mark>`;
    // path: remaining moves to the marked redex, or null (not on the path)
    const sub = (path, move) =>
      path !== null && path.length > 0 && path[0] === move ? path.slice(1) : null;

    function go(t, path, bound) {
      const here = path !== null && path.length === 0;
      let out;
      switch (t.type) {
        case 'var':
          out = escHtml(t.name);
          if (mark && mark.name === t.name && !bound.has(t.name)) out = MARK(out);
          break;
        case 'lam': {
          const inner = new Set(bound);
          inner.add(t.param);
          out = `λ${escHtml(t.param)}.${go(t.body, sub(path, 'body'), inner)}`;
          break;
        }
        case 'app': {
          const fnH  = go(t.fn,  sub(path, 'fn'),  bound);
          const argH = go(t.arg, sub(path, 'arg'), bound);
          const fnW  = t.fn.type === 'lam'  ? `(${fnH})`  : fnH;
          const argW = t.arg.type === 'var' ? argH        : `(${argH})`;
          out = `${fnW} ${argW}`;
          break;
        }
      }
      return here ? MARK(out) : out;
    }
    return go(t, mark && mark.path ? mark.path : null, new Set());
  }

  return {
    Var, Lam, App, termEq, ParseError, tokenize, parse, print,
    freeVars, freshName, subst, step, reduce, getAt, alphaEq,
    isNumeralName, churchNumeral, PRELUDE, PRELUDE_SRC,
    ProgramError, evalProgram, readback, printHtml, checkExpression,
  };
});
