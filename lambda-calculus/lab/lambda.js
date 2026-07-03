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

  const isIdentStart = (c) => /[A-Za-z_]/.test(c);
  const isIdentChar  = (c) => /[A-Za-z0-9_']/.test(c);

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
      while (peek().kind === 'ident') params.push(next().text);
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

  return {
    Var, Lam, App, termEq, ParseError, tokenize, parse, print,
    freeVars, freshName, subst, step, reduce, getAt, alphaEq,
  };
});
