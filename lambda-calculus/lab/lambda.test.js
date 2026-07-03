// lambda.test.js — run with: node lambda.test.js
'use strict';

const assert = require('node:assert');
const { Var, Lam, App, termEq, ParseError, parse, print } = require('./lambda.js');

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

// ── Summary ───────────────────────────────────────────────────────────────

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
