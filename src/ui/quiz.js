import { h, inlineMarkup } from './dom.js';
import { progress } from './progress.js';
import { sfx } from './audio.js';

// Checkpoint quiz: one question at a time, instant feedback, pass mark 4/5.
export function mountQuiz(container, questions, slug) {
  let i = 0, score = 0;
  const answered = [];
  render();
  function render() {
    container.replaceChildren();
    if (i >= questions.length) return renderResult();
    const q = questions[i];
    const card = h('div.quiz__card',
      h('div.quiz__progress', h('span.mono', `Question ${i + 1} of ${questions.length}`), h('span.quiz__dots', ...questions.map((_, k) => h('i', { class: k < i ? (answered[k] ? 'is-right' : 'is-wrong') : k === i ? 'is-current' : '' })))),
      h('h3.quiz__q', { html: inlineMarkup(q.question) }),
      h('div.quiz__opts', ...q.options.map((o, k) => h('button.quiz__opt', { type: 'button', onClick: (e) => choose(k, e.currentTarget) }, h('span.quiz__letter.mono', 'ABCD'[k]), h('span', { html: inlineMarkup(o) })))),
      h('div.quiz__feedback'),
    );
    container.append(card);
  }
  function choose(k, btn) {
    const q = questions[i];
    const right = k === q.answer;
    answered[i] = right; if (right) score++;
    container.querySelectorAll('.quiz__opt').forEach((b, idx) => { b.disabled = true; b.classList.toggle('is-right', idx === q.answer); b.classList.toggle('is-wrong', idx === k && !right); });
    const fb = container.querySelector('.quiz__feedback');
    fb.replaceChildren(h('div', { class: right ? 'quiz__msg is-right' : 'quiz__msg is-wrong' }, h('b', right ? 'Correct.' : 'Not quite.'), ' ', h('span', { html: inlineMarkup(q.explanation) })),
      h('button.btn.btn--sm.btn--primary', { type: 'button', onClick: () => { i++; render(); } }, i + 1 < questions.length ? 'Next question' : 'See your score'));
    right ? sfx.tick() : sfx.whoosh(0.2);
    fb.querySelector('button').focus();
  }
  function renderResult() {
    const passed = score >= Math.ceil(questions.length * 0.8);
    if (passed) { progress.complete(slug, score); sfx.chime(); }
    const nextSlug = document.body.dataset.next;
    container.append(h('div.quiz__result', { class: passed ? 'quiz__result is-pass' : 'quiz__result' },
      h('div.quiz__score', h('b', `${score}/${questions.length}`), h('span', passed ? 'Lesson complete' : 'Almost there')),
      h('p', passed ? 'You have the concepts. Take them to the range with the checklist above, then move on.' : 'Re-read the sections tied to the questions you missed, then try again. Understanding the cause is the whole point.'),
      h('div.row',
        h('button.btn.btn--sm', { type: 'button', onClick: () => { i = 0; score = 0; answered.length = 0; render(); } }, 'Retake quiz'),
        passed && nextSlug ? h('a.btn.btn--sm.btn--gold', { href: `${import.meta.env.BASE_URL}lessons/${nextSlug}/` }, 'Next lesson →') : null),
    ));
  }
}
