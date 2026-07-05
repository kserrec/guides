// tfl.test.js — run with: node tfl.test.js
'use strict';

const assert = require('node:assert');
const {
  Atom, Neg, Compound, Rel, PropTerm, ST, Prop,
  termEq, propEq, ParseError,
  parseProposition, parseTerm, parseSignedTerm,
  printTerm, printProposition, isBareName,
} = require('./tfl.js');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); }
}

// Assert that `src` parses to exactly the proposition `expected`.
function propTo(src, expected) {
  const got = parseProposition(src);
  assert.ok(propEq(got, expected),
    `${src} parsed to ${printProposition(got)}, expected ${printProposition(expected)}`);
}

// Assert that `src` parses to exactly the term `expected`.
function termTo(src, expected) {
  const got = parseTerm(src);
  assert.ok(termEq(got, expected),
    `${src} parsed to ${printTerm(got)}, expected ${printTerm(expected)}`);
}

// Assert that parsing `src` as a proposition throws a positioned ParseError
// mentioning `msgPart`.
function failsWith(src, msgPart, parser = parseProposition) {
  assert.throws(() => parser(src), (e) => {
    assert.ok(e instanceof ParseError, `expected ParseError, got ${e.constructor.name}`);
    assert.ok(typeof e.pos === 'number', 'ParseError should carry a position');
    assert.ok(e.message.includes(msgPart), `message "${e.message}" should include "${msgPart}"`);
    return true;
  });
}

// ── Atoms and names ───────────────────────────────────────────────────────

test('single-letter terms', () =>
  propTo('−S+P', Prop(ST('-', Atom('S')), ST('+', Atom('P')))));

test('word terms', () =>
  propTo('−Dog + Mammal', Prop(ST('-', Atom('Dog')), ST('+', Atom('Mammal')))));

test('underscores and digits in names', () =>
  propTo('−German_Shepherd+H2O', Prop(ST('-', Atom('German_Shepherd')), ST('+', Atom('H2O')))));

test('subscript digits are name characters', () =>
  termTo('S₁₂', Atom('S₁₂')));

test('names cannot start with a digit', () =>
  failsWith('+2Fast+P', 'must start with a letter'));

test('lowercase statement terms', () =>
  propTo('−p+q', Prop(ST('-', Atom('p')), ST('+', Atom('q')))));

// ── Signs and aliases ─────────────────────────────────────────────────────

test('ASCII minus aliases typographic minus', () =>
  assert.ok(propEq(parseProposition('-S+P'), parseProposition('−S+P'))));

test('wild quantity sign', () =>
  propTo('±Socrates*+Wise', Prop(ST('±', Atom('Socrates', true)), ST('+', Atom('Wise')))));

test('+- is the ASCII alias for ±', () =>
  assert.ok(propEq(parseProposition('+-Socrates*+Wise'), parseProposition('±Socrates*+Wise'))));

test('all four categorical forms', () => {
  propTo('−S+P', Prop(ST('-', Atom('S')), ST('+', Atom('P'))));  // A
  propTo('−S−P', Prop(ST('-', Atom('S')), ST('-', Atom('P'))));  // E
  propTo('+S+P', Prop(ST('+', Atom('S')), ST('+', Atom('P'))));  // I
  propTo('+S−P', Prop(ST('+', Atom('S')), ST('-', Atom('P'))));  // O
});

// ── Singulars and proterms ────────────────────────────────────────────────

test('singular star', () => termTo('Twain*', Atom('Twain', true)));

test('identity statement with two singulars', () =>
  propTo('+Twain*+Clemens*', Prop(ST('+', Atom('Twain', true)), ST('+', Atom('Clemens', true)))));

test('proterm prime is part of the name', () =>
  termTo("Boy'", Atom("Boy'")));

test('typographic prime normalizes to ASCII', () =>
  assert.ok(termEq(parseTerm('Girl′'), parseTerm("Girl'"))));

test('double prime normalizes to two ASCII primes', () =>
  assert.ok(termEq(parseTerm('A″'), parseTerm("A''"))));

test('prime then subscript (paired proterms)', () =>
  termTo("B'₁", Atom("B'₁")));

test('double-quote after a name char is a double prime (course prints A")', () =>
  assert.ok(termEq(parseTerm('A"'), Atom("A''"))));

test('wild proterm proposition (indirect proof line)', () =>
  propTo("±Boy'+(Lov±Girl')",
    Prop(ST('±', Atom("Boy'")), ST('+', Rel(Atom('Lov'), [ST('±', Atom("Girl'"))])))));

// ── Signed terms (the D2 rule engine's working unit) ──────────────────────

test('parseSignedTerm handles sign + any term', () => {
  const st = parseSignedTerm('−(Head+Horse)');
  assert.strictEqual(st.sign, '-');
  assert.strictEqual(st.level, 0);
  assert.ok(termEq(st.term, Rel(Atom('Head'), [ST('+', Atom('Horse'))])));
});

test('parseSignedTerm rejects unsigned and trailing input', () => {
  failsWith('Dog', 'Expected a sign', parseSignedTerm);
  failsWith('+Dog+P', 'Expected end of input', parseSignedTerm);
});

// ── Quoted terms ──────────────────────────────────────────────────────────

test('quoted term with spaces', () =>
  propTo('−"head of a horse"+Thing',
    Prop(ST('-', Atom('head of a horse')), ST('+', Atom('Thing')))));

test('hyphens split bare names, so non-smoker must be quoted', () => {
  failsWith('+non-smoker+P', 'Expected end of input');
  propTo('+"non-smoker"+P', Prop(ST('+', Atom('non-smoker')), ST('+', Atom('P'))));
});

test('quoted singular', () =>
  termTo('"the number 7"*', Atom('the number 7', true)));

test('unclosed quote', () => failsWith('+"oops+P', 'Unclosed quote'));
test('empty quoted term', () => failsWith('+""+P', 'Empty quoted term'));

// ── Negative and compound terms ───────────────────────────────────────────

test('negative term', () => termTo('(−T)', Neg(Atom('T'))));

test('obversion shape', () =>
  propTo('−(−Y)+(−X)', Prop(ST('-', Neg(Atom('Y'))), ST('+', Neg(Atom('X'))))));

test('double negation nests', () =>
  termTo('(−(−wise))', Neg(Neg(Atom('wise')))));

test('(+T) is transparent', () =>
  assert.ok(termEq(parseTerm('(+T)'), Atom('T'))));

test('plain grouping parens are transparent', () =>
  assert.ok(termEq(parseTerm('(T)'), Atom('T'))));

test('compound conjunctive term', () =>
  propTo('−(+White+Horse)+Gentle',
    Prop(ST('-', Compound([ST('+', Atom('White')), ST('+', Atom('Horse'))])),
         ST('+', Atom('Gentle')))));

test('compound may mix signs', () =>
  termTo('(+Rich−Happy)', Compound([ST('+', Atom('Rich')), ST('-', Atom('Happy'))])));

test('bare wild group is an error', () =>
  failsWith('−X+(±Y)', 'wild sign'));

// ── Relational complexes ──────────────────────────────────────────────────

test('basic relational complex', () =>
  propTo('−Man+(Lov+Woman)',
    Prop(ST('-', Atom('Man')), ST('+', Rel(Atom('Lov'), [ST('+', Atom('Woman'))])))));

test('relational with wild singular object', () =>
  propTo('−Man+(Lov±Mary*)',
    Prop(ST('-', Atom('Man')), ST('+', Rel(Atom('Lov'), [ST('±', Atom('Mary', true))])))));

test('n-ary relational complex', () =>
  termTo('(Gave+Rose+Girl)',
    Rel(Atom('Gave'), [ST('+', Atom('Rose')), ST('+', Atom('Girl'))])));

test('nested relational complex', () =>
  propTo('−Boy+(Lov+(Adm−Teacher))',
    Prop(ST('-', Atom('Boy')),
         ST('+', Rel(Atom('Lov'),
                     [ST('+', Rel(Atom('Adm'), [ST('-', Atom('Teacher'))]))])))));

test("the horse's head", () =>
  propTo('−(Head+Horse)+(Head+Horse)',
    Prop(ST('-', Rel(Atom('Head'), [ST('+', Atom('Horse'))])),
         ST('+', Rel(Atom('Head'), [ST('+', Atom('Horse'))])))));

test('negative quality on a relational predicate', () =>
  propTo('+Man−(Lov+Woman)',
    Prop(ST('+', Atom('Man')), ST('-', Rel(Atom('Lov'), [ST('+', Atom('Woman'))])))));

test('relation head may itself be a negative term', () =>
  termTo('((−Lov)+Woman)', Rel(Neg(Atom('Lov')), [ST('+', Atom('Woman'))])));

// ── Propositional terms ───────────────────────────────────────────────────

test('bare statement term in brackets', () =>
  termTo('[p]', PropTerm(Atom('p'))));

test('propositional term with full proposition', () =>
  termTo("[+A''+B]", PropTerm(Prop(ST('+', Atom("A''")), ST('+', Atom('B'))))));

test('conjunction of propositional terms (Course 2 L6 shape)', () =>
  propTo("+[+A''+B]+[+A''+C]",
    Prop(ST('+', PropTerm(Prop(ST('+', Atom("A''")), ST('+', Atom('B'))))),
         ST('+', PropTerm(Prop(ST('+', Atom("A''")), ST('+', Atom('C'))))))));

test('conditional of propositional terms', () =>
  propTo("−[+A'+B]+[+A'+C]",
    Prop(ST('-', PropTerm(Prop(ST('+', Atom("A'")), ST('+', Atom('B'))))),
         ST('+', PropTerm(Prop(ST('+', Atom("A'")), ST('+', Atom('C'))))))));

test('unclosed bracket', () => failsWith('+[+p+q+r', "Expected ']'"));

// ── Quantity levels (numerical-ready syntax; engine uses them from D9) ────

test('explicit ^ levels', () =>
  propTo('+V^2+C^0', Prop(ST('+', Atom('V'), 2), ST('+', Atom('C'), 0))));

test('superscript levels', () =>
  assert.ok(propEq(parseProposition('+V²+C⁰'), parseProposition('+V^2+C^0'))));

test('level 0 is the classical default', () =>
  assert.ok(propEq(parseProposition('+V^0+C^0'), parseProposition('+V+C'))));

test('printer omits level 0, prints superscripts otherwise', () => {
  assert.strictEqual(printProposition(parseProposition('+V^2+C^0')), '+V²+C');
  assert.strictEqual(printProposition(parseProposition('+V+C')), '+V+C');
});

test('bare ^ without digits', () => failsWith('+V^+C', "Expected digits after '^'"));

// ── Whitespace ────────────────────────────────────────────────────────────

test('whitespace is insignificant (incl. nbsp)', () => {
  const spaced = parseProposition('−S   +   P');
  assert.ok(propEq(spaced, parseProposition('−S+P')));
});

// ── Parse errors carry positions ──────────────────────────────────────────

test('empty input', () => failsWith('', 'Expected a sign'));
test('dangling sign', () => failsWith('−S+', 'Expected a term'));
test('missing predicate', () => failsWith('−S', 'Expected a sign'));
test('term alone is not a proposition', () => failsWith('Dog', 'Expected a sign'));
test('trailing garbage', () => failsWith('−S+P+Q', 'Expected end of input'));
test('unclosed paren', () => failsWith('−Man+(Lov+Woman', "Expected ')'"));
test('star cannot attach to a group', () => failsWith('+(Lov+Girl)*+P', 'Unexpected character'));
test('error position points at the offender', () => {
  try { parseProposition('−S+P+Q'); assert.fail('should have thrown'); }
  catch (e) { assert.strictEqual(e.pos, 4); }
});

// ── Printer round-trips ───────────────────────────────────────────────────

const CORPUS = [
  '−S+P', '−S−P', '+S+P', '+S−P',
  '−Mammal+Mortal', '+Philosopher+Wise', '+Student−Diligent',
  '−(−Mammal)+(−Dog)', '+(−P)−(−S)', '−(−p)−(−q)', '−(−p)+q',
  '±Socrates*+Wise', '±MarkTwain*+SamuelClemens*', '+Twain*+Humorist',
  '−Man+(Lov+Woman)', '−Man+(Lov±Mary*)', '±John*+(Lov±Mary*)',
  '+Man−(Lov+Woman)', '−Boy+(Lov+(Adm−Teacher))',
  '−(Head+Horse)+(Head+Horse)', '−Student+(Reads+Book)',
  '+Philosopher+(Admires±Socrates*)', '±Caesar*+(Conquered±Gaul*)',
  "±Boy'+(Lov±Girl')", "±Boy'+Boy", "±Girl'+Coward",
  "+[+A''+B]+[+A''+C]", "−[+A'+B]+[+A'+C]", '+[p]+[q]',
  '−(+White+Horse)+Gentle', '+"non-smoker"+P', '−"head of a horse"+Thing',
  '+V^2+C^0', '+V²+C⁰', '−B\'₁+S₁₂', '+p+q', '−p−q',
];

test('corpus round-trip: parse ∘ print ∘ parse is identity', () => {
  for (const src of CORPUS) {
    const ast = parseProposition(src);
    const printed = printProposition(ast);
    const reparsed = parseProposition(printed);
    assert.ok(propEq(ast, reparsed), `round-trip failed for ${src} → ${printed}`);
  }
});

// Random-AST round-trip: a seeded generator covering every node kind.
test('random ASTs round-trip through the printer', () => {
  let seed = 42;
  const rand = (n) => (seed = (seed * 1103515245 + 12345) % 2147483648, seed % n);
  const pick = (xs) => xs[rand(xs.length)];
  const name = () => pick(['S', 'P', 'Dog', "Boy'", 'S₁₂', 'H2O', 'head of a horse', 'non-smoker']);
  const sign = () => pick(['+', '-', '±']);
  const st = (depth) => ST(sign(), term(depth), rand(4) === 0 ? rand(4) : 0);
  function term(depth) {
    const kinds = depth <= 0 ? ['atom'] : ['atom', 'atom', 'neg', 'compound', 'rel', 'propterm'];
    switch (pick(kinds)) {
      case 'atom': return Atom(name(), rand(3) === 0);
      case 'neg': return Neg(term(depth - 1));
      case 'compound': {
        const n = 2 + rand(2);
        return Compound(Array.from({ length: n }, () => ST(sign(), term(depth - 1))));
      }
      case 'rel': {
        const n = 1 + rand(2);
        return Rel(term(depth - 1), Array.from({ length: n }, () => st(depth - 1)));
      }
      case 'propterm':
        return rand(2) === 0
          ? PropTerm(Atom(name().replace(/[^A-Za-z]/g, '') || 'p'))
          : PropTerm(Prop(ST(sign(), term(depth - 1)), ST(sign(), term(depth - 1))));
    }
  }
  for (let k = 0; k < 500; k++) {
    const prop = Prop(st(3), st(3));
    const printed = printProposition(prop);
    let reparsed;
    try { reparsed = parseProposition(printed); }
    catch (e) { assert.fail(`printed form failed to parse: ${printed} — ${e.message}`); }
    assert.ok(propEq(prop, reparsed), `random round-trip failed: ${printed}`);
  }
});

// ── Printer details ───────────────────────────────────────────────────────

test('printer emits typographic minus and compact spacing', () => {
  assert.strictEqual(printProposition(parseProposition('-S + P')), '−S+P');
  assert.strictEqual(printProposition(parseProposition('+-s* + P')), '±s*+P');
});

test('printer quotes non-bare names only', () => {
  assert.ok(isBareName('Wise') && isBareName("Boy'") && isBareName('S₁₂'));
  assert.ok(!isBareName('non-smoker') && !isBareName('head of a horse'));
  assert.strictEqual(printTerm(Atom('non-smoker')), '"non-smoker"');
  assert.strictEqual(printTerm(Atom('Wise')), 'Wise');
});

// ══════════════════════════════════════════════════════════════════════════
// D2 — inference core
// ══════════════════════════════════════════════════════════════════════════

const {
  EngineError, validateProp, canonProp: canon, propEqUpTo, contradictory,
  obverse, contrapositive, derive, checkInconsistent, checkArgument,
} = require('./tfl.js');

const P = parseProposition;
const eqUpTo = (a, b) => propEqUpTo(P(a), P(b));
const arg = (premises, conclusion, opts) =>
  checkArgument(premises.map(P), P(conclusion), opts);

// ── Canonical equality (Com / Assoc / DN / wild quantity) ─────────────────

test('A-form does not convert', () => assert.ok(!eqUpTo('−S+P', '−P+S')));
test('I-form converts', () => assert.ok(eqUpTo('+S+P', '+P+S')));
test('E-form converts', () => assert.ok(eqUpTo('−S−P', '−P−S')));
test('O-form does not convert', () => assert.ok(!eqUpTo('+S−P', '+P−S')));
test('double negation strips', () => assert.ok(eqUpTo('−(−(−S))+P', '−(−(−(−(−S))))+P')));
test('compounds commute and associate', () =>
  assert.ok(eqUpTo('−(+A+(+B+C))+D', '−(+C+(+B+A))+D')));
test('singular quantity is wild in equality', () => {
  assert.ok(eqUpTo('+Socrates*+Wise', '−Socrates*+Wise'));
  assert.ok(eqUpTo('±Socrates*+Wise', '+Socrates*+Wise'));
});
test('identity statements convert through the wild reading', () =>
  assert.ok(eqUpTo('±Twain*+Clemens*', '±Clemens*+Twain*')));
test('the four forms stay distinct', () => {
  const forms = ['−S+P', '−S−P', '+S+P', '+S−P'];
  for (const a of forms) for (const b of forms) {
    assert.strictEqual(eqUpTo(a, b), a === b, `${a} vs ${b}`);
  }
});

// ── EN / IN / Contrap ─────────────────────────────────────────────────────

test('contradictory flips both signs (EN)', () => {
  assert.ok(propEqUpTo(contradictory(P('−S+P')), P('+S−P')));
  assert.ok(propEqUpTo(contradictory(P('+S+P')), P('−S−P')));
  assert.ok(propEqUpTo(contradictory(P('±Socrates*+Wise')), P('±Socrates*−Wise')));
});
test('obversion (IN) is an equivalence', () => {
  assert.ok(propEqUpTo(obverse(P('−S+P')), P('−S−(−P)')));
  assert.ok(propEqUpTo(obverse(P('−S−P')), P('−S+(−P)')));
  // Self-inverse up to canonical Com: obverting an A twice passes through an
  // E-form, whose canonical order may hand back the contrapositive instead.
  const twice = obverse(obverse(P('−S+P')));
  assert.ok(propEqUpTo(twice, P('−S+P')) || propEqUpTo(twice, contrapositive(P('−S+P'))));
  assert.ok(propEqUpTo(obverse(obverse(P('−S−P'))), P('−S−P')));
});
test('contraposition of A and O; none for I and E', () => {
  assert.ok(propEqUpTo(contrapositive(P('−S+P')), P('−(−P)+(−S)')));
  assert.ok(propEqUpTo(contrapositive(P('+S−P')), P('+(−P)−(−S)')));
  assert.strictEqual(contrapositive(P('+S+P')), null);
  assert.strictEqual(contrapositive(P('−S−P')), null);
});

// ── P/Z inconsistency ─────────────────────────────────────────────────────

test('A against O is inconsistent', () =>
  assert.ok(checkInconsistent([P('−A+B'), P('+A−B')]) !== null));
test('transitive chain plus denial is inconsistent', () =>
  assert.ok(checkInconsistent([P('−A+B'), P('−B+C'), P('+A−C')]) !== null));
test('a lone particular is consistent', () =>
  assert.strictEqual(checkInconsistent([P('+A+B')]), null));
test('all-universal sets are consistent (no import)', () =>
  assert.strictEqual(checkInconsistent([P('−A+B'), P('−B−A')]), null));

// ── Categorical validity: the REGAL verdicts ──────────────────────────────

test('Barbara is valid', () =>
  assert.strictEqual(arg(['−M+P', '−S+M'], '−S+P').verdict, 'valid'));
test('Celarent is valid', () =>
  assert.strictEqual(arg(['−M−P', '−S+M'], '−S−P').verdict, 'valid'));
test('Darii and Ferio are valid', () => {
  assert.strictEqual(arg(['−M+P', '+S+M'], '+S+P').verdict, 'valid');
  assert.strictEqual(arg(['−M−P', '+S+M'], '+S−P').verdict, 'valid');
});
test('undistributed middle is invalid', () =>
  assert.strictEqual(arg(['−M+P', '−M+S'], '−S+P').verdict, 'invalid'));
test('illicit process is invalid', () =>
  assert.strictEqual(arg(['−M+P', '−S+M'], '−P+S').verdict, 'invalid'));
test('two particular premises are invalid (irregular)', () =>
  assert.strictEqual(arg(['+M+P', '+S+M'], '+S+P').verdict, 'invalid'));
test('subalternation fails without an existence premise', () =>
  assert.strictEqual(arg(['−A+B'], '+A+B').verdict, 'invalid'));
test('subalternation succeeds with +A+A added', () =>
  assert.strictEqual(arg(['−A+B', '+A+A'], '+A+B').verdict, 'valid'));
test('obverted premises still cancel (sign algebra through negation)', () =>
  assert.strictEqual(arg(['−M−(−P)', '−S+M'], '−S+P').verdict, 'valid'));
test('cross-form sorites is valid', () =>
  assert.strictEqual(arg(['−A+B', '−B+C', '−C+D', '+A+A'], '+A+D').verdict, 'valid'));

// ── Statement arguments (Course 4) ────────────────────────────────────────

test('modus ponens is Barbara', () => {
  assert.strictEqual(arg(['−p+q', '+p+p'], '+q+q').verdict, 'valid');
  assert.strictEqual(arg(['−p+q', '+p+p'], '+q+p').verdict, 'valid');
});
test('modus tollens needs a universal used twice', () =>
  assert.strictEqual(arg(['−p+q', '+(−q)+(−q)'], '+(−p)+(−p)').verdict, 'valid'));
test('hypothetical syllogism is valid', () =>
  assert.strictEqual(arg(['−p+q', '−q+r'], '−p+r').verdict, 'valid'));
test('affirming the consequent is invalid', () =>
  assert.strictEqual(arg(['−p+q', '+q+q'], '+p+p').verdict, 'invalid'));

// ── Singulars and identity ────────────────────────────────────────────────

test('singular Barbara (Socrates is mortal)', () =>
  assert.strictEqual(arg(['−Human+Mortal', '±Socrates*+Human'], '±Socrates*+Mortal').verdict, 'valid'));
test('shared predicate proves nothing about singulars', () =>
  assert.strictEqual(arg(['±Socrates*+Mortal', '±Aristotle*+Mortal'], '±Socrates*+Aristotle*').verdict, 'invalid'));
test('Twain/Clemens: identity chains fall out of the algebra', () => {
  assert.strictEqual(arg(['±Twain*+Clemens*', '±Twain*+Humorist'], '±Clemens*+Humorist').verdict, 'valid');
  // and via DON with wild quantity, as a traced derivation:
  const proof = derive([P('±Twain*+Clemens*'), P('±Twain*+Humorist')], P('±Clemens*+Humorist'));
  assert.ok(proof.found, 'derivation not found');
  assert.ok(proof.lines.some((l) => l.rule === 'DON'), 'expected a DON step');
});
test('identity is transitive through DON', () =>
  assert.strictEqual(
    arg(['±Hesperus*+Phosphorus*', '±Phosphorus*+Venus*'], '±Hesperus*+Venus*').verdict, 'valid'));

// ── Relational derivations (Course 3) ─────────────────────────────────────

test("the horse's head: tautology premise + cancellation in-complex", () => {
  const res = arg(['−Horse+Animal'], '−(Head+Horse)+(Head+Animal)');
  assert.strictEqual(res.verdict, 'valid');
  assert.ok(res.proof.lines.some((l) => l.rule === 'It'), 'expected the tautology move');
  assert.ok(res.proof.lines.some((l) => l.rule === 'DON'), 'expected a DON step');
});
test('donating a whole complex (Course 3 L2 showcase)', () =>
  assert.strictEqual(
    arg(['−Boy+(Lov+Girl)', '−Girl+(Adm−Teacher)'], '−Boy+(Lov+(Adm−Teacher))').verdict, 'valid'));
test('nested faster-than donation', () =>
  assert.strictEqual(
    arg(['−Horse+(Faster+Dog)', '−Dog+(Faster+Cat)'], '−Horse+(Faster+(Faster+Cat))').verdict, 'valid'));
test('relational with wild singular host (Ada reads documents)', () =>
  assert.strictEqual(
    arg(['±Ada*+(Reads+Manuscript)', '−Manuscript+Document'], '±Ada*+(Reads+Document)').verdict, 'valid'));
test('undistributed middle inside a complex is not derived', () =>
  assert.strictEqual(
    arg(['+Critic+(Praises+Film)', '+Film+Masterpiece'], '+Critic+(Praises+Masterpiece)').verdict, 'unknown'));
test('two distributed occurrences never cancel', () =>
  assert.strictEqual(
    arg(['+Editor−(Rejects+Manuscript)', '−Manuscript+Submission'], '+Editor−(Rejects+Submission)').verdict, 'unknown'));
test('illicit process in a complex is not derived; the sound conclusion is', () => {
  const premises = ['+Donor+(Funds+Charity)', '−Charity+Nonprofit'];
  assert.strictEqual(arg(premises, '+Donor+(Funds−Nonprofit)').verdict, 'unknown');
  assert.strictEqual(arg(premises, '+Donor+(Funds+Nonprofit)').verdict, 'valid');
});
test('net + under a double denial is substitutable', () =>
  // "Some student doesn't read every manuscript" — Manuscript computes net
  // (−)(−) = + (the unread manuscript), so the donor may widen it.
  assert.strictEqual(
    arg(['+Student−(Reads−Manuscript)', '−Manuscript+Document'], '+Student−(Reads−Document)').verdict, 'valid'));

// ── Simp and Add ──────────────────────────────────────────────────────────

test('Simp drops a conjunct at a net-+ occurrence', () =>
  assert.strictEqual(arg(['−S+(+A+B)'], '−S+A').verdict, 'valid'));
test('statement Simp: some X is Y, so some X is X', () =>
  assert.strictEqual(arg(['+X+Y'], '+X+X').verdict, 'valid'));
test('Add builds a compound conclusion from shared subjects', () =>
  assert.strictEqual(arg(['−S+A', '−S+B'], '−S+(+A+B)').verdict, 'valid'));

// ── Engine guards ─────────────────────────────────────────────────────────

test('quantity levels are rejected until D9', () =>
  assert.throws(() => arg(['+V^2+C'], '+V+C'), EngineError));
test('wild quantity requires a singular term', () =>
  assert.throws(() => validateProp(P('±Dog+Pet')), EngineError));
test('wild predicates are rejected', () =>
  assert.throws(() => validateProp(P('+Dog±Pet*')), EngineError));

// ── Derivation traces ─────────────────────────────────────────────────────

test('traces are numbered, parent-linked, and end at the goal', () => {
  const proof = derive([P('−M+P'), P('−S+M')], P('−S+P'));
  assert.ok(proof.found);
  const last = proof.lines[proof.lines.length - 1];
  assert.ok(propEqUpTo(last.prop, P('−S+P')));
  for (const line of proof.lines) {
    for (const par of line.parents) assert.ok(par < line.n, 'parents precede their line');
  }
  assert.ok(proof.lines.filter((l) => l.rule === 'premise').length <= 2);
});

// ── Oracle spot checks (semantic ground truth) ────────────────────────────

const oracle = require('./oracle.js');

test('oracle agrees: Barbara valid, undistributed middle invalid', () => {
  assert.ok(oracle.entails([P('−M+P'), P('−S+M')], P('−S+P'), { maxN: 3, cap: 60000 }));
  assert.ok(!oracle.entails([P('−M+P'), P('−M+S')], P('−S+P'), { maxN: 3, cap: 60000 }));
});
test("oracle agrees: horse's head is semantically valid", () =>
  assert.ok(oracle.entails([P('−Horse+Animal')], P('−(Head+Horse)+(Head+Animal)'), { maxN: 2, cap: 60000 })));
test('oracle agrees: no existential import', () =>
  assert.ok(!oracle.entails([P('−A+B')], P('+A+B'), { maxN: 2, cap: 60000 })));

// ══════════════════════════════════════════════════════════════════════════
// D3 — deep relational layer
// ══════════════════════════════════════════════════════════════════════════

const { passives, pronominalize, indirectProof } = require('./tfl.js');

// ── Pairing subscripts and the passive transformation (Course 2 L3) ───────

test('identity pairing subscripts are canonical noise', () => {
  assert.ok(eqUpTo('−Dog+(Sees₁₂−Cat)', '−Dog+(Sees−Cat)'));
  assert.ok(!eqUpTo('−Dog+(Sees₂₁−Cat)', '−Dog+(Sees−Cat)'));
});

test('subscripted heads round-trip through the printer', () => {
  const src = '+Student+(Teaches₂₁−Philosopher)';
  assert.strictEqual(printProposition(P(src)), src);
});

test('passive mechanics: participants swap, signs travel, roles land in the head', () => {
  const [r] = passives(P('−Philosopher+(Teaches+Student)'));
  assert.strictEqual(printProposition(r.prop), '+Student+(Teaches₂₁−Philosopher)');
  // and the passive of the passive is the original
  const back = passives(r.prop).map((x) => printProposition(x.prop));
  assert.ok(back.includes('−Philosopher+(Teaches+Student)'), back.join(' | '));
});

test('symmetry guard: same quantity or a fixed participant is equivalent', () => {
  for (const src of ['+Man+(Lov+Woman)', '−Man+(Lov−Woman)',
                     '±Brutus*+(Stabbed±Caesar*)', '−Philosopher+(Loves±Mary*)']) {
    assert.ok(passives(P(src)).every((r) => r.equivalent), src);
  }
});

test('symmetry guard: mixed general quantities are the scope trap', () => {
  for (const src of ['−Senator+(Admires+Philosopher)', '+Philosopher+(Teaches−Student)']) {
    assert.ok(passives(P(src)).every((r) => !r.equivalent), src);
  }
});

test('n-ary guard: every crossed pair must commute', () => {
  assert.ok(passives(P('−S+(Gave+Rose+Girl)')).every((r) => !r.equivalent));
  assert.ok(passives(P('+S+(Gave+Rose+Girl)')).every((r) => r.equivalent));
});

test('no passive without a relational predicate of + quality', () => {
  assert.strictEqual(passives(P('−Boy−(Lov+Coward)')).length, 0);
  assert.strictEqual(passives(P('−S+P')).length, 0);
});

test('derive uses the guarded passive (Pass) and refuses the trap', () => {
  const ok = arg(['−Dog+(Sees−Cat)'], '−Cat+(Sees₂₁−Dog)');
  assert.strictEqual(ok.verdict, 'valid');
  assert.ok(ok.proof.lines.some((l) => l.rule === 'Pass'), 'expected a Pass step');
  assert.strictEqual(
    arg(['−Philosopher+(Teaches+Student)'], '+Student+(Teaches₂₁−Philosopher)').verdict,
    'unknown');
});

test('the one-way scope entailment: ∃∀ proves ∀∃, never the reverse', () => {
  // Needs a deep saturation (a passive of a tautology feeds the DON chain).
  const res = indirectProof([P('+Philosopher+(Teaches−Student)')],
                            P('−Student+(Teaches₂₁+Philosopher)'), { maxLines: 1600 });
  assert.ok(res.found);
  assert.strictEqual(
    indirectProof([P('−A+(R+B)')], P('+B+(R₂₁−A)')).found, false);
});

// ── Proterms and pronominalization (Course 2 L4, Course 3 L3) ─────────────

test('proterms take wild quantity; general terms still cannot', () => {
  validateProp(P("±Boy'+(Lov±Girl')")); // must not throw
  assert.throws(() => validateProp(P('±Dog+Pet')), EngineError);
});

test('pronominalization: the course example, verbatim', () => {
  const used = new Set();
  const pr = pronominalize(P('+Boy+(Lov+Girl)'), used);
  assert.strictEqual(printProposition(pr.prop), "±Boy'+(Lov±Girl')");
  assert.deepStrictEqual(pr.anchors.map(printProposition), ["±Boy'+Boy", "±Girl'+Girl"]);
  // fresh primes each time — different witnesses are never conflated
  const pr2 = pronominalize(P('+Boy+(Lov+Girl)'), used);
  assert.strictEqual(printProposition(pr2.prop), "±Boy''+(Lov±Girl'')");
});

test('only particulars introduce witnesses', () => {
  assert.strictEqual(pronominalize(P('−Dog+Pet')), null);
  assert.strictEqual(pronominalize(P('−Bird−(Eats+Seed)')), null);
});

test('UDT subjects need no introduction; their objects still do', () => {
  const pr = pronominalize(P('±Ada*+(Reads+Manuscript)'));
  assert.strictEqual(printProposition(pr.prop), "±Ada*+(Reads±Manuscript')");
  assert.deepStrictEqual(pr.anchors.map(printProposition), ["±Manuscript'+Manuscript"]);
});

test('anchors host universal donors (Course 3 quick-check)', () =>
  assert.ok(derive([P("±Cat'+Cat"), P('−Cat−(Fears+Dog)')],
                   P("±Cat'−(Fears+Dog)")).found));

test('distributed proterm: a ± donor read as − (Course 3 quick-check)', () =>
  assert.ok(derive([P("±Owl'+(Watches±Mouse')"), P("±Mouse'+Rodent")],
                   P("±Owl'+(Watches+Rodent)")).found));

test('proterm co-denotation is what makes the categorical pair valid', () => {
  // some men were shouting; THEY are alarmed ⊢ some shouters are alarmed —
  // and without the prime the two groups may differ (Course 2 L4).
  assert.strictEqual(arg(["+M'+S", "±M'+A"], '+S+A').verdict, 'valid');
  assert.strictEqual(arg(['+M+S', '+M+A'], '+S+A').verdict, 'invalid');
});

// ── Indirect proof (Course 3 L3) ──────────────────────────────────────────

test("the worked proof's argument: boys, girls, cowards", () => {
  const res = arg(['+Boy+(Lov+Girl)', '−Boy−(Lov+Coward)'], '+Girl−Coward');
  assert.strictEqual(res.verdict, 'valid');
  assert.strictEqual(res.method, 'indirect');
  const rules = res.proof.lines.map((l) => l.rule);
  assert.ok(rules.includes('counterclaim'), 'assumes the counterclaim');
  assert.strictEqual(rules[rules.length - 1], 'contradiction', 'ends in ⊥');
  assert.strictEqual(res.proof.lines[res.proof.lines.length - 1].text, '⊥');
});

test('an indirect proof that needs the whole D3 stack', () => {
  // Some boy loves every girl; some girl is a rebel ⊢ some boy loves a
  // rebel. Universal-object instantiation: only reachable by
  // pronominalizing, passivizing around the fixed witness, and donating
  // through the anchor.
  const res = arg(['+Boy+(Lov−Girl)', '+Girl+Rebel'], '+Boy+(Lov+Rebel)');
  assert.strictEqual(res.verdict, 'valid');
  assert.strictEqual(res.method, 'indirect');
  const rules = res.proof.lines.map((l) => l.rule);
  for (const need of ['Pron', 'Anchor', 'Pass', 'DON', 'contradiction']) {
    assert.ok(rules.includes(need), `expected a ${need} line, got ${rules.join(',')}`);
  }
});

test('Barbara falls to indirect proof too (Course 3 quick-check)', () => {
  const res = indirectProof([P('−A+B'), P('−B+C')], P('−A+C'));
  assert.ok(res.found);
  assert.strictEqual(res.lines[res.lines.length - 1].rule, 'contradiction');
});

test('indirect proof does not overclaim', () => {
  assert.strictEqual(
    arg(['+Boy+(Lov+Girl)', '−Boy−(Lov+Coward)'], '+Girl+Coward').verdict, 'unknown');
  assert.strictEqual(
    indirectProof([P('+Critic+(Praises+Film)'), P('+Film+Masterpiece')],
                  P('+Critic+(Praises+Masterpiece)')).found, false);
});

// ── D3 oracle spot checks ─────────────────────────────────────────────────

test('oracle agrees: subscripted passive is equivalent, bare swap is not', () => {
  const a = P('+Man+(Lov+Woman)');
  assert.ok(oracle.entails([a], P('+Woman+(Lov₂₁+Man)'), { maxN: 3, cap: 60000 }));
  assert.ok(oracle.entails([P('+Woman+(Lov₂₁+Man)')], a, { maxN: 3, cap: 60000 }));
  // the bare swap claims Lov is symmetric — a different statement
  assert.ok(!oracle.entails([a], P('+Woman+(Lov+Man)'), { maxN: 3, cap: 60000 }));
});

test('oracle agrees: the ∀∃/∃∀ scope trap is real', () =>
  assert.ok(!oracle.entails([P('−A+(R+B)')], P('+B+(R₂₁−A)'), { maxN: 3, cap: 60000 })));

test('oracle agrees: proterms denote — the co-denotation pair', () => {
  assert.ok(oracle.entails([P("+M'+S"), P("±M'+A")], P('+S+A'), { maxN: 3, cap: 60000 }));
  assert.ok(!oracle.entails([P('+M+S'), P('+M+A')], P('+S+A'), { maxN: 3, cap: 60000 }));
});

// ── Summary ───────────────────────────────────────────────────────────────

console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
