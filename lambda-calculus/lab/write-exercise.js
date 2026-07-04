// write-exercise.js — registers the 'write-expression' exercise kind.
// Loads after engine.js (for ExerciseHandlers / h / setFeedback globals)
// and lambda.js (for window.Lambda). Lambda course pages only; TFL never
// loads this file, so the shared engine stays lambda-free.
//
// Item shape:
//   { prompt | promptHtml, answer, explanation,
//     check?: 'beta' (default) | 'alpha',
//     tests?: [{ args: ['TRUE','FALSE'], expect: 'TRUE' }, …] }
// Grading: `tests` (apply the user's expression and compare outputs) when
// present, else normal-form ('beta') or as-written ('alpha') equivalence
// against `answer`. Users may retry; after 3 misses a Show-answer option
// appears (revealing scores the item as incorrect).

(function () {
  'use strict';

  if (typeof ExerciseHandlers === 'undefined' || !window.Lambda) return;
  const L = window.Lambda;
  const MAX_ATTEMPTS_BEFORE_REVEAL = 3;

  ExerciseHandlers['write-expression'] = {
    render(block, exState, callbacks) {
      const itemsEl = h('div', { className: 'exercise-items' });

      block.items.forEach((item, i) => {
        const feedbackEl = h('div', { className: 'feedback' });
        const input = h('input', {
          className: 'we-input',
          spellcheck: false,
          placeholder: 'λx.…  (type \\ for λ)',
        });
        const checkBtn  = h('button', { className: 'we-check' }, 'Check');
        const revealBtn = h('button', { className: 'we-reveal' }, 'Show answer');
        revealBtn.style.display = 'none';

        const qEl = h('div', { className: 'we-prompt' });
        if (item.promptHtml) qEl.innerHTML = item.promptHtml; // authored HTML — trusted
        else qEl.textContent = item.prompt;

        const itemEl = h('div', { className: 'exercise-item' },
          qEl,
          h('div', { className: 'we-row' }, input, checkBtn, revealBtn),
          feedbackEl);
        itemsEl.append(itemEl);

        let attempts = 0;

        input.addEventListener('input', () => {
          if (!input.value.includes('\\')) return;
          const { selectionStart, selectionEnd } = input;
          input.value = input.value.replaceAll('\\', 'λ');
          input.setSelectionRange(selectionStart, selectionEnd);
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); check(); }
        });

        // `stored` feeds the engine's countCorrect: the item's own answer
        // string counts as correct, anything else as incorrect.
        function finish(correct, stored, explanation) {
          exState.answers[i] = stored;
          itemEl.classList.add(correct ? 'correct' : 'incorrect');
          setFeedback(feedbackEl, correct, explanation);
          input.disabled = true;
          checkBtn.disabled = true;
          revealBtn.remove();
          if (window.LambdaLab && input.value.trim()) {
            const tryBtn = h('button', { className: 'lab-try' }, '▸ open in λ Lab');
            tryBtn.addEventListener('click', () => window.LambdaLab.load(input.value.trim()));
            feedbackEl.append(tryBtn);
          }
          callbacks.onItemAnswered();
        }

        function check() {
          if (exState.answers[i] !== undefined) return;
          const src = input.value.trim();
          if (!src) return;
          const r = L.checkExpression(src, item.answer, {
            mode: item.check, tests: item.tests,
          });
          if (r.ok) {
            finish(true, item.answer, item.explanation);
            return;
          }
          attempts++;
          setFeedback(feedbackEl, false, `${r.message} Edit your answer and check again.`);
          if (attempts >= MAX_ATTEMPTS_BEFORE_REVEAL) revealBtn.style.display = '';
        }

        checkBtn.addEventListener('click', check);
        revealBtn.addEventListener('click', () => {
          finish(false, '__revealed__',
            `One correct answer: ${item.answer}. ${item.explanation}`);
        });
      });

      return itemsEl;
    }
  };
})();
