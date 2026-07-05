// engine.test.js — unit tests for the course runtime (engine.js).
// Run with plain node: `node engine.test.js`.
//
// engine.js is a browser script (no module exports, DOM-dependent). We load
// it in a `vm` context with a tiny hand-rolled DOM stub — just enough of the
// element API the runtime touches — and append an export line so the top-level
// bindings (h, countCorrect, shuffledIndices, setFeedback, ExerciseHandlers)
// become reachable. The stub is intentionally minimal; it models exactly the
// surface the tested code uses (append/classList/addEventListener/
// querySelectorAll/textContent/innerHTML), no more.

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

// ── Tiny test harness (matches the lab suites' style) ───────────────────────
let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; }
  catch (e) { failed++; console.log(`✗ ${name}\n  ${e.message}`); }
}

// ── Minimal DOM stub ────────────────────────────────────────────────────────
function textNode(t) { return { nodeType: 3, textContent: String(t), childNodes: [] }; }

function makeEl(tag) {
  const el = {
    tagName: String(tag || '').toUpperCase(),
    nodeType: 1,
    childNodes: [],
    _class: '',
    _html: null,
    style: {},
    dataset: {},
    disabled: false,
    _listeners: {},
    get className() { return this._class; },
    set className(v) { this._class = String(v); },
    classList: {
      add(...cs) { const s = new Set(el._class.split(/\s+/).filter(Boolean)); cs.forEach((c) => s.add(c)); el._class = [...s].join(' '); },
      remove(...cs) { const s = new Set(el._class.split(/\s+/).filter(Boolean)); cs.forEach((c) => s.delete(c)); el._class = [...s].join(' '); },
      contains(c) { return el._class.split(/\s+/).includes(c); },
      toggle(c, force) { const on = force === undefined ? !el.classList.contains(c) : force; if (on) el.classList.add(c); else el.classList.remove(c); return on; },
    },
    append(...kids) { for (const k of kids) el.childNodes.push(typeof k === 'string' ? textNode(k) : k); },
    prepend(...kids) { for (const k of [...kids].reverse()) el.childNodes.unshift(typeof k === 'string' ? textNode(k) : k); },
    replaceChildren(...kids) { el.childNodes = []; el.append(...kids); },
    remove() {}, scrollIntoView() {},
    focus() {}, setSelectionRange() {},
    addEventListener(type, fn) { (el._listeners[type] = el._listeners[type] || []).push(fn); },
    dispatch(type, ev) { (el._listeners[type] || []).forEach((fn) => fn(ev || { preventDefault() {}, key: '' })); },
    click() { el.dispatch('click'); },
    set innerHTML(v) { el._html = String(v); el.childNodes = []; },
    get innerHTML() { return el._html; },
    set textContent(v) { el.childNodes = [textNode(v)]; },
    get textContent() {
      if (el._html != null) return '';
      return el.childNodes.map((n) => n.textContent).join('');
    },
    querySelectorAll(sel) {
      const cls = sel.replace(/^\./, '');
      const out = [];
      (function walk(n) {
        for (const c of n.childNodes) {
          if (c.nodeType !== 1) continue;
          if ((c._class || '').split(/\s+/).includes(cls)) out.push(c);
          walk(c);
        }
      })(el);
      return out;
    },
    querySelector(sel) { return el.querySelectorAll(sel)[0] || null; },
  };
  return el;
}

const _elCache = {};
const documentStub = {
  createElement: makeEl,
  createTextNode: textNode,
  getElementById: (id) => (_elCache[id] = _elCache[id] || makeEl('div')), // stable per id
  addEventListener() {}, // the DOMContentLoaded boot line — never fired here
};

// ── Load engine.js into a vm context and export its bindings ────────────────
const src = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');
const sandbox = { document: documentStub, window: { scrollTo() {} }, localStorage: {
  getItem: () => null, setItem() {}, removeItem() {},
}, Math, console, JSON };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(
  src + '\nglobalThis.__engine = { h, countCorrect, shuffledIndices, setFeedback, ExerciseHandlers, CourseApp };',
  sandbox
);
const { h, countCorrect, shuffledIndices, setFeedback, ExerciseHandlers, CourseApp } = sandbox.__engine;

// A callbacks object that counts onItemAnswered calls.
const makeCallbacks = () => { const c = { n: 0, onItemAnswered() { c.n++; } }; return c; };

// ── countCorrect ────────────────────────────────────────────────────────────

test('countCorrect: matches answers against items by index', () => {
  const items = [{ answer: 'valid' }, { answer: 'invalid' }, { answer: 'valid' }];
  assert.strictEqual(countCorrect({ 0: 'valid', 1: 'invalid', 2: 'valid' }, items), 3);
  assert.strictEqual(countCorrect({ 0: 'valid', 1: 'valid', 2: 'invalid' }, items), 1);
  assert.strictEqual(countCorrect({}, items), 0);
});

test('countCorrect: unanswered items and the reveal sentinel do not count', () => {
  const items = [{ answer: 'valid' }, { answer: 'valid' }];
  assert.strictEqual(countCorrect({ 0: 'valid' }, items), 1);            // item 1 unanswered
  assert.strictEqual(countCorrect({ 0: '__revealed__', 1: 'valid' }, items), 1);
});

test('countCorrect: numeric (multiple-choice) answers compare strictly', () => {
  const items = [{ answer: 2 }, { answer: 0 }];
  assert.strictEqual(countCorrect({ 0: 2, 1: 0 }, items), 2);
  assert.strictEqual(countCorrect({ 0: 1, 1: 0 }, items), 1);
  assert.strictEqual(countCorrect({ 0: '2' }, items), 0);               // string 2 !== number 2
});

// ── shuffledIndices ─────────────────────────────────────────────────────────

test('shuffledIndices: always a permutation of 0..n-1', () => {
  for (const n of [0, 1, 2, 3, 5, 8]) {
    for (let trial = 0; trial < 200; trial++) {
      const order = shuffledIndices(n);
      assert.strictEqual(order.length, n);
      assert.deepStrictEqual([...order].sort((a, b) => a - b), Array.from({ length: n }, (_, i) => i));
    }
  }
});

test('shuffledIndices: edge sizes', () => {
  // spread to normalise the array's prototype across the vm boundary
  assert.deepStrictEqual([...shuffledIndices(0)], []);
  assert.deepStrictEqual([...shuffledIndices(1)], [0]);
});

// ── h (hyperscript) ─────────────────────────────────────────────────────────

test('h: sets props and appends string/element children', () => {
  const el = h('div', { className: 'x' }, 'hi', h('span', null, 'yo'));
  assert.strictEqual(el.tagName, 'DIV');
  assert.strictEqual(el.className, 'x');
  assert.strictEqual(el.textContent, 'hiyo');
  assert.strictEqual(el.childNodes.length, 2);
});

test('h: null children are skipped', () => {
  const el = h('div', null, null, 'a', undefined);
  assert.strictEqual(el.textContent, 'a');
});

// ── setFeedback ─────────────────────────────────────────────────────────────

test('setFeedback: correct and incorrect render icon + explanation', () => {
  const ok = makeEl('div');
  setFeedback(ok, true, 'well done');
  assert.ok(ok.className.includes('feedback-correct') && ok.className.includes('visible'));
  assert.ok(ok.textContent.includes('✓') && ok.textContent.includes('well done'));

  const bad = makeEl('div');
  setFeedback(bad, false, 'nope');
  assert.ok(bad.className.includes('feedback-incorrect'));
  assert.ok(bad.textContent.includes('✗') && bad.textContent.includes('nope'));
});

// ── valid-or-invalid handler ────────────────────────────────────────────────

test('valid-or-invalid: scores clicks, locks the item, reports once', () => {
  const block = { items: [
    { expr: 'a', answer: 'valid', explanation: 'e0' },
    { expr: 'b', answer: 'invalid', explanation: 'e1' },
  ] };
  const exState = { answers: {} };
  const cb = makeCallbacks();
  const root = ExerciseHandlers['valid-or-invalid'].render(block, exState, cb);

  const valids = root.querySelectorAll('.btn-valid');
  const invalids = root.querySelectorAll('.btn-invalid');
  assert.strictEqual(valids.length, 2);

  valids[0].click();                    // item 0 answered "valid" — correct
  assert.strictEqual(exState.answers[0], 'valid');
  assert.ok(valids[0].disabled && invalids[0].disabled);

  invalids[0].click();                  // second click ignored (already answered)
  assert.strictEqual(exState.answers[0], 'valid');

  valids[1].click();                    // item 1 answered "valid" — wrong (answer is invalid)
  assert.strictEqual(exState.answers[1], 'valid');

  assert.strictEqual(cb.n, 2);          // onItemAnswered fired once per answered item
  assert.strictEqual(countCorrect(exState.answers, block.items), 1);
});

test('valid-or-invalid: exprHtml path does not throw', () => {
  const block = { items: [{ exprHtml: '<b>x</b>', answer: 'valid', explanation: 'e' }] };
  const exState = { answers: {} };
  const root = ExerciseHandlers['valid-or-invalid'].render(block, exState, makeCallbacks());
  root.querySelectorAll('.btn-valid')[0].click();
  assert.strictEqual(exState.answers[0], 'valid');
});

// ── multiple-choice handler ─────────────────────────────────────────────────
// The critical property: choices display shuffled, but the click is scored by
// the *authored* index, so clicking the visually-correct choice always scores
// correct regardless of where the shuffle put it.

function renderMC(item) {
  const exState = { answers: {} };
  const cb = makeCallbacks();
  const root = ExerciseHandlers['multiple-choice'].render({ items: [item] }, exState, cb);
  return { root, exState, cb };
}

test('multiple-choice: clicking the correct choice scores correct under any shuffle', () => {
  const item = { prompt: 'pick', choices: ['A', 'B', 'C', 'D'], answer: 2, choicesAreCode: false };
  for (let trial = 0; trial < 50; trial++) {
    const { root, exState, cb } = renderMC(item);
    const buttons = root.querySelectorAll('.btn-choice');
    assert.strictEqual(buttons.length, 4);
    const correctBtn = buttons.find((b) => b.textContent === item.choices[item.answer]);
    correctBtn.click();
    assert.strictEqual(exState.answers[0], 2, 'stores the authored index, not the display slot');
    assert.strictEqual(cb.n, 1);
    // exactly the answer choice is marked correct
    const marked = root.querySelectorAll('.choice-correct');
    assert.strictEqual(marked.length, 1);
    assert.strictEqual(marked[0].textContent, 'C');
  }
});

test('multiple-choice: a wrong click scores incorrect and marks both choices', () => {
  const item = { prompt: 'pick', choices: ['A', 'B', 'C'], answer: 0, choicesAreCode: false };
  const { root, exState } = renderMC(item);
  const buttons = root.querySelectorAll('.btn-choice');
  const wrongBtn = buttons.find((b) => b.textContent === 'B'); // answer is A (index 0)
  wrongBtn.click();
  assert.strictEqual(exState.answers[0], 1);
  assert.ok(wrongBtn.classList.contains('choice-wrong'));
  assert.strictEqual(root.querySelectorAll('.choice-correct')[0].textContent, 'A');
  assert.strictEqual(countCorrect(exState.answers, [item]), 0);
});

test('multiple-choice: a second click is ignored', () => {
  const item = { prompt: 'p', choices: ['A', 'B'], answer: 0, choicesAreCode: false };
  const { root, exState, cb } = renderMC(item);
  const buttons = root.querySelectorAll('.btn-choice');
  buttons.find((b) => b.textContent === 'A').click();
  buttons.find((b) => b.textContent === 'B').click();
  assert.strictEqual(exState.answers[0], 0); // unchanged
  assert.strictEqual(cb.n, 1);
});

test('multiple-choice: promptHtml path does not throw', () => {
  const item = { promptHtml: '<b>q</b>', choices: ['A', 'B'], answer: 1, choicesAreCode: false };
  const { root, exState } = renderMC(item);
  root.querySelectorAll('.btn-choice').find((b) => b.textContent === 'B').click();
  assert.strictEqual(exState.answers[0], 1);
});

// ── Hardening: one malformed block must not blank the whole lesson ───────────

test('CourseApp: a bad block kind/type renders an error placeholder, siblings survive', () => {
  const curriculum = {
    title: 'Hardening Test', subtitle: 's',
    lessons: [{
      id: 'l1', title: 'Lesson 1: X', description: 'd',
      blocks: [
        { type: 'concept',  id: 'c1', title: 'Good',    content: '<p>hi</p>' },
        { type: 'exercise', id: 'e1', title: 'BadKind', kind: 'no-such-kind', instruction: 'i', items: [] },
        { type: 'mystery',  id: 'm1', title: 'BadType' },                 // unknown block type
        { type: 'concept',  id: 'c2', title: 'AfterAll', content: '<p>ok</p>' },
      ],
    }],
  };
  // The hardening logs each caught block error via console.error; silence it
  // here (the failures are intentional) so the test output stays clean.
  const origErr = console.error;
  console.error = () => {};
  try {
    assert.doesNotThrow(() => { new CourseApp(curriculum); }); // must not crash the page
  } finally {
    console.error = origErr;
  }
  const stage = documentStub.getElementById('stage');
  assert.strictEqual(stage.querySelectorAll('.block-error').length, 2, 'both bad blocks fell back');
  assert.strictEqual(stage.querySelectorAll('.concept-block').length, 2, 'good blocks still rendered');
  // the error placeholders are skippable (carry a Continue button)
  assert.ok(stage.querySelectorAll('.btn-continue').length >= 2);
});

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
