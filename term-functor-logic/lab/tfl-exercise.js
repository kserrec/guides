// tfl-exercise.js — registers the 'tfl-expression' exercise kind (D8).
// Loads after engine.js (for ExerciseHandlers / h / setFeedback globals),
// tfl.js (window.TFL) and lab.js (window.TFLLab, optional). TFL course
// pages only; lambda pages never load it, so the shared engine stays
// logic-agnostic — grading lives in the engine module, not here.
//
// Item shape:
//   { prompt | promptHtml, answer, explanation,
//     mode?: 'transcribe' (default) | 'derive' | 'premise',
//     premises?: ['−M+P', '−S+M'],   // derive & premise
//     conclusion?: '−S+P' }          // premise
// Grading is TFL.checkExpression (pure, unit-tested): transcribe accepts any
// immediate-rule equivalent of `answer`; derive accepts the target
// conclusion; premise accepts any consistent premise that completes the
// argument. Users may retry; after 3 misses a Show-answer option appears
// (revealing scores the item as incorrect). Wrong-answer feedback never
// leaks the expected answer.

(function () {
  'use strict';

  if (typeof ExerciseHandlers === 'undefined' || !window.TFL) return;
  const T = window.TFL;
  const MAX_ATTEMPTS_BEFORE_REVEAL = 3;

  // Context-aware "open in the lab" target for a finished item.
  function labTarget(item, userSrc) {
    const prem = (item.premises || []).join('\n');
    if (item.mode === 'derive') return { src: prem, qry: '? ' + userSrc };
    if (item.mode === 'premise') {
      return { src: [prem, userSrc].filter(Boolean).join('\n'), qry: '? ' + item.conclusion };
    }
    return { src: userSrc, qry: '?= ' + userSrc };
  }

  ExerciseHandlers['tfl-expression'] = {
    render(block, exState, callbacks) {
      const itemsEl = h('div', { className: 'exercise-items' });

      block.items.forEach((item, i) => {
        const feedbackEl = h('div', { className: 'feedback' });
        const input = h('input', {
          className: 'we-input',
          spellcheck: false,
          placeholder: item.mode === 'premise' ? 'the missing premise, e.g. −M+P'
                     : item.mode === 'derive'  ? 'the conclusion, e.g. −S+P'
                     : 'a TFL proposition, e.g. −S+P',
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
          if (window.TFLLab && input.value.trim()) {
            const { src, qry } = labTarget(item, input.value.trim());
            const tryBtn = h('button', { className: 'lab-try' }, '▸ open in the TFL Lab');
            tryBtn.addEventListener('click', () => window.TFLLab.load(src, qry));
            feedbackEl.append(tryBtn);
          }
          callbacks.onItemAnswered();
        }

        function check() {
          if (exState.answers[i] !== undefined) return;
          const src = input.value.trim();
          if (!src) return;
          const r = T.checkExpression(src, item);
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
