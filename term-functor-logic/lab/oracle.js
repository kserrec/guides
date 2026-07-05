// oracle.js — D2 correctness oracle: finite-model semantics for the lab's
// TFL fragment, plus the fuzz harness comparing the engine's syntactic
// verdicts against semantic truth. Node-only.
//
//   node oracle.js            quick run (1000 iterations per suite)
//   node oracle.js -n 20000   the long haul
//
// Semantics (no existential import anywhere):
//   - a model is a domain {0..n-1}, a subset for every unary atom, a
//     singleton for every singular atom, and a (k+1)-ary relation for every
//     atom used as a relation head with k objects;
//   - term denotations: negation = complement, compounds intersect (a −
//     element intersects the complement), a relational complex (R s₁T₁ … )
//     denotes the x's related by R to the objects — + object = some T,
//     − object = every T, quantifiers read left to right;
//   - propositional terms [p] denote the whole domain when the inner
//     statement is true and ∅ otherwise (the singleton-universe pun);
//   - ±S+P: quantity + = some, − = every; wild ± = some (equivalent to
//     every on the singleton denotations ± is restricted to). Quality − =
//     "is not".
//
// The fuzz suites:
//   1. categorical exactness — checkArgument's P/Z verdict must equal
//      semantic entailment on random categorical arguments (this fragment
//      claims a complete decision method);
//   2. rule-step soundness — every single rewrite the engine's rules
//      produce (DON, IN, Contrap, Simp, Add, It) must be semantically
//      entailed by its parents, relational hosts included;
//   3. relational derivations — whenever derive() finds a proof, no small
//      model may satisfy the premises and refute the conclusion.

'use strict';

const TFL = require('./tfl.js');
const {
  Atom, Neg, Compound, Rel, PropTerm, ST, Prop,
  parseProposition, printProposition, canonProp, contradictory,
  checkArgument, derive, obverse, contrapositive,
} = TFL;

// ── Vocabulary extraction ─────────────────────────────────────────────────

function vocabOf(props) {
  const unary = new Set(), singular = new Set(), rels = new Map();
  const walkTerm = (t, asHead, arity) => {
    switch (t.type) {
      case 'atom':
        if (asHead) rels.set(`${t.name}/${arity}`, { name: t.name, arity });
        else (t.singular ? singular : unary).add(t.name);
        return;
      case 'neg': return walkTerm(t.term, false, 0);
      case 'compound': return t.elements.forEach((e) => walkTerm(e.term, false, 0));
      case 'rel':
        walkTerm(t.head, true, t.objects.length + 1);
        return t.objects.forEach((o) => walkTerm(o.term, false, 0));
      case 'propterm':
        if (t.inner.type === 'prop') walkProp(t.inner);
        else unary.add(t.inner.name);
        return;
    }
  };
  const walkProp = (p) => { walkTerm(p.subject.term, false, 0); walkTerm(p.predicate.term, false, 0); };
  props.forEach(walkProp);
  return { unary: [...unary], singular: [...singular], rels: [...rels.values()] };
}

// ── Evaluation ────────────────────────────────────────────────────────────
// Denotations are bitmasks over the domain; relations are Sets of
// comma-joined tuples.

function evalTerm(t, m) {
  switch (t.type) {
    case 'atom':
      if (t.singular) return 1 << m.singular[t.name];
      return m.unary[t.name];
    case 'neg':
      return m.full & ~evalTerm(t.term, m);
    case 'compound': {
      let mask = m.full;
      for (const el of t.elements) {
        const d = evalTerm(el.term, m);
        mask &= el.sign === '-' ? m.full & ~d : d;
      }
      return mask;
    }
    case 'rel': {
      if (t.head.type !== 'atom') throw new Error('oracle: only atomic relation heads are modeled');
      const rel = m.rels[`${t.head.name}/${t.objects.length + 1}`];
      const check = (objIdx, tuple) => {
        if (objIdx === t.objects.length) return rel.has(tuple.join(','));
        const o = t.objects[objIdx];
        const den = evalTerm(o.term, m);
        const every = o.sign === '-';
        for (let y = 0; y < m.n; y++) {
          if (!(den & (1 << y))) continue;
          const hit = check(objIdx + 1, tuple.concat(y));
          if (every && !hit) return false;
          if (!every && hit) return true;
        }
        return every; // ∀ over the empty denotation holds; ∃ fails
      };
      let mask = 0;
      for (let x = 0; x < m.n; x++) if (check(0, [x])) mask |= 1 << x;
      return mask;
    }
    case 'propterm': {
      const truth = t.inner.type === 'prop'
        ? evalProp(t.inner, m)
        : evalTerm(t.inner, m) !== 0;
      return truth ? m.full : 0;
    }
  }
}

function evalProp(p, m) {
  const S = evalTerm(p.subject.term, m);
  const P = evalTerm(p.predicate.term, m);
  const test = (x) => (p.predicate.sign === '-' ? !(P & (1 << x)) : !!(P & (1 << x)));
  const every = p.subject.sign === '-';
  for (let x = 0; x < m.n; x++) {
    if (!(S & (1 << x))) continue;
    const hit = test(x);
    if (every && !hit) return false;
    if (!every && hit) return true;
  }
  return every; // no import: universals hold vacuously, particulars fail
}

// ── Model enumeration ─────────────────────────────────────────────────────

function* models(vocab, n, cap) {
  const full = (1 << n) - 1;
  const relSizes = vocab.rels.map((r) => Math.pow(n, r.arity));
  const total =
    Math.pow(n, vocab.singular.length) *
    Math.pow(2, vocab.unary.length * n) *
    relSizes.reduce((a, s) => a * Math.pow(2, s), 1);
  if (total > cap) {
    // Random sampling: sound for counter-model hunting, not exhaustive.
    for (let k = 0; k < cap; k++) yield randomModel(vocab, n);
    return;
  }
  const sing = {}, unary = {}, rels = {};
  function* fillSing(i) {
    if (i === vocab.singular.length) { yield* fillUnary(0); return; }
    for (let e = 0; e < n; e++) { sing[vocab.singular[i]] = e; yield* fillSing(i + 1); }
  }
  function* fillUnary(i) {
    if (i === vocab.unary.length) { yield* fillRel(0); return; }
    for (let mask = 0; mask <= full; mask++) { unary[vocab.unary[i]] = mask; yield* fillUnary(i + 1); }
  }
  function* fillRel(i) {
    if (i === vocab.rels.length) {
      yield { n, full, singular: { ...sing }, unary: { ...unary }, rels: { ...rels } };
      return;
    }
    const r = vocab.rels[i];
    const tuples = allTuples(n, r.arity);
    for (let mask = 0; mask < (1 << tuples.length); mask++) {
      const set = new Set();
      tuples.forEach((tu, b) => { if (mask & (1 << b)) set.add(tu.join(',')); });
      rels[`${r.name}/${r.arity}`] = set;
      yield* fillRel(i + 1);
    }
  }
  yield* fillSing(0);
}

function allTuples(n, arity) {
  if (arity === 0) return [[]];
  return allTuples(n, arity - 1).flatMap((t) => Array.from({ length: n }, (_, e) => t.concat(e)));
}

let seed = 20260704;
const rand = (k) => (seed = (seed * 1103515245 + 12345) & 0x7fffffff, seed % k);

function randomModel(vocab, n) {
  const full = (1 << n) - 1;
  const m = { n, full, singular: {}, unary: {}, rels: {} };
  for (const s of vocab.singular) m.singular[s] = rand(n);
  for (const u of vocab.unary) m.unary[u] = rand(full + 1);
  for (const r of vocab.rels) {
    const set = new Set();
    for (const tu of allTuples(n, r.arity)) if (rand(2)) set.add(tu.join(','));
    m.rels[`${r.name}/${r.arity}`] = set;
  }
  return m;
}

// Search for a counter-model: all premises true, conclusion false.
// Returns the model, or null if none exists up to maxN (exhaustive within
// cap models per size).
function counterModel(premises, conclusion, { maxN = 3, cap = 300000 } = {}) {
  const vocab = vocabOf([...premises, conclusion]);
  for (let n = 1; n <= maxN; n++) {
    for (const m of models(vocab, n, cap)) {
      if (premises.every((p) => evalProp(p, m)) && !evalProp(conclusion, m)) return m;
    }
  }
  return null;
}

const entails = (premises, conclusion, opts) => counterModel(premises, conclusion, opts) === null;

const consistent = (props, { maxN = 3, cap = 300000 } = {}) => {
  const vocab = vocabOf(props);
  for (let n = 1; n <= maxN; n++) {
    for (const m of models(vocab, n, cap)) {
      if (props.every((p) => evalProp(p, m))) return true;
    }
  }
  return false;
};

// ── Random formula generation ─────────────────────────────────────────────

// Atomic-categorical: atoms under 0–2 negations, singular subjects and
// predicates included — the fragment where the engine claims a complete
// decision.
function randomAtomicTerm(atoms, singulars) {
  const t = singulars.length && rand(6) === 0
    ? Atom(singulars[rand(singulars.length)], true)
    : Atom(atoms[rand(atoms.length)]);
  const negs = rand(4) === 0 ? 1 + rand(2) : 0;
  let out = t;
  for (let i = 0; i < negs; i++) out = Neg(out);
  return out;
}

function randomCategoricalProp(atoms, singulars) {
  const useSing = singulars.length > 0 && rand(4) === 0;
  const subject = useSing
    ? ST('±', Atom(singulars[rand(singulars.length)], true))
    : ST(rand(2) ? '+' : '-', randomAtomicTerm(atoms, singulars));
  const predicate = ST(rand(2) ? '+' : '-', randomAtomicTerm(atoms, singulars));
  return Prop(subject, predicate);
}

function randomRelationalProp(atoms, singulars, relName) {
  const obj = () => {
    if (singulars.length && rand(3) === 0) return ST('±', Atom(singulars[rand(singulars.length)], true));
    return ST(rand(2) ? '+' : '-', Atom(atoms[rand(atoms.length)]));
  };
  const complex = (depth) => Rel(Atom(relName),
    [rand(6) === 0 && depth > 0 ? ST(rand(2) ? '+' : '-', complex(depth - 1)) : obj()]);
  const side = (allowRel) =>
    allowRel && rand(2) ? ST(rand(2) ? '+' : '-', complex(1))
                        : ST(rand(2) ? '+' : '-', Atom(atoms[rand(atoms.length)]));
  const subject = rand(4) === 0 && singulars.length
    ? ST('±', Atom(singulars[rand(singulars.length)], true))
    : side(rand(4) === 0);
  return Prop(subject.sign === '±' ? subject : ST(subject.sign, subject.term), side(true));
}

// ── Fuzz suites ───────────────────────────────────────────────────────────

function fuzzCategoricalExactness(iters, log) {
  const atoms = ['A', 'B', 'C'];
  const singulars = ['s'];
  let mismatches = 0, valids = 0;
  for (let k = 0; k < iters; k++) {
    const nPrem = 1 + rand(3);
    const premises = Array.from({ length: nPrem }, () => randomCategoricalProp(atoms, singulars));
    const conclusion = randomCategoricalProp(atoms, singulars);
    const verdict = checkArgument(premises, conclusion).verdict; // 'valid' | 'invalid'
    // Counter-model domains: each particular needs at most one witness, so
    // n = 4 comfortably covers 1–3 premises plus the denied conclusion.
    const semantic = entails(premises, conclusion, { maxN: 4, cap: 400000 });
    if (verdict === 'valid') valids++;
    if ((verdict === 'valid') !== semantic) {
      mismatches++;
      log(`  MISMATCH engine=${verdict} semantic=${semantic ? 'valid' : 'invalid'}`);
      premises.forEach((p) => log(`    premise    ${printProposition(p)}`));
      log(`    conclusion ${printProposition(conclusion)}`);
      if (mismatches >= 5) break;
    }
  }
  return { mismatches, note: `${valids}/${iters} valid` };
}

// Compound-bearing categorical props so Simp's conjunct-drops and Add's
// compound intros face the oracle too.
function randomCompoundProp(atoms, singulars) {
  const compound = () => Compound(Array.from({ length: 2 + rand(2) }, () =>
    ST(rand(3) ? '+' : '-', randomAtomicTerm(atoms, singulars))));
  const side = () => rand(2) ? ST(rand(2) ? '+' : '-', compound())
                             : ST(rand(2) ? '+' : '-', randomAtomicTerm(atoms, singulars));
  return Prop(side(), side());
}

function fuzzStepSoundness(iters, log) {
  const atoms = ['A', 'B'];
  const singulars = ['s'];
  let bad = 0, steps = 0;
  for (let k = 0; k < iters; k++) {
    const roll = rand(3);
    const gen = () => roll === 0
      ? randomRelationalProp(atoms, singulars, 'R')
      : roll === 1
        ? randomCompoundProp(atoms, singulars)
        : randomCategoricalProp(atoms, singulars);
    const a = gen(), b = gen();
    let results;
    try {
      results = [
        { p: obverse(a), parents: [a] },
        { p: contrapositive(a), parents: [a] },
        ...TFL.applySimp(a).map((p) => ({ p, parents: [a] })),
        ...TFL.applyDON(a, b).map((p) => ({ p, parents: [a, b] })),
        ...TFL.applyDON(b, a).map((p) => ({ p, parents: [a, b] })),
        ...TFL.applyAdd(a, b).map((p) => ({ p, parents: [a, b] })),
        { p: TFL.tautology(a.subject.term), parents: [] },
      ].filter((r) => r.p);
    } catch { continue; } // generator occasionally builds engine-invalid props
    for (const { p, parents } of results) {
      steps++;
      if (!entails(parents, p, { maxN: 3, cap: 60000 })) {
        bad++;
        log(`  UNSOUND step: ${parents.map(printProposition).join(' , ')} ⊢ ${printProposition(p)}`);
        if (bad >= 5) return { mismatches: bad, note: `${steps} steps` };
      }
    }
  }
  return { mismatches: bad, note: `${steps} steps checked` };
}

function fuzzRelationalDerivations(iters, log) {
  const atoms = ['A', 'B'];
  const singulars = ['s'];
  let proved = 0, bad = 0;
  for (let k = 0; k < iters; k++) {
    const premises = [
      randomRelationalProp(atoms, singulars, 'R'),
      randomRelationalProp(atoms, singulars, 'R'),
    ];
    const conclusion = randomRelationalProp(atoms, singulars, 'R');
    let proof;
    try { proof = derive(premises, conclusion, { maxLines: 120 }); }
    catch { continue; }
    if (!proof.found) continue;
    proved++;
    const counter = counterModel(premises, conclusion, { maxN: 3, cap: 120000 });
    if (counter) {
      bad++;
      log('  UNSOUND derivation:');
      premises.forEach((p) => log(`    premise    ${printProposition(p)}`));
      log(`    conclusion ${printProposition(conclusion)}`);
      proof.lines.forEach((l) => log(`    ${l.n}. ${l.text}  [${l.rule}${l.parents.length ? ' ' + l.parents.join(',') : ''}]`));
      if (bad >= 3) break;
    }
  }
  return { mismatches: bad, note: `${proved} proofs found in ${iters} tries` };
}

// ── CLI ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  const nIdx = process.argv.indexOf('-n');
  const iters = nIdx >= 0 ? parseInt(process.argv[nIdx + 1], 10) : 1000;
  const log = console.log;
  let failed = 0;
  for (const [name, fn, scale] of [
    ['categorical exactness', fuzzCategoricalExactness, 1],
    ['rule-step soundness', fuzzStepSoundness, 1],
    ['relational derivation soundness', fuzzRelationalDerivations, 1],
  ]) {
    const t0 = Date.now();
    const { mismatches, note } = fn(Math.ceil(iters * scale), log);
    log(`${mismatches === 0 ? '✓' : '✗'} ${name}: ${mismatches} failures (${note}, ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    if (mismatches > 0) failed = 1;
  }
  process.exit(failed);
}

module.exports = { vocabOf, evalTerm, evalProp, models, counterModel, entails, consistent };
