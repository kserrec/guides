// lab.js — Lambda Lab panel UI.
// Requires lambda.js (window.Lambda) and the #lambda-lab / #lab-toggle
// elements present on the lambda calculus course pages.

(function () {
  'use strict';

  const L      = window.Lambda;
  const root   = document.getElementById('lambda-lab');
  const toggle = document.getElementById('lab-toggle');
  if (!L || !root || !toggle) return;

  const SRC_KEY      = 'lab-src:' + location.pathname;
  const OPEN_KEY     = 'lab-open';
  const DEFAULT_FUEL = 5000;
  const TRACE_CAP    = 200; // rendered trace lines; full traces can be huge

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

  // ── Panel skeleton ──────────────────────────────────────────────────────

  const editor = h('textarea', {
    className: 'lab-editor',
    spellcheck: false,
    placeholder: 'DOUBLE = λn.ADD n n\nDOUBLE 4',
  });
  editor.value = store.get(SRC_KEY) ?? 'ADD 2 3';

  const runBtn   = h('button', { className: 'lab-run' }, 'Run ▸');
  const outputEl = h('div', { className: 'lab-output' });
  const closeBtn = h('button', { className: 'lab-close', title: 'Close' }, '×');

  root.append(
    h('div', { className: 'lab-header' },
      h('span', { className: 'lab-title' }, 'λ Lab'),
      closeBtn),
    h('div', { className: 'lab-body' },
      editor,
      h('div', { className: 'lab-actions' },
        runBtn,
        h('span', { className: 'lab-hint' }, 'type \\ for λ · Ctrl+Enter runs')),
      outputEl)
  );

  // ── Open / close ────────────────────────────────────────────────────────

  function setOpen(open) {
    document.body.classList.toggle('lab-open', open);
    store.set(OPEN_KEY, open ? '1' : '0');
    if (open) editor.focus();
  }
  toggle.addEventListener('click', () => setOpen(true));
  closeBtn.addEventListener('click', () => setOpen(false));
  if (store.get(OPEN_KEY) === '1') setOpen(true);

  // ── Editor behavior ─────────────────────────────────────────────────────

  editor.addEventListener('input', () => {
    if (!editor.value.includes('\\')) return;
    const { selectionStart, selectionEnd } = editor;
    editor.value = editor.value.replaceAll('\\', 'λ'); // same length: cursor keeps
    editor.setSelectionRange(selectionStart, selectionEnd);
  });

  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      fuel = DEFAULT_FUEL;
      run();
    }
  });

  // ── Running ─────────────────────────────────────────────────────────────

  let fuel = DEFAULT_FUEL;

  runBtn.addEventListener('click', () => { fuel = DEFAULT_FUEL; run(); });

  function run() {
    const src = editor.value;
    store.set(SRC_KEY, src);
    let res;
    try {
      res = L.evalProgram(src, { maxSteps: fuel });
    } catch (err) {
      if (err instanceof L.ParseError || err instanceof L.ProgramError) {
        outputEl.replaceChildren(h('div', { className: 'lab-error' }, err.message));
        return;
      }
      throw err;
    }
    renderResult(res);
  }

  function codeBlock(text) {
    return h('code', { className: 'lab-code' }, text);
  }

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  function renderResult(res) {
    outputEl.replaceChildren();

    for (const w of res.warnings) {
      outputEl.append(h('div', { className: 'lab-warning' }, '⚠ ' + w));
    }

    if (res.status === 'no-expression') {
      outputEl.append(h('div', { className: 'lab-note' },
        res.definitions.length
          ? `Defined ${res.definitions.map((d) => d.name).join(', ')} — add an expression below the definitions to evaluate it.`
          : 'Nothing to evaluate yet.'));
      return;
    }

    if (res.status === 'fuel-exhausted') {
      const moreBtn = h('button', { className: 'lab-more' }, 'Keep going ×10');
      moreBtn.addEventListener('click', () => { fuel *= 10; run(); });
      outputEl.append(
        h('div', { className: 'lab-warning' },
          `No normal form after ${plural(res.deltas.length + res.steps.length, 'step')} — it may reduce forever (like Ω). `,
          moreBtn),
        h('div', { className: 'lab-note' }, 'Where it stopped:'),
        codeBlock(L.print(res.result)),
      );
      appendTraceToggle(res);
      return;
    }

    if (res.readback) {
      outputEl.append(h('div', { className: 'lab-readback' }, res.readback));
    }
    outputEl.append(
      codeBlock(L.print(res.result)),
      h('div', { className: 'lab-statusline' },
        `${plural(res.deltas.length, 'name expansion')} · ${plural(res.steps.length, 'β-step')}`),
    );
    appendTraceToggle(res);
  }

  // ── Trace (opt-in via button) ───────────────────────────────────────────

  function appendTraceToggle(res) {
    if (res.deltas.length + res.steps.length === 0) return;
    const btn = h('button', { className: 'lab-steps-btn' }, 'Show steps ▾');
    let traceEl = null;
    btn.addEventListener('click', () => {
      if (!traceEl) {
        traceEl = renderTrace(res); // built lazily; traces can be large
        outputEl.append(traceEl);
        btn.textContent = 'Hide steps ▴';
      } else {
        const hidden = traceEl.style.display === 'none';
        traceEl.style.display = hidden ? '' : 'none';
        btn.textContent = hidden ? 'Hide steps ▴' : 'Show steps ▾';
      }
    });
    outputEl.append(btn);
  }

  // Each line shows a term with the thing that fires NEXT highlighted:
  // δ lines mark the name about to expand, β lines mark the redex.
  function renderTrace(res) {
    const terms = [res.expr, ...res.deltas.map((d) => d.term), ...res.steps.map((s) => s.term)];
    const trace = h('div', { className: 'lab-trace' });
    const shown = Math.min(terms.length, TRACE_CAP);

    for (let i = 0; i < shown; i++) {
      let mark = null, badge = '=';
      if (i < res.deltas.length) {
        mark  = { name: res.deltas[i].name };
        badge = 'δ';
      } else if (i - res.deltas.length < res.steps.length) {
        mark  = { path: res.steps[i - res.deltas.length].redexPath };
        badge = 'β';
      } else if (res.status === 'fuel-exhausted') {
        badge = '…';
      }
      const code = h('code');
      code.innerHTML = L.printHtml(terms[i], mark); // escaped by printHtml
      trace.append(h('div', { className: 'lab-step' },
        h('span', { className: 'lab-step-badge' }, badge),
        code));
    }

    if (terms.length > shown) {
      trace.append(h('div', { className: 'lab-note' },
        `… ${terms.length - shown} more steps not shown`));
    }
    return trace;
  }
})();
