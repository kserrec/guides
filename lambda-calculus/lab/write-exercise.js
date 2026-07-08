// write-exercise.js — registers the 'write-expression' exercise kind.
// Loads after engine.js (for ExerciseHandlers / makeFreeInputExercise) and
// lambda.js (for window.Lambda). Lambda course pages only; TFL never loads
// this file, so the shared engine stays lambda-free.
//
// Item shape:
//   { prompt | promptHtml, answer, explanation,
//     check?: 'beta' (default) | 'alpha',
//     tests?: [{ args: ['TRUE','FALSE'], expect: 'TRUE' }, …] }
// Grading: `tests` (apply the user's expression and compare outputs) when
// present, else normal-form ('beta') or as-written ('alpha') equivalence
// against `answer`. The retry/reveal shell lives in makeFreeInputExercise.

(function () {
  'use strict';

  if (typeof ExerciseHandlers === 'undefined' || !window.Lambda) return;
  const L = window.Lambda;

  ExerciseHandlers['write-expression'] = makeFreeInputExercise({
    placeholder: () => 'λx.…  (type \\ for λ)',
    setupInput(input) {
      input.addEventListener('input', () => {
        if (!input.value.includes('\\')) return;
        const { selectionStart, selectionEnd } = input;
        input.value = input.value.replaceAll('\\', 'λ');
        input.setSelectionRange(selectionStart, selectionEnd);
      });
    },
    grade: (src, item) => L.checkExpression(src, item.answer, {
      mode: item.check, tests: item.tests,
    }),
    labChip: (item, src) => window.LambdaLab
      ? { label: '▸ open in λ Lab', load: () => window.LambdaLab.load(src) }
      : null,
  });
})();
