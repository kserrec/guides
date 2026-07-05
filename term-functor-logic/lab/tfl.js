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

  return {
    Atom, Neg, Compound, Rel, PropTerm, ST, Prop,
    termEq, propEq, stEq, ParseError, tokenize,
    parseProposition, parseTerm, parseSignedTerm,
    printTerm, printProposition, printSignedTerm: printST, isBareName,
  };
});
