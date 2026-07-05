// lab.js — TFL Lab UI (D6). One codebase, two surfaces:
//   • a λ-Lab-style slide-over panel on the TFL course pages
//     (needs #tfl-lab-toggle + #tfl-lab in the page), and
//   • the standalone full page at term-functor-logic/lab/
//     (needs #tfl-lab-page).
// Requires tfl.js (window.TFL). A program is a fact base (one proposition
// per line, -- comments); the query line answers "what is <term>?",
// three-way "? <proposition>", and the database-independent equivalence
// queries "?= <statement>" / "?= A , B". Everything the D1–D5 engine can
// certify — derivations, refutations, consistency, the Aristotelian bundle
// — is surfaced here.

(function () {
  'use strict';

  const T = window.TFL;
  if (!T) return;

  const panelRoot = document.getElementById('tfl-lab');
  const toggle    = document.getElementById('tfl-lab-toggle');
  const pageRoot  = document.getElementById('tfl-lab-page');
  const host      = pageRoot || panelRoot;
  if (!host) return;
  const isPage = !!pageRoot;

  const SRC_KEY   = 'tfl-lab-src:' + location.pathname;
  const QRY_KEY   = 'tfl-lab-qry:' + location.pathname;
  const OPEN_KEY  = 'tfl-lab-open';

  // The paper's Socrates/Fido program (Castro-Manzano et al. 2018 §6), in
  // course notation — the lab's opening fact base.
  const SEED_SRC =
    '±Socrates*+Man    -- Socrates is a man\n' +
    '±Fido*+Dog        -- Fido is a dog\n' +
    '−Man+Animal       -- every man is an animal\n' +
    '−Dog+Animal       -- every dog is an animal\n' +
    '−Man+Mortal       -- every man is mortal';
  const SEED_QRY = '? ±Socrates*+Mortal';

  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) Object.assign(el, attrs);
    for (const child of children) {
      if (child == null) continue;
      el.append(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return el;
  }
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  // ── Skeleton ────────────────────────────────────────────────────────────

  const editor = h('textarea', {
    className: 'tfl-editor lab-editor',
    spellcheck: false,
    placeholder: '−Man+Animal   -- every man is an animal',
  });
  editor.value = store.get(SRC_KEY) ?? SEED_SRC;

  const queryInput = h('input', {
    className: 'tfl-query',
    type: 'text',
    spellcheck: false,
    placeholder: '? ±Socrates*+Mortal   ·   ? Socrates*   ·   ?= −S+P',
  });
  queryInput.value = store.get(QRY_KEY) ?? SEED_QRY;

  const askBtn   = h('button', { className: 'tfl-ask lab-run' }, 'Ask ▸');
  const bannerEl = h('div', { className: 'tfl-banner' });
  const outputEl = h('div', { className: 'tfl-output lab-output' });

  // ── Input palette ─────────────────────────────────────────────────────
  // Insert a glyph at the caret of whichever field was last focused.

  let activeField = editor;
  for (const f of [editor, queryInput]) {
    f.addEventListener('focus', () => { activeField = f; });
  }
  function insertGlyph(g) {
    const f = activeField;
    const s = f.selectionStart ?? f.value.length;
    const e = f.selectionEnd ?? f.value.length;
    f.value = f.value.slice(0, s) + g + f.value.slice(e);
    f.focus();
    f.setSelectionRange(s + g.length, s + g.length);
    if (f === editor) scheduleBanner();
    persist();
  }
  const PALETTE = ['−', '+', '±', '(', ')', '*', '[', ']', "'", '″'];
  const paletteEl = h('div', { className: 'tfl-palette' },
    ...PALETTE.map((g) =>
      h('button', { className: 'tfl-key', type: 'button', title: 'insert ' + g,
        onmousedown: (ev) => { ev.preventDefault(); insertGlyph(g); } }, g)));

  // ── Examples ──────────────────────────────────────────────────────────

  const EXAMPLES = [
    ['Socrates & Fido (flagship)', SEED_SRC, '? ±Socrates*+Mortal'],
    ['What is Socrates?',          SEED_SRC, '? Socrates*'],
    ['Barbara',                    '−Man+Mortal\n−Greek+Man',        '? −Greek+Mortal'],
    ['A relational proof',         '+Boy+(Lov+Girl)\n+Girl+Rebel\n−Girl+Girl', '? +Boy+(Lov+Rebel)'],
    ['Open world (unknown)',       SEED_SRC, '? ±Fido*+Mortal'],
    ['An inconsistent base',       '+A+B\n−A+C\n−A−C',               '? +A+C'],
    ['Equivalents of −S+P',        '',                               '?= −S+P'],
    ['Decide equivalence',         '',                               '?= −Dog+Mammal , −(−Mammal)+(−Dog)'],
  ];
  const examplesSel = h('select', { className: 'tfl-examples lab-examples', title: 'Load an example' },
    h('option', { value: '' }, 'Examples…'),
    ...EXAMPLES.map(([label], i) => h('option', { value: String(i) }, label)));
  examplesSel.addEventListener('change', () => {
    if (examplesSel.value === '') return;
    const [, src, qry] = EXAMPLES[+examplesSel.value];
    load(src, qry);
    examplesSel.value = '';
  });

  // ── Import / export (.tfl) ────────────────────────────────────────────
  // FileReader keeps the file client-side; it never leaves the browser.

  const fileInput = h('input', { type: 'file', accept: '.tfl,.txt,text/plain',
    className: 'tfl-file', style: 'display:none' });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { editor.value = String(reader.result); scheduleBanner(); persist(); };
    reader.readAsText(file);
    fileInput.value = '';
  });
  const importBtn = h('button', { className: 'tfl-io', type: 'button', title: 'Load a .tfl file' },
    '↥ Import');
  importBtn.addEventListener('click', () => fileInput.click());
  const exportBtn = h('button', { className: 'tfl-io', type: 'button', title: 'Download the program' },
    '↧ Export');
  exportBtn.addEventListener('click', () => {
    const blob = new Blob([editor.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'program.tfl' });
    document.body.append(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  // ── Assemble ──────────────────────────────────────────────────────────

  const core = h('div', { className: 'tfl-lab-core' },
    h('div', { className: 'tfl-toolbar' }, examplesSel, importBtn, exportBtn),
    h('label', { className: 'tfl-label' }, 'Fact base'),
    editor,
    paletteEl,
    bannerEl,
    h('label', { className: 'tfl-label' }, 'Query'),
    h('div', { className: 'tfl-query-row' }, queryInput, askBtn),
    h('div', { className: 'lab-hint tfl-hint' },
      'Enter runs · ? asks a proposition or a term · ?= tests equivalence'),
    outputEl);

  if (isPage) {
    host.append(core);
  } else {
    const closeBtn = h('button', { className: 'lab-close', title: 'Close' }, '×');
    closeBtn.addEventListener('click', () => setOpen(false));
    host.append(
      h('div', { className: 'lab-header' },
        h('span', { className: 'lab-title' }, '∴ TFL Lab'),
        closeBtn),
      h('div', { className: 'lab-body' }, core));
  }

  // ── Open / close (panel only) ─────────────────────────────────────────

  function setOpen(open) {
    document.body.classList.toggle('lab-open', open);
    store.set(OPEN_KEY, open ? '1' : '0');
    if (open) editor.focus();
  }
  if (toggle) {
    toggle.addEventListener('click', () => setOpen(true));
    if (store.get(OPEN_KEY) === '1') setOpen(true);
  }

  // ── Persistence + banner scheduling ───────────────────────────────────

  function persist() {
    store.set(SRC_KEY, editor.value);
    store.set(QRY_KEY, queryInput.value);
  }
  let bannerTimer = null;
  function scheduleBanner() {
    if (bannerTimer) clearTimeout(bannerTimer);
    bannerTimer = setTimeout(refreshBanner, 250);
  }
  editor.addEventListener('input', () => { scheduleBanner(); persist(); });
  queryInput.addEventListener('input', persist);
  queryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); runQuery(); }
  });
  askBtn.addEventListener('click', runQuery);

  // ── Program parsing (shared by banner + query) ────────────────────────

  function currentProgram() {
    const { propositions, errors } = T.parseProgram(editor.value);
    return { props: propositions.map((p) => p.prop), errors };
  }

  // ── Consistency banner (always on) ────────────────────────────────────

  function refreshBanner() {
    bannerEl.replaceChildren();
    const { props, errors } = currentProgram();
    if (errors.length) {
      bannerEl.className = 'tfl-banner tfl-banner-error';
      for (const err of errors) {
        bannerEl.append(h('div', { className: 'tfl-banner-line' },
          `Line ${err.line}: ${err.message}`));
      }
      return;
    }
    if (props.length === 0) {
      bannerEl.className = 'tfl-banner';
      return;
    }
    let res;
    try { res = T.checkProgramConsistency(props); }
    catch (e) { bannerEl.className = 'tfl-banner'; return; }
    if (res.consistent) {
      bannerEl.className = 'tfl-banner tfl-banner-ok';
      bannerEl.append(h('span', {}, '✓ consistent',
        res.complete ? '' : ' (no contradiction found within fuel)'));
    } else {
      bannerEl.className = 'tfl-banner tfl-banner-bad';
      bannerEl.append(h('span', {}, '⚠ inconsistent fact base'));
      const proof = res.proof && res.proof.found ? res.proof : null;
      if (proof) bannerEl.append(derivToggle(proof, 'Why?'));
    }
  }

  // ── Query dispatch ────────────────────────────────────────────────────

  function runQuery() {
    persist();
    outputEl.replaceChildren();
    const { props, errors } = currentProgram();
    if (errors.length) {
      outputEl.append(note('Fix the fact-base errors above before querying — ' +
        `line ${errors[0].line}: ${errors[0].message}.`));
      return;
    }
    const raw = queryInput.value.trim();
    if (!raw) { outputEl.append(note('Type a query — e.g. ? ±Socrates*+Mortal')); return; }

    try {
      if (raw.startsWith('?=')) return runEquivalence(raw.slice(2).trim());
      const body = raw.startsWith('?') ? raw.slice(1).trim() : raw;
      // A proposition needs two signed terms; a bare term is a "what is" query.
      let prop = null, term = null, propErr = null;
      try { prop = T.parseProposition(body); }
      catch (e) {
        propErr = e;
        try { term = T.parseTerm(body); } catch (e2) { throw propErr; }
      }
      if (prop) return renderAnswer(props, prop);
      return renderTermQuery(props, term, body);
    } catch (err) {
      if (err instanceof T.ParseError) return outputEl.append(parseError(err, raw));
      throw err;
    }
  }

  // ── Rendering helpers ─────────────────────────────────────────────────

  function note(text) { return h('div', { className: 'lab-note tfl-note' }, text); }

  function propCode(prop) {
    const c = h('code', { className: 'tfl-prop' });
    c.innerHTML = T.printHtmlProposition(prop); // names escaped by the printer
    return c;
  }
  function reading(prop) { return h('span', { className: 'tfl-reading' }, T.readProp(prop)); }

  function parseError(err, source) {
    const box = h('div', { className: 'lab-error tfl-error' }, err.message);
    if (err.pos != null) {
      box.append(h('pre', { className: 'lab-caret tfl-caret' },
        `${source}\n${' '.repeat(err.pos)}^`));
    }
    return box;
  }

  // Derivation pane: numbered lines, printed proposition, rule + citations.
  function renderDeriv(proof) {
    const wrap = h('div', { className: 'tfl-deriv' });
    for (const l of proof.lines) {
      const code = h('code', { className: 'tfl-prop' });
      if (l.prop) code.innerHTML = T.printHtmlProposition(l.prop);
      else code.textContent = l.text; // ⊥
      const cite = l.parents && l.parents.length ? ' ' + l.parents.join(',') : '';
      wrap.append(h('div', { className: 'tfl-deriv-line' },
        h('span', { className: 'tfl-deriv-n' }, l.n + '.'),
        code,
        h('span', { className: 'tfl-deriv-rule' }, l.rule + cite)));
    }
    return wrap;
  }

  // A "show derivation" button that builds the pane lazily.
  function derivToggle(proof, label) {
    const btn = h('button', { className: 'tfl-steps lab-steps-btn' }, (label || 'Show derivation') + ' ▾');
    let pane = null;
    btn.addEventListener('click', () => {
      if (!pane) {
        pane = renderDeriv(proof);
        btn.after(pane);
        btn.textContent = 'Hide derivation ▴';
      } else {
        const hidden = pane.style.display === 'none';
        pane.style.display = hidden ? '' : 'none';
        btn.textContent = (hidden ? 'Hide derivation ▴' : (label || 'Show derivation') + ' ▾');
      }
    });
    return btn;
  }

  // Best available step-by-step proof of `prop` from the program.
  function bestProof(program, prop, support) {
    if (support && support.proof && support.proof.found) return support.proof;
    try { const d = T.derive(program, prop); if (d.found) return d; } catch (e) {}
    return null;
  }

  // ── ? proposition — the Aristotelian answer ───────────────────────────

  function renderAnswer(program, prop) {
    const a = T.answer(program, prop);
    const label = { yes: '✓ Yes', no: '✗ No', unknown: '? Unknown' }[a.verdict];
    outputEl.append(
      h('div', { className: 'tfl-verdict tfl-verdict-' + a.verdict }, label),
      h('div', { className: 'tfl-question' }, T.readProp(prop) + '?'));

    if (a.explanation) outputEl.append(h('div', { className: 'tfl-explain' }, a.explanation));

    const proofOf = a.verdict === 'no' ? T.contradictory(prop) : prop;
    const proof = a.verdict === 'unknown' ? null : bestProof(program, proofOf, a.support);
    if (proof) outputEl.append(derivToggle(proof));

    if (a.stronger)    outputEl.append(h('div', { className: 'tfl-extra tfl-stronger' }, '↑ ' + a.stronger.note));
    if (a.possibility) outputEl.append(h('div', { className: 'tfl-extra tfl-perhaps' }, '~ ' + a.possibility.note));
    if (a.nafGuess)    outputEl.append(h('div', { className: 'tfl-extra tfl-naf' }, '⊘ ' + a.nafGuess.note));
    if (a.suggestions && a.suggestions.length) {
      outputEl.append(h('div', { className: 'tfl-note lab-note' }, 'It would follow if you added:'));
      for (const s of a.suggestions) {
        const row = h('div', { className: 'tfl-suggest' }, propCode(s.prop),
          h('span', { className: 'tfl-suggest-note' }, s.note));
        const add = h('button', { className: 'tfl-add', type: 'button', title: 'Add to the fact base' }, '+ add');
        add.addEventListener('click', () => {
          editor.value = editor.value.replace(/\s*$/, '') + '\n' + s.text;
          scheduleBanner(); persist(); runQuery();
        });
        row.append(add);
        outputEl.append(row);
      }
    }
  }

  // ── ? term — "what is <term>?" ────────────────────────────────────────

  function renderTermQuery(program, term, source) {
    let answers;
    try { answers = T.queryTerm(program, term); }
    catch (e) {
      if (e instanceof T.ParseError) return outputEl.append(parseError(e, source));
      throw e;
    }
    outputEl.append(h('div', { className: 'tfl-question' }, 'What is ' + T.printTerm(term) + '?'));
    if (!answers.length) {
      outputEl.append(note('Nothing is known about ' + T.printTerm(term) + '.'));
      return;
    }
    for (const ans of answers) {
      outputEl.append(h('div', { className: 'tfl-answer' }, propCode(ans.prop), reading(ans.prop)));
    }
  }

  // ── ?= equivalence queries ────────────────────────────────────────────

  function runEquivalence(body) {
    const parts = splitTopComma(body);
    if (parts.length === 2) {
      const a = T.parseProposition(parts[0]);
      const b = T.parseProposition(parts[1]);
      const r = T.decideEquivalence(a, b);
      outputEl.append(
        h('div', { className: 'tfl-verdict tfl-verdict-' + (r.equivalent ? 'yes' : 'no') },
          r.equivalent ? '✓ Equivalent' : '✗ Not equivalent'),
        h('div', { className: 'tfl-answer' }, propCode(a), h('span', { className: 'tfl-reading' }, T.readProp(a))),
        h('div', { className: 'tfl-answer' }, propCode(b), h('span', { className: 'tfl-reading' }, T.readProp(b))));
      if (r.method === 'dnf') {
        outputEl.append(note(r.dnf.length
          ? 'Same truth conditions — worlds where both hold: ' + r.dnf.join('  ·  ')
          : 'Both are contradictions — true in no world.'));
      } else if (r.method === 'rewrite' && r.equivalent) {
        outputEl.append(note('By the immediate rules: ' + r.path.join(' then ') + '.'));
      } else {
        outputEl.append(note('No immediate-rule rewrite connects them.'));
      }
      return;
    }
    const prop = T.parseProposition(body);
    const eqs = T.equivalents(prop);
    outputEl.append(h('div', { className: 'tfl-question' }, 'Equivalent to ' + T.readProp(prop) + ':'));
    for (const e of eqs) {
      outputEl.append(h('div', { className: 'tfl-answer' },
        propCode(e.prop),
        h('span', { className: 'tfl-reading' }, e.reading),
        h('span', { className: 'tfl-eq-rule' }, e.rule === 'given' ? 'given' : e.rule)));
    }
    const sq = squareOf(prop);
    if (sq) renderSquare(sq);
  }

  // Split on a top-level comma only (quoted terms may contain commas).
  function splitTopComma(s) {
    let depth = 0, quoted = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '"') quoted = !quoted;
      else if (!quoted && c === '(') depth++;
      else if (!quoted && c === ')') depth--;
      else if (!quoted && depth === 0 && c === ',') {
        return [s.slice(0, i).trim(), s.slice(i + 1).trim()];
      }
    }
    return [s.trim()];
  }

  // ── Square of opposition ──────────────────────────────────────────────
  // Only for a plain categorical: subject & predicate are (possibly negated)
  // general terms, subject quantity universal or particular.

  function squareOf(prop) {
    const s = prop.subject, p = prop.predicate;
    const plainTerm = (t) => t.type === 'atom' ? !t.singular : (t.type === 'neg' && plainTerm(t.term));
    if (!plainTerm(s.term) || !plainTerm(p.term)) return null;
    if (s.sign !== '-' && s.sign !== '+') return null;
    const flipQ = p.sign === '+' ? '-' : '+';
    const contra = T.contradictory(prop);
    if (s.sign === '-') {
      return {
        given:        prop,
        contrary:     T.Prop(s, T.ST(flipQ, p.term)),
        subaltern:    T.Prop(T.ST('+', s.term), p),
        contradictory: contra,
        labels: { rel1: 'Contrary', rel2: 'Subaltern' },
      };
    }
    return {
      given:        prop,
      contrary:     T.Prop(s, T.ST(flipQ, p.term)),   // subcontrary
      subaltern:    T.Prop(T.ST('-', s.term), p),     // superaltern
      contradictory: contra,
      labels: { rel1: 'Subcontrary', rel2: 'Superaltern' },
    };
  }

  function renderSquare(sq) {
    const wrap = h('div', { className: 'tfl-square' });
    const cell = (label, prop) => h('div', { className: 'tfl-sq-cell' },
      h('span', { className: 'tfl-sq-label' }, label),
      propCode(prop),
      h('span', { className: 'tfl-reading' }, T.readProp(prop)));
    wrap.append(
      h('div', { className: 'tfl-sq-title' }, 'The square of opposition'),
      cell('Given', sq.given),
      cell('Contradictory', sq.contradictory),
      cell(sq.labels.rel1, sq.contrary),
      cell(sq.labels.rel2, sq.subaltern));
    outputEl.append(wrap);
  }

  // ── Loading + boot ────────────────────────────────────────────────────

  function load(src, qry) {
    if (src != null) editor.value = src;
    if (qry != null) queryInput.value = qry;
    persist();
    if (toggle) setOpen(true);
    refreshBanner();
    runQuery();
  }

  refreshBanner();
  if (isPage) runQuery();

  // Public surface for D7's lesson chips.
  window.TFLLab = { load };
})();
