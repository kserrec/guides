// tfl-exercise.js — registers the 'tfl-expression' exercise kind (D8).
// Loads after engine.js (for ExerciseHandlers / makeFreeInputExercise),
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
// argument. The retry/reveal shell lives in makeFreeInputExercise; its
// wrong-answer feedback never leaks the expected answer.

(function () {
  'use strict';

  if (typeof ExerciseHandlers === 'undefined' || !window.TFL) return;
  const T = window.TFL;

  // Context-aware "open in the lab" target for a finished item.
  function labTarget(item, userSrc) {
    const prem = (item.premises || []).join('\n');
    if (item.mode === 'derive') return { src: prem, qry: '? ' + userSrc };
    if (item.mode === 'premise') {
      return { src: [prem, userSrc].filter(Boolean).join('\n'), qry: '? ' + item.conclusion };
    }
    return { src: userSrc, qry: '?= ' + userSrc };
  }

  ExerciseHandlers['tfl-expression'] = makeFreeInputExercise({
    placeholder: (item) =>
      item.mode === 'premise' ? 'the missing premise, e.g. −M+P'
      : item.mode === 'derive'  ? 'the conclusion, e.g. −S+P'
      : 'a TFL proposition, e.g. −S+P',
    grade: (src, item) => T.checkExpression(src, item),
    labChip: (item, src) => {
      if (!window.TFLLab) return null;
      const { src: labSrc, qry } = labTarget(item, src);
      return { label: '▸ open in the TFL Lab', load: () => window.TFLLab.load(labSrc, qry) };
    },
  });
})();
