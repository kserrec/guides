// engine.js
// Renders CURRICULUM and manages all interaction state.
// To add new exercise kinds: register a handler in ExerciseHandlers.
// Curricula may declare: title, subtitle, icon, lessons[].

// ── Utilities ────────────────────────────────────────────────────────────────

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) Object.assign(el, attrs);
  for (const child of children) {
    if (child == null) continue;
    el.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

function countCorrect(answers, items) {
  return Object.entries(answers).filter(([i, a]) => a === items[+i].answer).length;
}

// Random permutation of [0, n) — Fisher-Yates.
function shuffledIndices(n) {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// Populates a feedback element with the result icon and explanation text.
function setFeedback(el, correct, explanation) {
  el.className = `feedback feedback-${correct ? 'correct' : 'incorrect'} visible`;
  el.replaceChildren(
    h('span', { className: 'fi' }, correct ? '✓' : '✗'),
    h('span', null, explanation)
  );
}

// ── Exercise Handlers ─────────────────────────────────────────────────────────
// Each handler: { render(block, state, callbacks) → Element }
// callbacks: { onItemAnswered() }
// Items may use exprHtml / promptHtml for authored-HTML display (e.g. syllogisms).

const ExerciseHandlers = {
  'valid-or-invalid': {
    render(block, exState, callbacks) {
      const itemsEl = h('div', { className: 'exercise-items' });

      block.items.forEach((item, i) => {
        const feedbackEl = h('div', { className: 'feedback' });
        const validBtn   = h('button', { className: 'btn-answer btn-valid'   }, 'Valid');
        const invalidBtn = h('button', { className: 'btn-answer btn-invalid' }, 'Invalid');

        const exprEl = h('div', { className: 'expr-display' });
        if (item.exprHtml) {
          exprEl.innerHTML = item.exprHtml; // authored HTML — trusted
        } else {
          exprEl.append(h('code', null, item.expr));
        }

        const itemEl = h('div', { className: 'exercise-item' },
          exprEl,
          h('div', { className: 'answer-buttons' }, validBtn, invalidBtn),
          feedbackEl
        );
        itemsEl.append(itemEl);

        const handleClick = (chosen) => {
          if (exState.answers[i] !== undefined) return;
          exState.answers[i] = chosen;

          const correct = chosen === item.answer;
          itemEl.classList.add(correct ? 'correct' : 'incorrect');
          setFeedback(feedbackEl, correct, item.explanation);
          [validBtn, invalidBtn].forEach(b => { b.disabled = true; });

          callbacks.onItemAnswered();
        };

        validBtn.addEventListener('click',   () => handleClick('valid'));
        invalidBtn.addEventListener('click', () => handleClick('invalid'));
      });

      return itemsEl;
    }
  },

  'multiple-choice': {
    render(block, exState, callbacks) {
      const itemsEl = h('div', { className: 'exercise-items' });

      block.items.forEach((item, i) => {
        // Declared before the choices loop so click handlers close over them.
        const feedbackEl = h('div', { className: 'feedback' });
        const choicesEl  = h('div', { className: 'mc-choices' });
        const itemEl     = h('div', { className: 'exercise-item' });
        const useCode    = item.choicesAreCode !== false;

        // Choices display in shuffled order; answers are stored and scored by
        // authored index, so item.answer needs no adjustment. Choices must not
        // reference each other by position ("both of the above").
        const order = shuffledIndices(item.choices.length);

        order.forEach((orig) => {
          const btn = h('button', { className: 'btn-choice' });
          btn.append(useCode ? h('code', null, item.choices[orig]) : item.choices[orig]);

          btn.addEventListener('click', () => {
            if (exState.answers[i] !== undefined) return;
            exState.answers[i] = orig;

            const correct = orig === item.answer;
            itemEl.classList.add(correct ? 'correct' : 'incorrect');

            choicesEl.querySelectorAll('.btn-choice').forEach((b, k) => {
              b.disabled = true;
              if (order[k] === item.answer)           b.classList.add('choice-correct');
              else if (order[k] === orig && !correct) b.classList.add('choice-wrong');
            });

            setFeedback(feedbackEl, correct, item.explanation);
            callbacks.onItemAnswered();
          });

          choicesEl.append(btn);
        });

        const qEl = h('div', { className: 'mc-question' });
        if (item.promptHtml) {
          qEl.innerHTML = item.promptHtml; // authored HTML — trusted
        } else {
          if (item.prompt) qEl.append(h('span', { className: 'mc-prompt' }, item.prompt));
          if (item.expr)   qEl.append(' ', h('code', { className: 'mc-expr' }, item.expr));
        }

        itemEl.append(qEl, choicesEl, feedbackEl);
        itemsEl.append(itemEl);
      });

      return itemsEl;
    }
  }
};

// ── App ───────────────────────────────────────────────────────────────────────

class CourseApp {
  constructor(curriculum) {
    this.curriculum  = curriculum;
    this.lessonIndex = 0;
    this.exerciseState = {};
    this.blockEls    = [];

    const storageKey = `progress-${curriculum.title}`;
    let stored = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(parsed)) stored = parsed;
    } catch(e) {}
    this.completedLessons = new Set(stored);
    this.storageKey = storageKey;

    this.stage = document.getElementById('stage');
    this.init();
  }

  get lesson() {
    return this.curriculum.lessons[this.lessonIndex];
  }

  init() {
    document.getElementById('site-title').textContent    = this.curriculum.title;
    document.getElementById('site-subtitle').textContent = this.curriculum.subtitle;
    this.goToLesson(0);
  }

  goToLesson(index) {
    this.lessonIndex = index;
    this.renderNav();
    this.renderLesson();
  }

  renderNav() {
    const nav = document.getElementById('lesson-nav');
    if (!nav) return;
    nav.innerHTML = '';

    this.curriculum.lessons.forEach((lesson, i) => {
      const isActive   = i === this.lessonIndex;
      const isComplete = lesson.id && this.completedLessons.has(lesson.id);
      const shortTitle = lesson.navTitle || lesson.title.replace(/^Lesson \d+:\s*/i, '');
      const btn = h('button', { className: `nav-lesson${isActive ? ' active' : ''}` },
        h('span', { className: 'nav-lesson-num'   }, `Lesson ${i + 1}`),
        h('span', { className: 'nav-lesson-title' }, shortTitle),
        isComplete ? h('span', { className: 'nav-check' }, '✓') : null
      );
      btn.addEventListener('click', () => {
        if (i === this.lessonIndex) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.goToLesson(i);
      });
      nav.append(btn);
    });
  }

  renderLesson() {
    this.stage.innerHTML = '';
    this.blockEls = [];
    this.exerciseState = {};

    const hdr = h('div', { className: 'lesson-header' },
      h('h2', null, this.lesson.title),
      h('p', { className: 'lesson-desc' }, this.lesson.description)
    );
    this.stage.append(hdr);

    this.lesson.blocks.forEach((block, i) => {
      if (block.type === 'exercise') {
        this.exerciseState[block.id] = { answers: {}, completed: false };
      }
      const el = this.buildBlock(block, i);
      el.id = `block-${i}`;
      el.classList.add('block--hidden');
      this.stage.append(el);
      this.blockEls.push(el);
    });

    this.showBlock(0);
  }

  // ── Block builders ────────────────────────────────────────────────────────

  buildBlock(block, index) {
    if (block.type === 'concept')  return this.buildConceptBlock(block, index);
    if (block.type === 'exercise') return this.buildExerciseBlock(block, index);
    throw new Error(`Unknown block type: ${block.type}`);
  }

  // "Continue →" button that hides itself and reveals the next block.
  continueButton(fromIndex) {
    const btn = h('button', { className: 'btn-continue' }, 'Continue →');
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
      this.advance(fromIndex);
    });
    return btn;
  }

  buildConceptBlock(block, index) {
    const contentEl = h('div', { className: 'block-content' });
    contentEl.innerHTML = block.content; // authored HTML — trusted

    return h('div', { className: 'block concept-block' },
      h('h3', { className: 'block-title' }, block.title),
      contentEl,
      h('div', { className: 'block-footer' }, this.continueButton(index))
    );
  }

  buildExerciseBlock(block, index) {
    const exState  = this.exerciseState[block.id];
    const scoreEl  = h('div', { className: 'exercise-score' });
    const footerEl = h('div', { className: 'exercise-footer' });

    const titleEl = h('h3', { className: 'block-title exercise-title' },
      h('span', { className: `title-badge${block.isFinal ? ' final' : ''}` },
        block.isFinal ? 'Final Review' : 'Exercise'),
      ' ' + block.title
    );

    const handler = ExerciseHandlers[block.kind];
    if (!handler) throw new Error(`Unknown exercise kind: ${block.kind}`);

    const itemsEl = handler.render(block, exState, {
      onItemAnswered: () => {
        this.updateScore(block, exState, scoreEl);
        if (Object.keys(exState.answers).length === block.items.length) {
          this.onExerciseComplete(block, exState, footerEl, index);
        }
      }
    });

    const skipBtn = h('button', { className: 'btn-skip' }, 'Skip →');
    skipBtn.addEventListener('click', () => {
      skipBtn.style.display = 'none';
      exState.skipped = true;
      this.advance(index);
    });
    footerEl.append(skipBtn);

    return h('div', { className: 'block exercise-block' },
      titleEl,
      h('p', { className: 'exercise-instruction' }, block.instruction),
      itemsEl,
      scoreEl,
      footerEl
    );
  }

  // ── State & flow ──────────────────────────────────────────────────────────

  updateScore(block, exState, scoreEl) {
    const answered = Object.keys(exState.answers).length;
    const correct  = countCorrect(exState.answers, block.items);
    scoreEl.textContent = `${correct} / ${answered} correct`;
    scoreEl.className   = 'exercise-score visible';
  }

  onExerciseComplete(block, exState, footerEl, index) {
    if (exState.skipped) return;
    exState.completed = true;

    const total     = block.items.length;
    const correct   = countCorrect(exState.answers, block.items);
    const isPerfect = correct === total;

    const msg = h('p', { className: `completion-msg${isPerfect ? ' perfect' : ''}` },
      isPerfect
        ? `Perfect — ${correct}/${total}!`
        : `Score: ${correct}/${total}. Review any highlighted items above.`
    );
    footerEl.insertBefore(msg, footerEl.firstChild);
    footerEl.querySelector('.btn-skip')?.remove();
    footerEl.append(this.continueButton(index));
  }

  showBlock(index) {
    const el = this.blockEls[index];
    if (!el) return;
    el.classList.remove('block--hidden');
    // Force reflow so the fadeUp animation replays for each newly revealed block.
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  }

  advance(fromIndex) {
    const nextIndex = fromIndex + 1;
    if (nextIndex >= this.lesson.blocks.length) {
      this.appendLessonComplete();
      return;
    }
    this.showBlock(nextIndex);
    this.blockEls[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  appendLessonComplete() {
    if (this.stage.querySelector('.lesson-complete')) return;

    if (this.lesson.id && !this.completedLessons.has(this.lesson.id)) {
      this.completedLessons.add(this.lesson.id);
      try {
        localStorage.setItem(this.storageKey, JSON.stringify([...this.completedLessons]));
      } catch(e) {}
      this.renderNav();
    }

    const nextIndex  = this.lessonIndex + 1;
    const nextLesson = this.curriculum.lessons[nextIndex];
    const icon       = this.curriculum.icon ?? '◆';

    const div = h('div', { className: 'lesson-complete' },
      h('div', { className: 'complete-icon' }, icon),
      h('h3',  null, 'Lesson Complete!'),
      h('p',   null, this.lesson.completionText || 'Great work making it through this lesson.')
    );

    if (nextLesson) {
      const nextUp = h('p', { className: 'next-up' });
      nextUp.append('Up next: ', h('strong', null, nextLesson.title));
      div.append(nextUp);

      const btn = h('button', { className: 'btn-next-lesson' },
        `Start ${nextLesson.title} →`);
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.goToLesson(nextIndex);
      });
      div.append(btn);
    }

    this.stage.append(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  new CourseApp(CURRICULUM);
});
