// tfl.js — TFL Lab core engine (pure logic, no DOM). D1: parser + printer;
// D2: inference core; D3: deep relational layer (passive transformation,
// proterms, indirect proof). Loadable as a browser script (window.TFL) or
// via require() in node.
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
  // 'valid' (traced direct derivation or indirect proof found),
  // 'contradicted' (the conclusion's contradictory is derivable), or
  // 'unknown'.

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
          if (o.sign === '±' && !isFixedRef(o.term)) {
            throw new EngineError('wild quantity (±) requires a singular term or proterm');
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
    if (p.subject.sign === '±' && !isFixedRef(p.subject.term)) {
      throw new EngineError('wild quantity (±) requires a singular or proterm subject');
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

  // A proterm (D3, Course 2 L4): an atom whose name ends in a prime. Its
  // reference is fixed by an antecedent, so it earns the same wild-quantity
  // treatment as a singular term — the all/some distinction collapses on
  // fixed reference. "Fixed reference" is the union of the two.
  const isProtermName = (name) => name.endsWith("'");
  const isFixedRef = (t) => t.type === 'atom' && (t.singular || isProtermName(t.name));

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
      case 'rel': {
        const objects = t.objects.map((o) => {
          const c = canonTerm(o.term);
          return ST(isFixedRef(c) ? '±' : o.sign, c);
        });
        let head = canonTerm(t.head);
        if (head.type === 'atom') {
          // Identity pairing subscripts (Lov₁₂ on a 2-participant complex)
          // say nothing — the bare head is the canonical spelling.
          const { base, roles } = headRoles(head.name, objects.length + 1);
          const name = makeHeadName(base, roles);
          if (name !== head.name) head = Atom(name, head.singular);
        }
        return Rel(head, objects);
      }
      case 'propterm':
        return PropTerm(t.inner.type === 'prop' ? canonProp(t.inner) : t.inner);
    }
  }

  function canonProp(p) {
    const sTerm = canonTerm(p.subject.term);
    const qTerm = canonTerm(p.predicate.term);
    const sSign = isFixedRef(sTerm) ? '±' : p.subject.sign;
    const qSign = p.predicate.sign;
    // Conversion (Com): I-forms (+,+) and E-forms (−,−) commute; a wild
    // fixed-reference subject (singular or proterm) joins in via whichever
    // of its readings matches (±s*+P ⊣⊢ +P+s*, and ±s*−P ⊣⊢ −P−s*, sound
    // on a singleton).
    const iLike = (sSign === '+' || sSign === '±') && qSign === '+';
    const eLike = (sSign === '-' || sSign === '±') && qSign === '-';
    if ((iLike || eLike) && termKeyRaw(qTerm) < termKeyRaw(sTerm)) {
      const base = iLike ? '+' : '-';
      return Prop(ST(isFixedRef(qTerm) ? '±' : base, qTerm), ST(base, sTerm));
    }
    // An un-swapped commutable side still normalizes its subject sign.
    if (iLike || eLike) {
      return Prop(ST(isFixedRef(sTerm) ? '±' : (iLike ? '+' : '-'), sTerm), ST(qSign, qTerm));
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

  // ════════════════════════════════════════════════════════════════════════
  // D3 — Deep relational layer: the passive transformation with Course 2
  // L3's symmetry guard, proterms (Course 2 L4), and the indirect-proof
  // procedure (Course 3 L3).

  // ── Pairing subscripts on relation heads ──────────────────────────────
  //
  // The courses' passive keeps the relation symbol and changes the English
  // gloss ("teaches" → "is taught by") — sound reading-to-reading, but a
  // formula must carry its roles itself. The courses' own device is the
  // pairing subscript (Course 2 L4's S₁₂): a trailing run of subscript
  // digits on the head, one per participant in formula order (subject
  // first, then objects), naming the relation slot each participant fills.
  // A bare head is the identity pairing; a run that isn't a permutation of
  // 1..n (or has the wrong length) is not pairing notation and stays part
  // of the name.

  function headRoles(name, arity) {
    const m = /^(.+?)([₀₁₂₃₄₅₆₇₈₉]+)$/u.exec(name);
    if (m && m[2].length === arity) {
      const roles = [...m[2]].map((c) => SUBSCRIPTS.indexOf(c));
      const sorted = [...roles].sort((a, b) => a - b);
      if (sorted.every((r, i) => r === i + 1)) return { base: m[1], roles };
    }
    return { base: name, roles: Array.from({ length: arity }, (_, i) => i + 1) };
  }

  const makeHeadName = (base, roles) =>
    roles.every((r, i) => r === i + 1)
      ? base
      : base + roles.map((r) => SUBSCRIPTS[r]).join('');

  // ── The passive transformation (Course 2 L3) ──────────────────────────
  //
  // Swap the subject with one of the relational complex's objects; signs
  // travel with their terms; the head keeps the relation but records the
  // participant permutation in pairing subscripts (roles are carried by
  // the subscripts, scope by subject position). The symmetry guard says
  // when the swap preserves logical content: every pair of participants
  // whose relative scope order changes must share a quantity sign or have
  // a fixed-reference member (singular/proterm ±) — ∀∀ and ∃∃ commute,
  // fixed reference has no scope; a −/+ crossing is the ∀∃/∃∀ trap.

  const slotQuantity = (st) => (isFixedRef(st.term) ? '±' : st.sign);
  const scopeCommutes = (a, b) => a === b || a === '±' || b === '±';

  // A proposition and, for I- and E-forms, its converse — the two
  // orientations conversion treats as the same statement.
  function orientations(p) {
    const sSign = slotQuantity(p.subject), qSign = p.predicate.sign;
    const iLike = (sSign === '+' || sSign === '±') && qSign === '+';
    const eLike = (sSign === '-' || sSign === '±') && qSign === '-';
    if (!iLike && !eLike) return [p];
    const base = iLike ? '+' : '-';
    return [p, Prop(ST(isFixedRef(p.predicate.term) ? '±' : base, p.predicate.term),
                    ST(base, p.subject.term))];
  }

  // All passives of a proposition (each object slot of a top-level
  // relational predicate, in either orientation), tagged with the
  // symmetry-guard verdict. Only `equivalent: true` results are inference-
  // grade; the rest are the scope traps.
  function passives(p) {
    const out = [];
    const seen = new Set();
    for (const q of orientations(p)) {
      if (q.predicate.sign !== '+' || q.predicate.term.type !== 'rel') continue;
      const r = q.predicate.term;
      const n = r.objects.length + 1;
      if (r.head.type !== 'atom' || n > 9) continue;
      const { base, roles } = headRoles(r.head.name, n);
      const parts = [slotQuantity(q.subject), ...r.objects.map(slotQuantity)];
      for (let k = 1; k < n; k++) {
        // Swapping participants 0 and k reorders 0 and k against each
        // other and both against everything strictly between them.
        let equivalent = scopeCommutes(parts[0], parts[k]);
        for (let i = 1; i < k && equivalent; i++) {
          equivalent = scopeCommutes(parts[0], parts[i]) && scopeCommutes(parts[i], parts[k]);
        }
        const objects = r.objects.map((o) => ST(o.sign, o.term));
        const newSubject = ST(objects[k - 1].sign, objects[k - 1].term);
        objects[k - 1] = ST(q.subject.sign, q.subject.term);
        const roles2 = roles.slice();
        [roles2[0], roles2[k]] = [roles2[k], roles2[0]];
        const head = Atom(makeHeadName(base, roles2), r.head.singular);
        const prop = Prop(newSubject, ST('+', Rel(head, objects)));
        const key = propKey(prop);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ prop, equivalent, swapped: k });
      }
    }
    return out;
  }

  // ── Pronominalization (Course 3 L3) ───────────────────────────────────
  //
  // A particular statement hands out witnesses; rewrite it with fresh
  // proterms fixing them, plus one anchor ±T'+T per witness. Witnesses are
  // the general atoms the statement's existential force reaches: a '+'
  // general-atom subject, and — through a '+' quality — atoms at '+'
  // object slots of relational complexes, nested rels included. Universal
  // slots, negations, heads and bracket interiors hand out nothing;
  // singulars and proterms need no introduction. Universal statements
  // (subject '−') cannot be pronominalized at all — they assert no
  // witness. Returns { prop, anchors } or null; NOT an entailment (it
  // introduces names — Skolemization), so it lives in indirect proofs
  // only, never in direct derivation.
  function pronominalize(p, used = new Set()) {
    validateProp(p);
    collectNames(p, used);
    const attempt = (q) => {
      if (q.subject.sign === '-') return null;
      const anchors = [];
      const names = [];
      const fresh = (base) => {
        let name = base + "'";
        while (used.has(name) || names.includes(name)) name += "'";
        names.push(name);
        return name;
      };
      const isWitness = (t) => t.type === 'atom' && !t.singular && !isProtermName(t.name);
      const mark = (t) => {
        const pro = Atom(fresh(t.name));
        anchors.push(Prop(ST('±', pro), ST('+', t)));
        return pro;
      };
      const walkRel = (t) => Rel(t.head, t.objects.map((o) => {
        if (o.sign !== '+' || o.level !== 0) return o;
        if (isWitness(o.term)) return ST('±', mark(o.term));
        if (o.term.type === 'rel') return ST('+', walkRel(o.term));
        return o;
      }));
      let subject = q.subject;
      if (subject.sign === '+' && isWitness(subject.term)) {
        subject = ST('±', mark(subject.term));
      } else if (subject.sign === '+' && subject.term.type === 'rel') {
        subject = ST('+', walkRel(subject.term));
      }
      let predicate = q.predicate;
      if (predicate.sign === '+' && predicate.term.type === 'rel') {
        predicate = ST('+', walkRel(predicate.term));
      }
      return anchors.length ? { prop: Prop(subject, predicate), anchors, names } : null;
    };
    // Conversion may have hidden the richer orientation (canonical I-forms
    // can put the complex in subject position); take the one that fixes
    // the most witnesses.
    const results = orientations(p).map(attempt).filter(Boolean);
    if (results.length === 0) return null;
    const best = results.reduce((a, b) => (b.anchors.length > a.anchors.length ? b : a));
    best.names.forEach((n) => used.add(n));
    return { prop: best.prop, anchors: best.anchors };
  }

  function collectNames(p, set) {
    const walk = (t) => {
      switch (t.type) {
        case 'atom': set.add(t.name); return;
        case 'neg': return walk(t.term);
        case 'compound': return t.elements.forEach((e) => walk(e.term));
        case 'rel': walk(t.head); return t.objects.forEach((o) => walk(o.term));
        case 'propterm':
          if (t.inner.type === 'prop') { walk(t.inner.subject.term); walk(t.inner.predicate.term); }
          else walk(t.inner);
      }
    };
    walk(p.subject.term);
    walk(p.predicate.term);
  }

  // ── Traced derivation search ──────────────────────────────────────────

  // Forward-chaining saturation, fuel-bounded and shared by direct and
  // indirect proof search. `setup(push)` seeds the initial lines (push
  // returns the line's index, existing lines deduplicating); `onNewLine`
  // inspects each genuinely new line and returns a non-null hit to stop.
  // Rules applied: IN, Contrap, Simp, guarded Pass (unary); DON, Add
  // (binary). Everything pushed must already be canonical.
  function saturate(opts, setup, onNewLine) {
    const maxLines = opts.maxLines || 400;
    const lines = [];
    const seen = new Map(); // key → line index
    let hit = null;
    const push = (prop, rule, parents) => {
      const key = printProposition(prop);
      if (seen.has(key)) return seen.get(key);
      if (propNodes(prop) > opts.sizeCap) return null;
      const idx = lines.length;
      seen.set(key, idx);
      lines.push({ prop, key, rule, parents });
      if (!hit) hit = onNewLine(idx, lines[idx], seen);
      return idx;
    };
    setup(push);
    for (let i = 0; !hit && i < lines.length && lines.length < maxLines; i++) {
      const li = lines[i];
      const unary = [
        [obverse(li.prop), 'IN'],
        [contrapositive(li.prop), 'Contrap'],
        ...applySimp(li.prop).map((p) => [p, 'Simp']),
        ...passives(li.prop).filter((r) => r.equivalent)
                            .map((r) => [canonProp(r.prop), 'Pass']),
      ];
      for (const [p, rule] of unary) {
        if (!p) continue;
        push(p, rule, [i]);
        if (hit) break;
      }
      for (let j = 0; !hit && j < i && lines.length < maxLines; j++) {
        const lj = lines[j];
        const binary = [
          ...applyDON(li.prop, lj.prop).map((p) => [p, 'DON', [i, j]]),
          ...applyDON(lj.prop, li.prop).map((p) => [p, 'DON', [j, i]]),
          ...applyAdd(li.prop, lj.prop).map((p) => [p, 'Add', [i, j]]),
        ];
        for (const [p, rule, parents] of binary) {
          push(p, rule, parents);
          if (hit) break;
        }
      }
    }
    return { lines, hit };
  }

  // Tautology lines (It) for every term the argument mentions.
  function mentionedTerms(props) {
    const map = new Map();
    for (const p of props) {
      for (const occ of occurrences(canonProp(p))) map.set(termKey(occ.term), occ.term);
    }
    return map.values();
  }

  // Direct derivation of a goal from premises. Returns the goal's pruned
  // ancestry: lines of { n, prop, text, rule, parents } with 1-based numbers.
  function derive(premises, goal, opts = {}) {
    premises.forEach(validateProp);
    validateProp(goal);
    const sizeCap = Math.max(...premises.map(propNodes), propNodes(goal)) + (opts.slack || 8);
    const goalKey = printProposition(canonProp(goal));
    const { lines, hit } = saturate(
      { maxLines: opts.maxLines, sizeCap },
      (push) => {
        for (const p of premises) push(canonProp(p), 'premise', []);
        for (const t of mentionedTerms([...premises, goal])) push(tautology(t), 'It', []);
      },
      (idx, line) => (line.key === goalKey ? { roots: [idx] } : null));
    return hit ? extract(lines, hit.roots) : { found: false, lines: [] };
  }

  // ── Indirect proof (Course 3 L3) ──────────────────────────────────────
  //
  // Assume the counterclaim — the premises plus the contradictory of the
  // conclusion — pronominalize its particular statements (fresh proterms +
  // anchors), and saturate until some line's contradictory is already on
  // the board: a fixed witness asserted and denied the same thing.
  // Success refutes the counterclaim, so by PV the argument is valid.
  // Sound by Skolemization (pronominalization preserves satisfiability;
  // every other rule is truth-preserving), which is why pronominalization
  // happens only here, at setup — it is not an entailment step.
  function indirectProof(premises, conclusion, opts = {}) {
    premises.forEach(validateProp);
    validateProp(conclusion);
    const cc = [...premises, contradictory(conclusion)];
    const sizeCap = Math.max(...cc.map(propNodes)) + (opts.slack || 8);
    const used = new Set();
    cc.forEach((p) => collectNames(p, used));
    const { lines, hit } = saturate(
      { maxLines: opts.maxLines, sizeCap },
      (push) => {
        const idxs = cc.map((p, i) =>
          push(canonProp(p), i < premises.length ? 'premise' : 'counterclaim', []));
        cc.forEach((p, i) => {
          const pron = pronominalize(p, used);
          if (!pron) return;
          push(canonProp(pron.prop), 'Pron', [idxs[i]]);
          for (const a of pron.anchors) push(canonProp(a), 'Anchor', [idxs[i]]);
        });
        for (const t of mentionedTerms(cc)) push(tautology(t), 'It', []);
      },
      (idx, line, seen) => {
        const ck = printProposition(contradictory(line.prop));
        const other = seen.get(ck);
        return other !== undefined && other !== idx ? { roots: [other, idx] } : null;
      });
    if (!hit) return { found: false, lines: [] };
    return extract(lines, hit.roots,
      { text: '⊥', rule: 'contradiction', parents: hit.roots });
  }

  // Prune to the given roots' ancestry and renumber; `closing` appends a
  // synthetic final line (the ⊥ of an indirect proof).
  function extract(lines, roots, closing) {
    const keep = new Set();
    const mark = (i) => {
      if (keep.has(i)) return;
      keep.add(i);
      lines[i].parents.forEach(mark);
    };
    roots.forEach(mark);
    const order = [...keep].sort((a, b) => a - b);
    const renum = new Map(order.map((idx, n) => [idx, n + 1]));
    const out = order.map((idx) => ({
      n: renum.get(idx),
      prop: lines[idx].prop,
      text: lines[idx].key,
      rule: lines[idx].rule,
      parents: lines[idx].parents.map((p) => renum.get(p)),
    }));
    if (closing) {
      out.push({
        n: out.length + 1,
        prop: null,
        text: closing.text,
        rule: closing.rule,
        parents: closing.parents.map((p) => renum.get(p)),
      });
    }
    return { found: true, lines: out };
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
  //   - every singular term or proterm seeds a point of its own (names and
  //     fixed references denote);
  //   - each point must satisfy the implications as a 2-SAT instance —
  //     genuine case splits included, not just unit propagation: the
  //     closure alone misses forced literals like B in {B→¬B, ¬B→¬A,
  //     ¬A→B} (either way the point is B — the D3 fuzzer caught the
  //     closure-only version);
  //   - a point forced (2-SAT backbone) to carry a positive fixed-reference
  //     literal is that named individual: points sharing one merge; the set
  //     is inconsistent iff some point's 2-SAT instance is unsatisfiable.
  //
  // No existential import anywhere, the world included: general terms may
  // be empty, and with no particular and no name there is no individual at
  // all, so universals alone never clash. A consistent point assignment
  // witnesses consistency directly.
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
        if (isFixedRef(occ.term)) singulars.add(litKey({ ...occ.term, pol: true }));
      }
    }
    for (const key of singulars) points.push(new Set([key]));

    // Is `units` + the implications satisfiable? Unit propagation plus a
    // case split — completeness needs the splits (see the banner comment).
    const sat = (units) => {
      const assign = new Map(); // var (key minus sign) → bool
      const queue = [...units];
      while (queue.length) {
        const k = queue.pop();
        const v = k.slice(1), pol = k[0] === '+';
        if (assign.has(v)) {
          if (assign.get(v) !== pol) return false;
          continue;
        }
        assign.set(v, pol);
        for (const { from, to } of implications) {
          if (from === k) queue.push(to);
          if (to === negKey(k)) queue.push(negKey(from));
        }
      }
      for (const { from } of implications) {
        const v = from.slice(1);
        if (assign.has(v)) continue;
        return sat([...unitsOf(assign), from]) || sat([...unitsOf(assign), negKey(from)]);
      }
      return true;
    };
    const unitsOf = (assign) => [...assign].map(([v, pol]) => (pol ? '+' : '-') + v);

    // Fixpoint: a point forced to carry a positive fixed-reference literal
    // (2-SAT backbone) is that named individual — make the literal an
    // explicit unit, then merge points sharing one.
    const fixedLits = [...singulars];
    let changed = true;
    while (changed) {
      changed = false;
      for (const point of points) {
        for (const L of fixedLits) {
          if (!point.has(L) && !sat([...point, negKey(L)])) {
            point.add(L);
            changed = true;
          }
        }
      }
      outer:
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const shared = [...points[i]].some((k) =>
            k[0] === '+' && (k.endsWith('*') || isProtermName(k)) && points[j].has(k));
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
      if (!sat([...point])) {
        const clash = [...point].find((k) => point.has(negKey(k)));
        return {
          point: [...point],
          clash: clash ? [clash, negKey(clash)] : null,
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
  // gets what proof search can establish: valid (direct derivation, then
  // indirect proof) / contradicted / unknown.
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
    const indirect = indirectProof(premises, conclusion, opts);
    if (indirect.found) return { verdict: 'valid', method: 'indirect', proof: indirect };
    const refutation = derive(premises, contradictory(conclusion), opts);
    if (refutation.found) return { verdict: 'contradicted', method: 'derivation', proof: refutation };
    const indirectRef = indirectProof(premises, contradictory(conclusion), opts);
    if (indirectRef.found) return { verdict: 'contradicted', method: 'indirect', proof: indirectRef };
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
    // D3 — deep relational layer
    isProtermName, isFixedRef, headRoles,
    passives, pronominalize, indirectProof,
  };
});
