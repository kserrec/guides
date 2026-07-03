// lambda.test.js — run with: node lambda.test.js
'use strict';

const assert = require('node:assert');
const {
  Var, Lam, App, termEq, ParseError, parse, print,
  freeVars, subst, step, reduce, getAt, alphaEq,
} = require('./lambda.js');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); }
}

// Assert that `src` parses to exactly the AST `expected`.
function parsesTo(src, expected) {
  const got = parse(src);
  assert.ok(termEq(got, expected), `${src} parsed to ${print(got)}, expected ${print(expected)}`);
}

// Assert that parsing `src` throws a ParseError mentioning `msgPart`.
function failsWith(src, msgPart) {
  assert.throws(() => parse(src), (e) => {
    assert.ok(e instanceof ParseError, `expected ParseError, got ${e.constructor.name}`);
    assert.ok(typeof e.pos === 'number', 'ParseError should carry a position');
    assert.ok(e.message.includes(msgPart), `message "${e.message}" should include "${msgPart}"`);
    return true;
  });
}

// ── Basic forms ───────────────────────────────────────────────────────────

test('variable', () => parsesTo('x', Var('x')));
test('multi-char identifier', () => parsesTo('TRUE', Var('TRUE')));
test('identifier with prime and digits', () => parsesTo("x1'", Var("x1'")));
test('identity abstraction', () => parsesTo('λx.x', Lam('x', Var('x'))));
test('backslash lambda', () => parsesTo('\\x.x', Lam('x', Var('x'))));
test('simple application', () => parsesTo('f x', App(Var('f'), Var('x'))));

// ── Associativity and scope ───────────────────────────────────────────────

test('application is left-associative', () =>
  parsesTo('f x y', App(App(Var('f'), Var('x')), Var('y'))));

test('lambda body extends right', () =>
  parsesTo('λx.x y', Lam('x', App(Var('x'), Var('y')))));

test('parens override body extent', () =>
  parsesTo('(λx.x) y', App(Lam('x', Var('x')), Var('y'))));

test('nested abstractions', () =>
  parsesTo('λx.λy.x', Lam('x', Lam('y', Var('x')))));

test('multi-parameter sugar', () =>
  parsesTo('λx y.x', Lam('x', Lam('y', Var('x')))));

test('λxy is ONE parameter named xy', () =>
  parsesTo('λxy.xy', Lam('xy', Var('xy'))));

test('trailing lambda as final argument', () =>
  parsesTo('(λx.x) λy.y', App(Lam('x', Var('x')), Lam('y', Var('y')))));

test('trailing lambda body swallows rest', () =>
  // f λx.x y  ≡  f (λx.x y) — the abstraction body extends right
  parsesTo('f λx.x y', App(Var('f'), Lam('x', App(Var('x'), Var('y'))))));

test('whitespace and newlines ignored', () =>
  parsesTo('  λx  .\n  x  ', Lam('x', Var('x'))));

// ── Course expressions parse ──────────────────────────────────────────────

test('Church numeral 2', () =>
  parsesTo('λf.λx.f (f x)',
    Lam('f', Lam('x', App(Var('f'), App(Var('f'), Var('x')))))));

test('omega combinator', () =>
  parsesTo('(λx.x x) (λx.x x)',
    App(Lam('x', App(Var('x'), Var('x'))), Lam('x', App(Var('x'), Var('x'))))));

test('Y combinator', () =>
  parsesTo('λf.(λx.f (x x)) (λx.f (x x))',
    Lam('f', App(
      Lam('x', App(Var('f'), App(Var('x'), Var('x')))),
      Lam('x', App(Var('f'), App(Var('x'), Var('x'))))))));

// ── Errors ────────────────────────────────────────────────────────────────

test('empty input', () => failsWith('', 'Expected an expression'));
test('missing dot', () => failsWith('λx x', "Expected '.'"));
test('missing parameter', () => failsWith('λ.x', 'parameter'));
test('unclosed paren', () => failsWith('(λx.x', "Expected ')'"));
test('stray close paren', () => failsWith('x)', 'after expression'));
test('lone dot', () => failsWith('.', 'Expected an expression'));
test('illegal character', () => failsWith('x @ y', "Unexpected character '@'"));
test('empty lambda body', () => failsWith('λx.', 'Expected an expression'));
test('error position is exact', () => {
  try { parse('λx.x @'); assert.fail('should have thrown'); }
  catch (e) { assert.strictEqual(e.pos, 5); }
});

// ── Round-trip: parse ∘ print = identity ──────────────────────────────────

const roundTrips = [
  'x', 'f x', 'f x y', 'λx.x', 'λx.λy.x', 'λx.x y', '(λx.x) y',
  'x (y z)', '(λx.x x) (λx.x x)', 'λf.(λx.f (x x)) (λx.f (x x))',
  'λf.λx.f (f (f x))', '(λp.λq.p q p) (λx.λy.x) (λx.λy.y)',
  'f (λx.x) y', 'λx.x (λy.y) z',
];
for (const src of roundTrips) {
  test(`round-trip: ${src}`, () => {
    const t = parse(src);
    assert.ok(termEq(parse(print(t)), t), `print gave ${print(t)}`);
  });
}

// ── Print produces expected concrete syntax ───────────────────────────────

const prints = [
  ['(λx.x) y',          '(λx.x) y'],
  ['λx.(x y)',          'λx.x y'],        // redundant parens dropped
  ['(f x) y',           'f x y'],         // left-assoc parens dropped
  ['f (x y)',           'f (x y)'],       // right-nesting parens kept
  ['λx y.x',            'λx.λy.x'],       // sugar expands to nested λs
  ['\\f.\\x.f (f x)',   'λf.λx.f (f x)'], // backslash prints as λ
];
for (const [src, expected] of prints) {
  test(`print: ${src} → ${expected}`, () =>
    assert.strictEqual(print(parse(src)), expected));
}

// ── Free variables ────────────────────────────────────────────────────────

test('freeVars: bound vs free', () =>
  assert.deepStrictEqual([...freeVars(parse('λx.x y'))], ['y']));

test('freeVars: shadowing does not leak', () =>
  assert.deepStrictEqual([...freeVars(parse('λx.x (λy.y x)'))], []));

test('freeVars: same name bound and free', () =>
  // outer x is free, inner x is bound
  assert.deepStrictEqual([...freeVars(parse('x (λx.x)'))], ['x']));

// ── Substitution ──────────────────────────────────────────────────────────

test('subst: simple replacement', () =>
  assert.strictEqual(print(subst(parse('x y'), 'x', parse('λz.z'))), '(λz.z) y'));

test('subst: binder shadows substitution', () =>
  assert.strictEqual(print(subst(parse('λx.x'), 'x', parse('z'))), 'λx.x'));

test('subst: avoids capture by renaming binder', () =>
  // (λy.x)[x := y] must NOT become λy.y (capture) — binder is renamed
  assert.strictEqual(print(subst(parse('λy.x'), 'x', parse('y'))), "λy'.y"));

test('subst: rename avoids clashing with body variables', () => {
  // (λy.x y')[x := y] — fresh name must skip y' since it's free in the body
  const out = subst(parse("λy.x y'"), 'x', parse('y'));
  assert.strictEqual(print(out), "λy''.y y'");
});

test('subst: no rename when capture impossible', () =>
  assert.strictEqual(print(subst(parse('λy.x'), 'x', parse('z'))), 'λy.z'));

// ── Single stepping (normal order) ────────────────────────────────────────

test('step: variable is normal', () => assert.strictEqual(step(parse('x')), null));
test('step: abstraction of normal body is normal', () =>
  assert.strictEqual(step(parse('λx.x y')), null));

test('step: basic redex at root, empty path', () => {
  const s = step(parse('(λx.x) y'));
  assert.strictEqual(print(s.term), 'y');
  assert.deepStrictEqual(s.path, []);
});

test('step: leftmost-outermost — outer redex wins, arg discarded unevaluated', () => {
  const s = step(parse('(λx.z) ((λy.y) w)'));
  assert.strictEqual(print(s.term), 'z');
  assert.deepStrictEqual(s.path, []);
});

test('step: reduces under lambda', () => {
  const s = step(parse('λx.(λy.y) z'));
  assert.strictEqual(print(s.term), 'λx.z');
  assert.deepStrictEqual(s.path, ['body']);
});

test('step: descends into argument when function is normal', () => {
  const s = step(parse('f ((λx.x) y)'));
  assert.strictEqual(print(s.term), 'f y');
  assert.deepStrictEqual(s.path, ['arg']);
});

test('step: path locates a real redex in the input term', () => {
  const t = parse('f ((λx.x) y)');
  const s = step(t);
  const redex = getAt(t, s.path);
  assert.strictEqual(redex.type, 'app');
  assert.strictEqual(redex.fn.type, 'lam');
});

// ── Full reduction ────────────────────────────────────────────────────────

const num = (n) => {
  let body = 'x';
  for (let i = 0; i < n; i++) body = `f (${body})`;
  return parse(`λf.λx.${body}`);
};

test('reduce: PLUS 2 3 = 5', () => {
  const r = reduce(parse('(λm.λn.λf.λx.m f (n f x)) (λf.λx.f (f x)) (λf.λx.f (f (f x)))'));
  assert.strictEqual(r.status, 'normal');
  assert.ok(alphaEq(r.result, num(5)), `got ${print(r.result)}`);
});

test('reduce: MULT 2 3 = 6', () => {
  const r = reduce(parse('(λm.λn.λf.m (n f)) (λf.λx.f (f x)) (λf.λx.f (f (f x)))'));
  assert.ok(alphaEq(r.result, num(6)), `got ${print(r.result)}`);
});

test('reduce: AND TRUE FALSE = FALSE', () => {
  const r = reduce(parse('(λp.λq.p q p) (λx.λy.x) (λx.λy.y)'));
  assert.ok(alphaEq(r.result, parse('λx.λy.y')), `got ${print(r.result)}`);
});

test('reduce: omega exhausts fuel', () => {
  const r = reduce(parse('(λx.x x) (λx.x x)'), { maxSteps: 50 });
  assert.strictEqual(r.status, 'fuel-exhausted');
  assert.strictEqual(r.steps.length, 50);
});

test('reduce: normal order terminates where applicative would not', () => {
  // K-discard: (λx.λy.y) Ω z → z in 2 steps under normal order
  const r = reduce(parse('(λx.λy.y) ((λx.x x) (λx.x x)) z'), { maxSteps: 10 });
  assert.strictEqual(r.status, 'normal');
  assert.strictEqual(print(r.result), 'z');
  assert.strictEqual(r.steps.length, 2);
});

test('reduce: step list replays initial → result', () => {
  const t = parse('(λx.x) ((λy.y) z)');
  const r = reduce(t);
  assert.strictEqual(r.steps.length, 2);
  // each redexPath points at a redex in the term before that step
  let cur = t;
  for (const s of r.steps) {
    const redex = getAt(cur, s.redexPath);
    assert.strictEqual(redex.fn.type, 'lam');
    cur = s.term;
  }
  assert.ok(termEq(cur, r.result));
});

// ── Alpha-equivalence ─────────────────────────────────────────────────────

test('alphaEq: renamed bound variables', () =>
  assert.ok(alphaEq(parse('λx.x'), parse('λy.y'))));

test('alphaEq: K vs KI differ', () =>
  assert.ok(!alphaEq(parse('λx.λy.x'), parse('λx.λy.y'))));

test('alphaEq: free variables must match by name', () =>
  assert.ok(!alphaEq(parse('x'), parse('y'))));

test('alphaEq: bound vs free with same name', () =>
  assert.ok(!alphaEq(parse('λx.x'), parse('λy.x'))));

test('alphaEq: deep structural', () =>
  assert.ok(alphaEq(parse('λf.λx.f (f x)'), parse('λg.λy.g (g y)'))));

// ── Summary ───────────────────────────────────────────────────────────────

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
