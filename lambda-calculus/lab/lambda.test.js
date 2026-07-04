// lambda.test.js — run with: node lambda.test.js
'use strict';

const assert = require('node:assert');
const {
  Var, Lam, App, termEq, ParseError, parse, print,
  freeVars, subst, step, reduce, getAt, alphaEq,
  churchNumeral, PRELUDE, PRELUDE_SRC, ProgramError, evalProgram, readback,
  printHtml, checkExpression,
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

// ── Numerals ──────────────────────────────────────────────────────────────

test('numeral literal parses as a name', () => parsesTo('2', Var('2')));
test('numeral cannot start an identifier', () => failsWith('2x', 'cannot start with a digit'));
test('numeral cannot be a parameter', () => failsWith('λ2.x', "numeral '2'"));
test('churchNumeral shape', () =>
  assert.ok(alphaEq(churchNumeral(2), parse('λf.λx.f (f x)'))));

// ── Program evaluation ────────────────────────────────────────────────────

function run(src, opts) { return evalProgram(src, opts); }

function programFails(src, msgPart) {
  assert.throws(() => evalProgram(src), (e) => {
    assert.ok(e instanceof ProgramError, `expected ProgramError, got ${e.name}: ${e.message}`);
    assert.ok(e.message.includes(msgPart), `message "${e.message}" should include "${msgPart}"`);
    return true;
  });
}

test('program: ADD 2 3 = 5', () => {
  const r = run('ADD 2 3');
  assert.strictEqual(r.status, 'normal');
  assert.strictEqual(r.readback, '5');
});

test('program: delta steps are recorded per name', () => {
  const r = run('ADD 2 3');
  assert.deepStrictEqual(r.deltas.map((d) => d.name), ['ADD', '2', '3']);
});

test('program: user definition', () => {
  const r = run('DOUBLE = λn.MULT 2 n\nDOUBLE 4');
  assert.strictEqual(r.readback, '8');
});

test('program: definitions chain in order', () => {
  const r = run('SQ = λn.MULT n n\nQUAD = λn.SQ (SQ n)\nQUAD 2');
  assert.strictEqual(r.readback, '16');
});

test('program: shadowing prelude warns and wins', () => {
  const r = run('TRUE = λx.λy.y\nTRUE a b');
  assert.strictEqual(print(r.result), 'b');
  assert.ok(r.warnings.some((w) => w.includes('shadows')));
});

test('program: self-reference suggests Y', () =>
  programFails('F = λn.F n\nF 1', 'Build recursion with Y'));

test('program: forward reference', () =>
  programFails('A = B x\nB = λx.x\nA', "uses 'B' before"));

test('program: duplicate definition', () =>
  programFails('A = λx.x\nA = λy.y\nA', 'defined twice'));

test('program: two expressions rejected with line number', () =>
  programFails('x y\n\nz', 'Line 3'));

test('program: defs-only', () => {
  const r = run('ID = λx.x');
  assert.strictEqual(r.status, 'no-expression');
  assert.strictEqual(r.definitions.length, 1);
});

test('program: comments and blank lines', () => {
  const r = run('-- doubles a number\nD = λn.ADD n n  -- via ADD\n\nD 3');
  assert.strictEqual(r.readback, '6');
});

test('program: definition spanning lines', () => {
  const r = run('COMPOSE = λf.λg.\n  λx.f (g x)\nCOMPOSE SUCC SUCC 1');
  assert.strictEqual(r.readback, '3');
});

test('program: parse error carries definition line', () =>
  programFails('ID = λx.x\nBAD = λx.\nID 1', 'Line 2'));

test('program: free variables stay free', () => {
  const r = run('(λx.x) someUnknown');
  assert.strictEqual(print(r.result), 'someUnknown');
});

test('program: omega exhausts fuel', () => {
  const r = run('(λx.x x) (λx.x x)', { maxSteps: 30 });
  assert.strictEqual(r.status, 'fuel-exhausted');
});

// ── Prelude agrees with the course ────────────────────────────────────────

test('prelude: parses and is acyclic (only earlier names)', () => {
  const seen = new Set();
  for (const [name, src] of PRELUDE_SRC) {
    const t = parse(src);
    for (const f of freeVars(t)) {
      assert.ok(seen.has(f) || /^[0-9]+$/.test(f),
        `${name} references ${f}, which is not defined before it`);
    }
    seen.add(name);
  }
  assert.strictEqual(PRELUDE.size, PRELUDE_SRC.length);
});

test('prelude: NOT TRUE = FALSE', () =>
  assert.strictEqual(run('NOT TRUE').readback, '0 ≡ FALSE ≡ NIL'));
test('prelude: AND TRUE TRUE = TRUE', () =>
  assert.strictEqual(run('AND TRUE TRUE').readback, 'TRUE'));
test('prelude: SUCC 2 = 3', () =>
  assert.strictEqual(run('SUCC 2').readback, '3'));
test('prelude: MULT 3 4 = 12', () =>
  assert.strictEqual(run('MULT 3 4').readback, '12'));
test('prelude: PRED 3 = 2', () =>
  assert.strictEqual(run('PRED 3').readback, '2'));
test('prelude: SUB 5 2 = 3', () =>
  assert.strictEqual(run('SUB 5 2').readback, '3'));
test('prelude: ISZERO 0 = TRUE', () =>
  assert.strictEqual(run('ISZERO 0').readback, 'TRUE'));
test('prelude: LEQ 2 3 = TRUE', () =>
  assert.strictEqual(run('LEQ 2 3').readback, 'TRUE'));
test('prelude: EQ 2 2 = TRUE', () =>
  assert.strictEqual(run('EQ 2 2').readback, 'TRUE'));
test('prelude: EQ 2 3 = FALSE', () =>
  assert.strictEqual(run('EQ 2 3').readback, '0 ≡ FALSE ≡ NIL'));
test('prelude: FACT 3 = 6', () =>
  assert.strictEqual(run('FACT 3', { maxSteps: 20000 }).readback, '6'));
test('prelude: DIV 6 2 = 3', () =>
  assert.strictEqual(run('DIV 6 2', { maxSteps: 20000 }).readback, '3'));
test('prelude: MOD 5 2 = 1', () =>
  assert.strictEqual(run('MOD 5 2', { maxSteps: 20000 }).readback, '1'));
test('prelude: pairs', () =>
  assert.strictEqual(run('PAIR 1 2').readback, '⟨1, 2⟩'));
test('prelude: FST (PAIR 1 2) = 1', () =>
  assert.strictEqual(run('FST (PAIR 1 2)').readback, '1'));
test('prelude: list literal', () =>
  assert.strictEqual(run('CONS 1 (CONS 2 NIL)').readback, '[1, 2]'));
test('prelude: HEAD', () =>
  assert.strictEqual(run('HEAD (CONS 1 (CONS 2 NIL))').readback, '1'));
test('prelude: IS_NIL NIL = TRUE', () =>
  assert.strictEqual(run('IS_NIL NIL').readback, 'TRUE'));
test('prelude: MAP SUCC [1,2] = [2,3]', () =>
  assert.strictEqual(run('MAP SUCC (CONS 1 (CONS 2 NIL))').readback, '[2, 3]'));
test('prelude: FILTER ISZERO [0,1,0]', () =>
  assert.strictEqual(run('FILTER ISZERO (CONS 0 (CONS 1 (CONS 0 NIL)))').readback, '[0, 0]'));
test('prelude: LENGTH [1,2,3] = 3', () =>
  assert.strictEqual(run('LENGTH (CONS 1 (CONS 2 (CONS 3 NIL)))').readback, '3'));
test('prelude: SUM [1,2,3] = 6', () =>
  assert.strictEqual(run('SUM (CONS 1 (CONS 2 (CONS 3 NIL)))').readback, '6'));
test('prelude: APPEND [1] [2] = [1, 2]', () =>
  assert.strictEqual(run('APPEND (CONS 1 NIL) (CONS 2 NIL)').readback, '[1, 2]'));
test('prelude: REVERSE [1,2,3] = [3,2,1]', () =>
  assert.strictEqual(run('REVERSE (CONS 1 (CONS 2 (CONS 3 NIL)))', { maxSteps: 20000 }).readback, '[3, 2, 1]'));
test('prelude: RANGE 3 = [1,2,3]', () =>
  assert.strictEqual(run('RANGE 3', { maxSteps: 50000 }).readback, '[1, 2, 3]'));
test('prelude: ANY ISZERO [1,0] = TRUE', () =>
  assert.strictEqual(run('ANY ISZERO (CONS 1 (CONS 0 NIL))').readback, 'TRUE'));
test('prelude: ALL ISZERO [1,0] = FALSE', () =>
  assert.strictEqual(run('ALL ISZERO (CONS 1 (CONS 0 NIL))').readback, '0 ≡ FALSE ≡ NIL'));

// ── Readback edge cases ───────────────────────────────────────────────────

test('readback: plain function is null', () =>
  assert.strictEqual(readback(parse('λx.x')), null));
test('readback: Y-shaped term is null', () =>
  assert.strictEqual(readback(parse('λf.(λx.f (x x)) (λx.f (x x))')), null));
test('readback: numeral is alpha-insensitive', () =>
  assert.strictEqual(readback(parse('λg.λy.g (g y)')), '2'));
test('readback: fake numeral with shared binder names rejected', () =>
  assert.strictEqual(readback(parse('λa.λa.a a')), null));
test('readback: nested pair of lists', () =>
  assert.strictEqual(run('PAIR (CONS 1 NIL) 2').readback, '⟨[1], 2⟩'));

// ── Unicode identifiers & omega (A7) ──────────────────────────────────────

test('unicode: ω is a valid identifier', () => parsesTo('ω', Var('ω')));
test('unicode: λ never joins an identifier', () =>
  parsesTo('xλy.y', App(Var('x'), Lam('y', Var('y')))));
test('unicode: course omega definition parses', () => {
  const r = evalProgram('ω = λx.x x');
  assert.strictEqual(r.status, 'no-expression');
});
test('prelude: Ω diverges', () => {
  const r = evalProgram('Ω', { maxSteps: 20 });
  assert.strictEqual(r.status, 'fuel-exhausted');
});
test('prelude: normal order discards Ω', () => {
  const r = evalProgram('(λx.λy.x) z Ω', { maxSteps: 50 });
  assert.strictEqual(r.status, 'normal');
  assert.strictEqual(print(r.result), 'z');
});
test('prelude: user ω shadows built-in', () => {
  const r = evalProgram('ω = λx.x\nω y');
  assert.strictEqual(print(r.result), 'y');
  assert.ok(r.warnings.some((w) => w.includes('shadows')));
});

// ── Error caret data (A7) ─────────────────────────────────────────────────

test('caret: definition parse error carries source and offset', () => {
  try { evalProgram('ID = λx.x\nBAD = λx.\nID 1'); assert.fail('should throw'); }
  catch (e) {
    assert.strictEqual(e.source, 'λx.');
    assert.strictEqual(e.offset, 3);
    assert.strictEqual(e.line, 2);
  }
});

test('caret: expression parse error carries source and offset', () => {
  try { evalProgram('x @ y'); assert.fail('should throw'); }
  catch (e) {
    assert.strictEqual(e.source, 'x @ y');
    assert.strictEqual(e.offset, 2);
  }
});

// ── HTML printer ──────────────────────────────────────────────────────────

test('printHtml: no mark equals print', () => {
  for (const src of ['λx.x', '(λx.x) y', 'f (x y)', 'λf.(λx.f (x x)) (λx.f (x x))']) {
    assert.strictEqual(printHtml(parse(src)), print(parse(src)));
  }
});

test('printHtml: marks redex at root', () =>
  assert.strictEqual(printHtml(parse('(λx.x) y'), { path: [] }),
    '<mark class="lab-mark">(λx.x) y</mark>'));

test('printHtml: marks redex at path', () =>
  assert.strictEqual(printHtml(parse('f ((λx.x) y)'), { path: ['arg'] }),
    'f (<mark class="lab-mark">(λx.x) y</mark>)'));

test('printHtml: marks redex under lambda', () =>
  assert.strictEqual(printHtml(parse('λz.(λx.x) y'), { path: ['body'] }),
    'λz.<mark class="lab-mark">(λx.x) y</mark>'));

test('printHtml: marks free name occurrences only', () =>
  assert.strictEqual(printHtml(parse('ADD x (λADD.ADD)'), { name: 'ADD' }),
    '<mark class="lab-mark">ADD</mark> x (λADD.ADD)'));

test('printHtml: marks repeated free names', () =>
  assert.strictEqual(printHtml(parse('ADD ADD'), { name: 'ADD' }),
    '<mark class="lab-mark">ADD</mark> <mark class="lab-mark">ADD</mark>'));

test('printHtml: trace invariant — every beta step marks a redex', () => {
  const r = evalProgram('ADD 2 3');
  const terms = [r.expr, ...r.deltas.map((d) => d.term), ...r.steps.map((s) => s.term)];
  r.steps.forEach((s, j) => {
    const before = terms[r.deltas.length + j];
    const html = printHtml(before, { path: s.redexPath });
    assert.ok(html.includes('<mark'), `step ${j} produced no mark`);
  });
});

// ── checkExpression (A8) ──────────────────────────────────────────────────

test('check beta: equivalent expression accepted', () =>
  assert.ok(checkExpression('NOT TRUE', 'FALSE').ok));

test('check beta: prelude names and raw lambdas interchangeable', () =>
  assert.ok(checkExpression('(λx.x) (λa.λb.a)', 'TRUE').ok));

test('check beta: wrong answer names no answers in message', () => {
  const r = checkExpression('AND TRUE TRUE', 'FALSE');
  assert.strictEqual(r.ok, false);
  assert.ok(r.message.includes('reduces to TRUE'));
  assert.ok(!r.message.includes('FALSE'), 'must not leak the expected answer');
});

test('check beta: divergent input reported', () => {
  const r = checkExpression('Ω', 'TRUE', { maxSteps: 50 });
  assert.strictEqual(r.ok, false);
  assert.ok(r.message.includes('normal form'));
});

test('check alpha: renamed binders accepted', () =>
  assert.ok(checkExpression('λa.λb.a', 'λx.λy.x', { mode: 'alpha' }).ok));

test('check alpha: name is not its expansion', () =>
  assert.strictEqual(checkExpression('TRUE', 'λx.λy.x', { mode: 'alpha' }).ok, false));

test('check alpha: beta-equivalent but structurally different rejected', () =>
  assert.strictEqual(checkExpression('(λz.z) (λx.λy.x)', 'λx.λy.x', { mode: 'alpha' }).ok, false));

const XOR_TESTS = [
  { args: ['TRUE', 'TRUE'],   expect: 'FALSE' },
  { args: ['TRUE', 'FALSE'],  expect: 'TRUE' },
  { args: ['FALSE', 'TRUE'],  expect: 'TRUE' },
  { args: ['FALSE', 'FALSE'], expect: 'FALSE' },
];

test('check tests: reference implementation passes', () =>
  assert.ok(checkExpression('λb.λc.b (NOT c) c', 'unused', { tests: XOR_TESTS }).ok));

test('check tests: DIFFERENT correct implementation also passes', () =>
  assert.ok(checkExpression('λb.λc.OR (AND b (NOT c)) (AND (NOT b) c)', 'unused', { tests: XOR_TESTS }).ok));

test('check tests: wrong implementation fails with the failing case', () => {
  const r = checkExpression('λb.λc.AND b c', 'unused', { tests: XOR_TESTS });
  assert.strictEqual(r.ok, false);
  assert.ok(r.message.includes('TRUE TRUE'));
});

test('check tests: definitions rejected in tests mode', () => {
  const r = checkExpression('F = λx.x\nF', 'unused', { tests: XOR_TESTS });
  assert.strictEqual(r.ok, false);
  assert.ok(r.message.includes('single expression'));
});

test('check: parse error surfaces cleanly', () => {
  const r = checkExpression('λx.(x', 'TRUE');
  assert.strictEqual(r.ok, false);
  assert.ok(r.message.includes("Expected ')'"));
});

test('check: defs-only input rejected', () => {
  const r = checkExpression('F = λx.x', 'TRUE');
  assert.strictEqual(r.ok, false);
  assert.ok(r.message.includes('definitions alone'));
});

// ── Summary ───────────────────────────────────────────────────────────────

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
