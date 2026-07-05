// tfl.js — TFL Lab core engine, D1: parser + printer (pure logic, no DOM).
// Loadable as a browser script (window.TFL) or via require() in node.
//
// Notation accepted by the parser (the exact notation the four TFL courses
// print, plus plain-ASCII aliases):
//
//   −S+P  -S+P               a proposition is a signed pair in ENF:
//                            (quantity sign)(subject term)(quality sign)(predicate term)
//   +  −  -  ±  +-           signs: plus; minus (typographic or ASCII);
//                            wild quantity (± or the ASCII alias +-)
//   Socrates*  ±s*           singular terms carry a trailing star
//   Boy'  A″  Girl′          proterm primes: ′ → ' and ″ → '' are normalized
//                            into the name (D3 gives them meaning)
//   Wise  German_Shepherd    bare terms are strings: Unicode letters, then
//   H2O  S₁₂                 letters, digits, _, subscript digits, primes.
//                            No hyphens — ASCII - and typographic − are ALWAYS
//                            the minus functor, so non-smoker cannot lex as
//                            one term; quote it instead:
//   "non-smoker"             quoted terms allow anything but the quote char
//   "head of a horse"        and newline
//   (−T)                     negative term (single minus-signed group)
//   (+White+Horse)           compound (conjunctive) term — first element signed
//   (Lov+Girl)               relational complex — UNSIGNED head term, then one
//   (Gave+Rose+Girl)         or more signed objects; n-ary and nesting are
//   (Lov+(Adm−Teacher))      unbounded; objects may be wild: (Lov±Mary*)
//   [p]  +[+A″+B]+[+A″+C]    propositional terms wear square brackets; the
//                            content is a proposition or a bare statement term
//   +V^2+C⁰                  quantity levels (TFL⁺, D9): explicit ^ marker or
//                            superscript digits; level 0 is classical
//                            some/every and is what the printer omits, so
//                            classical notation is unchanged. The D2 engine
//                            works at level 0 only until D9.
//
// The printer emits typographic − and ±, compact spacing (−S+P), superscript
// levels, and quotes any term name that isn't a bare identifier. Round-trip
// holds at the AST level: parse(print(x)) is structurally equal to x.

(function (global, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  global.TFL = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  // ── AST constructors ──────────────────────────────────────────────────
  //
  // Terms:
  //   Atom(name, singular)      Wise · Socrates* · Boy' · "non-smoker"
  //   Neg(term)                 (−T)
  //   Compound([{sign,term}…])  (+White+Horse) — 2+ elements, all signed
  //   Rel(head, [{sign,term}…]) (Lov+Girl) — unsigned head, 1+ signed objects
  //   PropTerm(inner)           [p] / [+A''+B]; inner is a Prop or a bare Atom
  //
  // Propositions:
  //   Prop(ST(sign, term, level), ST(sign, term, level))
  //   sign is '+' | '-' | '±' (ASCII internally; the printer emits −/±);
  //   level is the quantity level, 0 = classical (omitted when printed).

  const Atom     = (name, singular = false) => ({ type: 'atom', name, singular });
  const Neg      = (term)                   => ({ type: 'neg', term });
  const Compound = (elements)               => ({ type: 'compound', elements });
  const Rel      = (head, objects)          => ({ type: 'rel', head, objects });
  const PropTerm = (inner)                  => ({ type: 'propterm', inner });
  const ST       = (sign, term, level = 0)  => ({ sign, term, level });
  const Prop     = (subject, predicate)     => ({ type: 'prop', subject, predicate });

  // Structural equality for terms.
  function termEq(a, b) {
    if (a.type !== b.type) return false;
    switch (a.type) {
      case 'atom':     return a.name === b.name && a.singular === b.singular;
      case 'neg':      return termEq(a.term, b.term);
      case 'compound': return listEq(a.elements, b.elements);
      case 'rel':      return termEq(a.head, b.head) && listEq(a.objects, b.objects);
      case 'propterm':
        if (a.inner.type !== b.inner.type) return false;
        return a.inner.type === 'prop' ? propEq(a.inner, b.inner) : termEq(a.inner, b.inner);
    }
  }
  const stEq   = (a, b) => a.sign === b.sign && a.level === b.level && termEq(a.term, b.term);
  const listEq = (a, b) => a.length === b.length && a.every((x, i) => stEq(x, b[i]));
  const propEq = (a, b) => stEq(a.subject, b.subject) && stEq(a.predicate, b.predicate);

  // ── Errors ────────────────────────────────────────────────────────────

  class ParseError extends Error {
    constructor(message, pos) {
      super(`${message} (at position ${pos})`);
      this.name = 'ParseError';
      this.pos = pos; // 0-based index into the source string
    }
  }

  // ── Tokenizer ─────────────────────────────────────────────────────────
  // Token kinds: 'plus' 'minus' 'wild' 'lparen' 'rparen' 'lbracket'
  //              'rbracket' 'name' (text, singular) 'level' (value) 'eof'

  const SUBSCRIPTS   = '₀₁₂₃₄₅₆₇₈₉';
  const SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

  const isNameStart = (c) => /\p{L}/u.test(c);
  const isNameChar  = (c) => /[\p{L}0-9_']/u.test(c) || SUBSCRIPTS.includes(c);

  // A printed name needs quotes unless it's a bare identifier.
  function isBareName(name) {
    if (name.length === 0 || !isNameStart(name[0])) return false;
    for (const c of name) if (!isNameChar(c)) return false;
    return true;
  }

  function tokenize(src) {
    const tokens = [];
    let i = 0;
    const push = (kind, pos, extra) => tokens.push(Object.assign({ kind, pos }, extra));
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '+') {
        // ASCII alias: +- is the wild-quantity sign ± (a bare minus after +
        // could never start a term — negative terms are parenthesized).
        if (src[i + 1] === '-' || src[i + 1] === '−') { push('wild', i); i += 2; continue; }
        push('plus', i); i++; continue;
      }
      if (c === '-' || c === '−') { push('minus', i); i++; continue; }
      if (c === '±') { push('wild', i); i++; continue; }
      if (c === '(') { push('lparen', i); i++; continue; }
      if (c === ')') { push('rparen', i); i++; continue; }
      if (c === '[') { push('lbracket', i); i++; continue; }
      if (c === ']') { push('rbracket', i); i++; continue; }
      if (c === '"') {
        let j = i + 1;
        while (j < src.length && src[j] !== '"' && src[j] !== '\n') j++;
        if (src[j] !== '"') throw new ParseError('Unclosed quote', i);
        if (j === i + 1) throw new ParseError('Empty quoted term', i);
        const singular = src[j + 1] === '*';
        push('name', i, { text: src.slice(i + 1, j), singular });
        i = j + (singular ? 2 : 1);
        continue;
      }
      if (c === '^') {
        let j = i + 1;
        while (j < src.length && /[0-9]/.test(src[j])) j++;
        if (j === i + 1) throw new ParseError("Expected digits after '^' (quantity level)", i);
        push('level', i, { value: parseInt(src.slice(i + 1, j), 10) });
        i = j;
        continue;
      }
      if (SUPERSCRIPTS.includes(c)) {
        let value = 0, j = i;
        while (j < src.length && SUPERSCRIPTS.includes(src[j])) {
          value = value * 10 + SUPERSCRIPTS.indexOf(src[j]);
          j++;
        }
        push('level', i, { value });
        i = j;
        continue;
      }
      if (isNameStart(c)) {
        let j = i, text = '';
        while (j < src.length) {
          const d = src[j];
          if (d === '′') { text += "'"; j++; continue; }   // prime → '
          if (d === '″') { text += "''"; j++; continue; }  // double prime → ''
          if (d === '"') { text += "''"; j++; continue; }  // A" is A″ — a quoted
                                                           // term can't follow a name
          if (isNameChar(d)) { text += d; j++; continue; }
          break;
        }
        const singular = src[j] === '*';
        push('name', i, { text, singular });
        i = j + (singular ? 1 : 0);
        continue;
      }
      if (/[0-9]/.test(c)) throw new ParseError('Term names must start with a letter', i);
      throw new ParseError(`Unexpected character '${c}'`, i);
    }
    push('eof', src.length);
    return tokens;
  }

  // ── Parser ────────────────────────────────────────────────────────────
  // proposition := signed signed eof
  // signed      := sign term level?
  // sign        := '+' | '−' | '±'
  // term        := name | '(' group ')' | '[' prop-or-name ']'
  // group       := sign term                  → Neg (−) / the term itself (+)
  //              | sign term (sign term)+     → Compound
  //              | term                       → the term itself (plain parens)
  //              | term (sign term)+          → Rel (unsigned head)

  function Parser(src) {
    const tokens = tokenize(src);
    let i = 0;

    const peek = () => tokens[i];
    const next = () => tokens[i++];

    function fail(message, t) {
      throw new ParseError(message, (t || peek()).pos);
    }

    function tokenText(t) {
      switch (t.kind) {
        case 'eof': return 'end of input';
        case 'name': return `'${t.text}${t.singular ? '*' : ''}'`;
        case 'plus': return "'+'";
        case 'minus': return "'−'";
        case 'wild': return "'±'";
        case 'level': return `level marker '^${t.value}'`;
        default: return `'${{ lparen: '(', rparen: ')', lbracket: '[', rbracket: ']' }[t.kind]}'`;
      }
    }

    const isSign = (t) => t.kind === 'plus' || t.kind === 'minus' || t.kind === 'wild';
    const signChar = (t) => (t.kind === 'plus' ? '+' : t.kind === 'minus' ? '-' : '±');

    function parseSigned() {
      const t = peek();
      if (!isSign(t)) fail(`Expected a sign (+, − or ±), found ${tokenText(t)}`, t);
      const sign = signChar(next());
      const term = parseTermInner();
      let level = 0;
      if (peek().kind === 'level') level = next().value;
      return ST(sign, term, level);
    }

    function parseTermInner() {
      const t = peek();
      if (t.kind === 'name') { next(); return Atom(t.text, t.singular); }
      if (t.kind === 'lparen') { next(); return parseGroup(t); }
      if (t.kind === 'lbracket') {
        next();
        let inner;
        if (isSign(peek())) {
          const subject = parseSigned();
          const predicate = parseSigned();
          inner = Prop(subject, predicate);
        } else if (peek().kind === 'name') {
          const n = next();
          inner = Atom(n.text, n.singular);
        } else {
          fail(`Expected a proposition or statement term inside [ ], found ${tokenText(peek())}`);
        }
        if (peek().kind !== 'rbracket') fail(`Expected ']', found ${tokenText(peek())}`);
        next();
        return PropTerm(inner);
      }
      fail(`Expected a term, found ${tokenText(t)}`, t);
    }

    function parseGroup(open) {
      const first = peek();
      let elements;
      if (isSign(first)) {
        elements = [parseSigned()];
        while (isSign(peek())) elements.push(parseSigned());
        closeParen();
        if (elements.length === 1) {
          const { sign, term, level } = elements[0];
          if (level !== 0) fail('A quantity level cannot attach inside a bare signed group', open);
          if (sign === '-') return Neg(term);
          if (sign === '+') return term; // (+T) is just T
          fail('A wild sign (±) needs a proposition or relational-complex context', open);
        }
        return Compound(elements);
      }
      // Unsigned first element: relational complex, or plain grouping parens.
      const head = parseTermInner();
      if (peek().kind === 'rparen') { next(); return head; } // (T) is just T
      const objects = [];
      while (isSign(peek())) objects.push(parseSigned());
      if (objects.length === 0) {
        fail(`Expected a signed object or ')' after the relation term, found ${tokenText(peek())}`);
      }
      closeParen();
      return Rel(head, objects);
    }

    function closeParen() {
      if (peek().kind !== 'rparen') fail(`Expected ')', found ${tokenText(peek())}`);
      next();
    }

    function atEnd(what) {
      if (peek().kind !== 'eof') {
        fail(`Expected end of input after the ${what}, found ${tokenText(peek())}`);
      }
    }

    return {
      proposition() {
        const subject = parseSigned();
        const predicate = parseSigned();
        atEnd('proposition');
        return Prop(subject, predicate);
      },
      term() {
        const t = parseTermInner();
        atEnd('term');
        return t;
      },
      signedTerm() {
        const st = parseSigned();
        atEnd('signed term');
        return st;
      },
    };
  }

  const parseProposition = (src) => Parser(src).proposition();
  const parseTerm        = (src) => Parser(src).term();
  const parseSignedTerm  = (src) => Parser(src).signedTerm();

  // ── Printer ───────────────────────────────────────────────────────────

  const printSign  = (s) => (s === '-' ? '−' : s);
  const printLevel = (n) =>
    n === 0 ? '' : String(n).split('').map((d) => SUPERSCRIPTS[+d]).join('');

  function printTerm(t) {
    switch (t.type) {
      case 'atom': {
        const name = isBareName(t.name) ? t.name : `"${t.name}"`;
        return name + (t.singular ? '*' : '');
      }
      case 'neg':      return `(−${printTerm(t.term)})`;
      case 'compound': return `(${t.elements.map(printST).join('')})`;
      case 'rel':      return `(${printTerm(t.head)}${t.objects.map(printST).join('')})`;
      case 'propterm':
        return `[${t.inner.type === 'prop' ? printProposition(t.inner) : printTerm(t.inner)}]`;
    }
  }

  const printST = (st) => printSign(st.sign) + printTerm(st.term) + printLevel(st.level);

  const printProposition = (p) => printST(p.subject) + printST(p.predicate);

  // ════════════════════════════════════════════════════════════════════════
  // D2 — Inference core.
  //
  // Rule inventory (Englebretsen 1996 App. B, via Castro-Manzano et al. 2018,
  // as the four courses teach it):
  //   immediate — DN (double negation), EN (external negation: the
  //   contradictory operation, used for counterclaims — not an entailment),
  //   IN (internal negation / obversion), Com (conversion of I and E; folded
  //   into canonical equality together with Assoc and DN), Contrap
  //   (contraposition of A and O), It (the tautology move −T+T);
  //   mediate — DON (dictum de omni: a donor premise with a net-− occurrence
  //   of M licenses substituting its donation for a net-+ occurrence of M in
  //   a host, at any nesting depth), Simp (drop a conjunct from a compound at
  //   a net-+ occurrence; from +X+Y infer +X+X), Add (same-subject compound
  //   introduction).
  //
  // Scope guards (per the roadmap's design decisions):
  //   - level 0 only until D9 — any nonzero quantity level is rejected;
  //   - the wild sign ± attaches only to singular terms and resolves to + or
  //     − per use ("computes with whichever value the inference needs");
  //   - no existential import: −S+P never yields +S+P; the only tautologies
  //     introduced are the A-forms −T+T.
  //
  // Validity: for categorical arguments (no relational complexes) the P/Z
  // counterclaim test decides — Sommers' REGAL as the courses derive it:
  // a set is inconsistent iff some way of resolving the wilds and re-using
  // universal premises leaves exactly one particular and an algebraic sum of
  // zero. For relational arguments the engine reports what it can prove:
  // 'valid' (traced derivation found), 'contradicted' (the conclusion's
  // contradictory is derivable), or 'unknown' (D3's indirect proofs extend
  // this reach).

  class EngineError extends Error {
    constructor(message) {
      super(message);
      this.name = 'EngineError';
    }
  }

  // ── Engine-fragment validation ────────────────────────────────────────

  function validateTerm(t, slot) {
    switch (t.type) {
      case 'atom': return;
      case 'neg': return validateTerm(t.term, 'neg');
      case 'compound':
        for (const el of t.elements) {
          if (el.sign === '±') throw new EngineError('± cannot sign a compound element (it marks quantity, not quality)');
          if (el.level !== 0) throw new EngineError('quantity levels are not supported until D9');
          validateTerm(el.term, 'compound');
        }
        return;
      case 'rel':
        validateTerm(t.head, 'rel-head');
        for (const o of t.objects) {
          if (o.level !== 0) throw new EngineError('quantity levels are not supported until D9');
          if (o.sign === '±' && !(o.term.type === 'atom' && o.term.singular)) {
            throw new EngineError('wild quantity (±) requires a singular term');
          }
          validateTerm(o.term, 'rel-object');
        }
        return;
      case 'propterm':
        if (t.inner.type === 'prop') validateProp(t.inner);
        return;
    }
  }

  function validateProp(p) {
    for (const st of [p.subject, p.predicate]) {
      if (st.level !== 0) throw new EngineError('quantity levels are not supported until D9');
      validateTerm(st.term, 'top');
    }
    if (p.subject.sign === '±' && !(p.subject.term.type === 'atom' && p.subject.term.singular)) {
      throw new EngineError('wild quantity (±) requires a singular subject');
    }
    if (p.predicate.sign === '±') {
      throw new EngineError('± cannot sign a predicate (quality is + or −; write the quantity wild on the subject)');
    }
  }

  // ── Canonical form: equality up to Com, Assoc, DN, and wild quantity ──
  //
  // DN strips; compounds flatten through +-signed nesting (Assoc) and sort
  // (Com); I- and E-form propositions sort their two sides (conversion);
  // quantity signs on singular subjects and singular relational objects
  // normalize to ± (for a singleton, some/every are the same claim — the
  // wild-quantity pun itself).

  const isSingularAtom = (t) => t.type === 'atom' && t.singular;

  function canonTerm(t) {
    switch (t.type) {
      case 'atom': return t;
      case 'neg': {
        const inner = canonTerm(t.term);
        return inner.type === 'neg' ? inner.term : Neg(inner);
      }
      case 'compound': {
        const els = [];
        for (const el of t.elements) {
          const c = canonTerm(el.term);
          if (el.sign === '+' && c.type === 'compound') els.push(...c.elements);
          else els.push(ST(el.sign, c));
        }
        if (els.length === 1) {
          return els[0].sign === '-' ? canonTerm(Neg(els[0].term)) : els[0].term;
        }
        els.sort((a, b) => (printST(a) < printST(b) ? -1 : printST(a) > printST(b) ? 1 : 0));
        return Compound(els);
      }
      case 'rel':
        return Rel(canonTerm(t.head),
          t.objects.map((o) => ST(isSingularAtom(o.term) ? '±' : o.sign, canonTerm(o.term))));
      case 'propterm':
        return PropTerm(t.inner.type === 'prop' ? canonProp(t.inner) : t.inner);
    }
  }

  function canonProp(p) {
    const sTerm = canonTerm(p.subject.term);
    const qTerm = canonTerm(p.predicate.term);
    const sSign = isSingularAtom(sTerm) ? '±' : p.subject.sign;
    const qSign = p.predicate.sign;
    // Conversion (Com): I-forms (+,+) and E-forms (−,−) commute; a wild
    // singular subject joins in via whichever of its readings matches
    // (±s*+P ⊣⊢ +P+s*, and ±s*−P ⊣⊢ −P−s*, sound on a singleton).
    const iLike = (sSign === '+' || sSign === '±') && qSign === '+';
    const eLike = (sSign === '-' || sSign === '±') && qSign === '-';
    if ((iLike || eLike) && termKeyRaw(qTerm) < termKeyRaw(sTerm)) {
      const base = iLike ? '+' : '-';
      return Prop(ST(isSingularAtom(qTerm) ? '±' : base, qTerm), ST(base, sTerm));
    }
    // An un-swapped commutable side still normalizes its subject sign.
    if (iLike || eLike) {
      return Prop(ST(isSingularAtom(sTerm) ? '±' : (iLike ? '+' : '-'), sTerm), ST(qSign, qTerm));
    }
    return Prop(ST(sSign, sTerm), ST(qSign, qTerm));
  }

  const termKeyRaw = printTerm; // key of an already-canonical term
  const propKey = (p) => printProposition(canonProp(p));
  const termKey = (t) => printTerm(canonTerm(t));
  const propEqUpTo = (a, b) => propKey(a) === propKey(b);

  function nodeCount(t) {
    switch (t.type) {
      case 'atom': return 1;
      case 'neg': return 1 + nodeCount(t.term);
      case 'compound': return 1 + t.elements.reduce((n, e) => n + nodeCount(e.term), 0);
      case 'rel': return 1 + nodeCount(t.head) + t.objects.reduce((n, o) => n + nodeCount(o.term), 0);
      case 'propterm': return 2 + (t.inner.type === 'prop' ? propNodes(t.inner) : nodeCount(t.inner));
    }
  }
  const propNodes = (p) => nodeCount(p.subject.term) + nodeCount(p.predicate.term);

  // ── EN, IN, Contrap, It ───────────────────────────────────────────────

  const flipSign = (s) => (s === '+' ? '-' : s === '-' ? '+' : '±');

  // EN — the contradictory: flip quantity and quality (± stays wild).
  const contradictory = (p) =>
    canonProp(Prop(ST(flipSign(p.subject.sign), p.subject.term),
                   ST(flipSign(p.predicate.sign), p.predicate.term)));

  // IN — obversion: flip the quality and negate the predicate term.
  const obverse = (p) =>
    canonProp(Prop(p.subject, ST(flipSign(p.predicate.sign), Neg(p.predicate.term))));

  // Contrap — contraposition of A (−S+P → −(−P)+(−S)) and O (+S−P → +(−P)−(−S)).
  // A wild subject uses its universal reading for A, particular for O.
  function contrapositive(p) {
    const sSign = p.subject.sign, qSign = p.predicate.sign;
    const aForm = (sSign === '-' || sSign === '±') && qSign === '+';
    const oForm = (sSign === '+' || sSign === '±') && qSign === '-';
    if (!aForm && !oForm) return null;
    return canonProp(Prop(ST(aForm ? '-' : '+', Neg(p.predicate.term)),
                          ST(aForm ? '+' : '-', Neg(p.subject.term))));
  }

  // It — the tautology move: −T+T for any term ("every T is T"; safe with no
  // existential import, unlike +T+T).
  const tautology = (t) => canonProp(Prop(ST('-', t), ST('+', t)));

  // ── Net-sign occurrences and substitution ─────────────────────────────
  //
  // An occurrence is a term position inside a proposition together with the
  // product of the signs governing it (Course 3 L2's net sign rule). A ± on
  // the occurrence's own slot makes the net sign resolvable. Relation heads
  // and the inside of propositional terms are opaque: the courses never
  // substitute there.

  function occurrences(p) {
    const out = [];
    const walk = (t, path, sign, ownWild) => {
      out.push({ term: t, path, sign, ownWild });
      switch (t.type) {
        case 'neg':
          walk(t.term, path.concat('neg'), -sign, false);
          break;
        case 'compound':
          t.elements.forEach((el, i) =>
            walk(el.term, path.concat(i), el.sign === '-' ? -sign : sign, false));
          break;
        case 'rel':
          t.objects.forEach((o, i) =>
            walk(o.term, path.concat(i),
                 o.sign === '-' ? -sign : sign, o.sign === '±'));
          break;
      }
    };
    walk(p.subject.term, ['subject'], p.subject.sign === '-' ? -1 : 1, p.subject.sign === '±');
    walk(p.predicate.term, ['predicate'], p.predicate.sign === '-' ? -1 : 1, false);
    return out;
  }

  const canBePlus = (occ) => occ.ownWild || occ.sign === 1;

  // Replace the term at `path` with `newTerm`. A ± slot being substituted
  // must be fixed to the resolution that produced the wanted net sign —
  // under an odd number of governing minuses only the universal reading of
  // the wild puts the occurrence at net + (the fuzz oracle caught the
  // + hard-coding this replaces). `fixSign` is that resolution; canonProp
  // restores ± when the new term is itself singular, where the pun stays
  // sound.
  function replaceAt(p, path, newTerm, fixSign = '+') {
    const [where, ...rest] = path;
    const subTerm = (t, steps) => {
      if (steps.length === 0) return newTerm;
      const [step, ...more] = steps;
      if (t.type === 'neg') return Neg(subTerm(t.term, more));
      if (t.type === 'compound') {
        return Compound(t.elements.map((el, i) =>
          i === step ? ST(el.sign, subTerm(el.term, more)) : el));
      }
      if (t.type === 'rel') {
        return Rel(t.head, t.objects.map((o, i) =>
          i === step
            ? ST(o.sign === '±' && more.length === 0 ? fixSign : o.sign, subTerm(o.term, more))
            : o));
      }
      throw new EngineError('bad substitution path');
    };
    if (where === 'subject') {
      const sign = rest.length === 0 && p.subject.sign === '±' ? fixSign : p.subject.sign;
      return canonProp(Prop(ST(sign, subTerm(p.subject.term, rest)), p.predicate));
    }
    return canonProp(Prop(p.subject, ST(p.predicate.sign, subTerm(p.predicate.term, rest))));
  }

  // ── DON ───────────────────────────────────────────────────────────────

  // Read a premise as a donor: −M+D donates D for M; −M−E donates (−E) (the
  // obverse reading); a wild subject uses its universal reading.
  function donorReadings(p) {
    if (p.subject.sign === '+') return [];
    const M = p.subject.term;
    const D = p.predicate.sign === '+' ? p.predicate.term : canonTerm(Neg(p.predicate.term));
    return [{ M, key: termKey(M), D }];
  }

  // All DON results of donor → host.
  function applyDON(donor, host) {
    const results = [];
    for (const { M, key, D } of donorReadings(donor)) {
      const dKey = termKey(D);
      if (dKey === key) continue;
      for (const occ of occurrences(host)) {
        if (!canBePlus(occ)) continue;
        if (termKey(occ.term) !== key) continue;
        results.push(replaceAt(host, occ.path, D, occ.sign === 1 ? '+' : '-'));
      }
    }
    return results;
  }

  // ── Simp and Add ──────────────────────────────────────────────────────

  // Simp: at a net-+ occurrence of a compound, drop one conjunct; and from a
  // particular +X±Y, +X+X ("some X is Y, so some X is X").
  function applySimp(p) {
    const results = [];
    for (const occ of occurrences(p)) {
      if (!canBePlus(occ) || occ.term.type !== 'compound') continue;
      occ.term.elements.forEach((_, i) => {
        const rest = occ.term.elements.filter((_, j) => j !== i);
        const t = rest.length === 1
          ? (rest[0].sign === '-' ? Neg(rest[0].term) : rest[0].term)
          : Compound(rest);
        results.push(replaceAt(p, occ.path, t));
      });
    }
    if (p.subject.sign === '+' || p.subject.sign === '±') {
      results.push(canonProp(Prop(ST('+', p.subject.term), ST('+', p.subject.term))));
      if (p.predicate.sign === '+') {
        results.push(canonProp(Prop(ST('+', p.predicate.term), ST('+', p.predicate.term))));
      }
    }
    return results;
  }

  // Add: same-subject compound introduction — {−S+A, −S+B} ⊢ −S+(+A+B);
  // {+S+A, −S+B} ⊢ +S+(+A+B).
  function applyAdd(a, b) {
    const results = [];
    for (const [x, y] of [[a, b], [b, a]]) {
      if (termKey(x.subject.term) !== termKey(y.subject.term)) continue;
      if (x.predicate.sign !== '+' || y.predicate.sign !== '+') continue;
      if (y.subject.sign !== '-' && y.subject.sign !== '±') continue;
      const subjSign = x.subject.sign === '±' ? x.subject.sign : x.subject.sign;
      results.push(canonProp(Prop(
        ST(subjSign, x.subject.term),
        ST('+', Compound([ST('+', x.predicate.term), ST('+', y.predicate.term)])))));
    }
    return results;
  }

  // ── Traced derivation search ──────────────────────────────────────────

  // Forward-chaining saturation from the premises (plus tautology lines for
  // the argument's own terms), fuel-bounded. Returns the goal's pruned
  // ancestry: lines of { n, prop, text, rule, parents } with 1-based numbers.
  function derive(premises, goal, opts = {}) {
    premises.forEach(validateProp);
    validateProp(goal);
    const maxLines = opts.maxLines || 400;
    const sizeCap = Math.max(...premises.map(propNodes), propNodes(goal)) + (opts.slack || 8);

    const goalCanon = canonProp(goal);
    const goalKey = printProposition(goalCanon);

    const lines = [];
    const seen = new Map(); // key → line index
    const push = (prop, rule, parents) => {
      const key = printProposition(prop);
      if (seen.has(key)) return null;
      if (propNodes(prop) > sizeCap) return null;
      const line = { prop, key, rule, parents };
      seen.set(key, lines.length);
      lines.push(line);
      return line;
    };

    for (const p of premises) push(canonProp(p), 'premise', []);
    // Tautology lines for every term the argument mentions.
    const tautTerms = new Map();
    for (const p of [...premises, goal]) {
      for (const occ of occurrences(canonProp(p))) tautTerms.set(termKey(occ.term), occ.term);
    }
    for (const t of tautTerms.values()) push(tautology(t), 'It', []);

    if (seen.has(goalKey)) return extract(lines, seen.get(goalKey));

    for (let i = 0; i < lines.length && lines.length < maxLines; i++) {
      const li = lines[i];
      const unary = [
        [obverse(li.prop), 'IN'],
        [contrapositive(li.prop), 'Contrap'],
        ...applySimp(li.prop).map((p) => [p, 'Simp']),
      ];
      for (const [p, rule] of unary) {
        if (p && push(p, rule, [i]) && printProposition(p) === goalKey) {
          return extract(lines, lines.length - 1);
        }
      }
      for (let j = 0; j < i && lines.length < maxLines; j++) {
        const lj = lines[j];
        const binary = [
          ...applyDON(li.prop, lj.prop).map((p) => [p, 'DON', [i, j]]),
          ...applyDON(lj.prop, li.prop).map((p) => [p, 'DON', [j, i]]),
          ...applyAdd(li.prop, lj.prop).map((p) => [p, 'Add', [i, j]]),
        ];
        for (const [p, rule, parents] of binary) {
          if (push(p, rule, parents) && printProposition(p) === goalKey) {
            return extract(lines, lines.length - 1);
          }
        }
      }
    }
    return { found: false, lines: [] };
  }

  // Prune to the goal's ancestry and renumber.
  function extract(lines, goalIdx) {
    const keep = new Set();
    (function mark(i) {
      if (keep.has(i)) return;
      keep.add(i);
      lines[i].parents.forEach(mark);
    })(goalIdx);
    const order = [...keep].sort((a, b) => a - b);
    const renum = new Map(order.map((idx, n) => [idx, n + 1]));
    return {
      found: true,
      lines: order.map((idx) => ({
        n: renum.get(idx),
        prop: lines[idx].prop,
        text: lines[idx].key,
        rule: lines[idx].rule,
        parents: lines[idx].parents.map((p) => renum.get(p)),
      })),
    };
  }

  // ── The inconsistency decision for the atomic-categorical fragment ─────
  //
  // Scope: every side of every proposition is an atom under zero or more
  // negations. On this fragment the decision is COMPLETE (fuzz-verified
  // against the finite-model oracle):
  //
  //   - universals (subject − or wild) become literal implications
  //     (−S+P gives S→P and ¬P→¬S);
  //   - particulars (subject + or wild) become "points" — individuals with
  //     two known literals; a wild statement contributes both readings,
  //     which is exactly what wild quantity means on a singleton;
  //   - every singular term seeds a point of its own (names denote);
  //   - points close under the implications; points sharing a positive
  //     singular literal are the same individual and merge; the set is
  //     inconsistent iff some point ends up with a literal and its negation.
  //
  // No existential import: general terms may be empty (universals alone
  // never clash), and the model built from consistent points witnesses
  // consistency directly.
  //
  // The zero-sum cancellation of P/Z is reported as a certificate when one
  // exists — it is the course's display form of the same fact — but the
  // verdict rests on the closure, which also covers the vacuous-subject
  // corners where nothing cancels term by term.

  function coreLit(term, negations = 0) {
    if (term.type === 'neg') return coreLit(term.term, negations + 1);
    if (term.type !== 'atom') return null;
    return { name: term.name, singular: term.singular, pol: negations % 2 === 0 };
  }
  const litKey = (l) => `${l.pol ? '+' : '-'}${l.name}${l.singular ? '*' : ''}`;
  const negKey = (k) => (k[0] === '+' ? '-' : '+') + k.slice(1);

  const isAtomicProp = (p) =>
    coreLit(canonTerm(p.subject.term)) !== null && coreLit(canonTerm(p.predicate.term)) !== null;
  const isAtomicCategorical = (props) => props.every(isAtomicProp);

  // Inconsistency check for an atomic-categorical set. Returns null when
  // consistent, else a certificate: the clashing point's literals, plus the
  // classic cancellation display when one exists.
  function checkInconsistent(props) {
    props.forEach(validateProp);
    if (!isAtomicCategorical(props)) {
      throw new EngineError('the inconsistency check requires an atomic-categorical set');
    }
    const canon = props.map(canonProp);

    const implications = []; // {from, to} over literal keys
    const points = [];       // Sets of literal keys
    const singulars = new Set();
    for (const p of canon) {
      const s = coreLit(canonTerm(p.subject.term));
      let q = coreLit(canonTerm(p.predicate.term));
      if (p.predicate.sign === '-') q = { ...q, pol: !q.pol };
      const sK = litKey(s), qK = litKey(q);
      const wild = p.subject.sign === '±';
      if (p.subject.sign === '-' || wild) {
        implications.push({ from: sK, to: qK }, { from: negKey(qK), to: negKey(sK) });
      }
      if (p.subject.sign === '+' || wild) points.push(new Set([sK, qK]));
      for (const occ of occurrences(p)) {
        if (occ.term.type === 'atom' && occ.term.singular) singulars.add(occ.term.name);
      }
    }
    for (const name of singulars) points.push(new Set([`+${name}*`]));

    const close = (set) => {
      let grew = true;
      while (grew) {
        grew = false;
        for (const { from, to } of implications) {
          if (set.has(from) && !set.has(to)) { set.add(to); grew = true; }
        }
      }
    };
    // Close, merge points that share a positive singular literal, repeat.
    let changed = true;
    while (changed) {
      changed = false;
      points.forEach(close);
      outer:
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const shared = [...points[i]].some((k) => k[0] === '+' && k.endsWith('*') && points[j].has(k));
          if (shared) {
            for (const k of points[j]) points[i].add(k);
            points.splice(j, 1);
            changed = true;
            break outer;
          }
        }
      }
    }
    for (const point of points) {
      const clash = [...point].find((k) => point.has(negKey(k)));
      if (clash) {
        return {
          point: [...point],
          clash: [clash, negKey(clash)],
          cancellation: findCancellation(canon),
        };
      }
    }
    return null;
  }

  // The classic P/Z display: one particular plus re-used universals summing
  // to zero, sign multiplication running through term negation. Wild
  // subjects try both readings. Returns { particular, universals: [{prop,
  // times}] } or null (the closure verdict stands either way).
  function zOccurrences(p) {
    const out = [];
    const flat = (t, sign) => {
      if (t.type === 'neg') flat(t.term, -sign);
      else out.push({ key: termKeyRaw(t), sign });
    };
    flat(p.subject.term, p.subject.sign === '-' ? -1 : 1);
    flat(p.predicate.term, p.predicate.sign === '-' ? -1 : 1);
    return out;
  }

  function findCancellation(canonProps) {
    const readings = canonProps.map((p) =>
      p.subject.sign === '±'
        ? [Prop(ST('+', p.subject.term), p.predicate), Prop(ST('-', p.subject.term), p.predicate)]
        : [p]);
    const tryResolved = (resolved) => {
      const particulars = resolved.filter((p) => p.subject.sign === '+');
      const universals = resolved.filter((p) => p.subject.sign === '-');
      for (const particular of particulars) {
        const total = new Map();
        const bump = (occs, k) => {
          for (const { key, sign } of occs) total.set(key, (total.get(key) || 0) + sign * k);
        };
        bump(zOccurrences(particular), 1);
        const uOccs = universals.map(zOccurrences);
        const used = new Array(universals.length).fill(0);
        const dfs = (i) => {
          if (i === universals.length) return [...total.values()].every((v) => v === 0);
          for (let k = 0; k <= 3; k++) {
            if (k > 0) bump(uOccs[i], 1);
            used[i] = k;
            if (dfs(i + 1)) return true;
          }
          bump(uOccs[i], -3);
          used[i] = 0;
          return false;
        };
        if (dfs(0)) {
          return {
            particular,
            universals: universals.map((u, i) => ({ prop: u, times: used[i] })).filter((u) => u.times > 0),
          };
        }
      }
      return null;
    };
    // Wild readings multiply; cap the enumeration and fall back to the
    // all-particular reading (certificates are best-effort).
    const combos = readings.reduce((n, r) => n * r.length, 1);
    if (combos > 256) return tryResolved(canonProps.map((r, i) => readings[i][0]));
    const walk = (i, acc) => {
      if (i === readings.length) return tryResolved(acc);
      for (const r of readings[i]) {
        const found = walk(i + 1, acc.concat([r]));
        if (found) return found;
      }
      return null;
    };
    return walk(0, []);
  }

  // ── The argument checker ──────────────────────────────────────────────
  //
  // Atomic-categorical arguments get the complete verdict via the
  // counterclaim test (Sommers' REGAL, decided by the closure). Everything
  // else — relational complexes, compound or propositional term cores —
  // gets what direct derivation can establish: valid / contradicted /
  // unknown (D3's indirect proofs extend the reach).
  function checkArgument(premises, conclusion, opts = {}) {
    premises.forEach(validateProp);
    validateProp(conclusion);
    const counterclaim = [...premises, contradictory(conclusion)];
    if (isAtomicCategorical(counterclaim)) {
      const cert = checkInconsistent(counterclaim);
      return cert
        ? { verdict: 'valid', method: 'PZ', certificate: cert }
        : { verdict: 'invalid', method: 'PZ' };
    }
    const proof = derive(premises, conclusion, opts);
    if (proof.found) return { verdict: 'valid', method: 'derivation', proof };
    const refutation = derive(premises, contradictory(conclusion), opts);
    if (refutation.found) return { verdict: 'contradicted', method: 'derivation', proof: refutation };
    return { verdict: 'unknown', method: 'derivation' };
  }

  return {
    Atom, Neg, Compound, Rel, PropTerm, ST, Prop,
    termEq, propEq, stEq, ParseError, tokenize,
    parseProposition, parseTerm, parseSignedTerm,
    printTerm, printProposition, printSignedTerm: printST, isBareName,
    // D2 — inference core
    EngineError, validateProp, canonTerm, canonProp, propKey, termKey, propEqUpTo,
    contradictory, obverse, contrapositive, tautology,
    occurrences, applyDON, applySimp, applyAdd,
    derive, checkInconsistent, checkArgument,
  };
});
