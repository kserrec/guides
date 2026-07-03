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

  return { Var, Lam, App, termEq, ParseError, tokenize, parse, print };
});
