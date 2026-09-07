import { CURRICULUM } from '../content/curriculum.js';
import { progress } from './progress.js';
import { sfx } from './audio.js';
import { h } from './dom.js';

const BASE = import.meta.env.BASE_URL || '/';
const url = (p) => BASE + p.replace(/^\//, '');

// Shared page chrome behaviour: sticky nav, mobile menu, curriculum drawer, audio toggle, reveal-on-scroll.
export function initChrome() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  document.querySelector('[data-nav-toggle]')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('is-open');
  });

  // Audio toggle
  const audioBtn = document.querySelector('[data-audio-toggle]');
  const syncAudio = () => { if (!audioBtn) return; audioBtn.setAttribute('aria-pressed', String(sfx.enabled)); audioBtn.classList.toggle('is-on', sfx.enabled); };
  audioBtn?.addEventListener('click', () => { sfx.toggle(); if (sfx.enabled) sfx.tick(); syncAudio(); });
  syncAudio();

  // Drawer
  let drawer = null;
  const openDrawer = () => {
    if (!drawer) drawer = buildDrawer();
    document.body.append(drawer);
    drawer.classList.add('is-open');
    refreshDrawer(drawer);
    drawer.querySelector('.drawer__close')?.focus();
  };
  const closeDrawer = () => drawer?.classList.remove('is-open');
  document.querySelectorAll('[data-open-drawer]').forEach((b) => b.addEventListener('click', openDrawer));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  function buildDrawer() {
    const current = document.body.dataset.lesson;
    const list = h('div.drawer__list');
    for (const l of CURRICULUM) {
      list.append(h('a.drawer__item', { href: url(`/lessons/${l.slug}/`), class: l.slug === current ? 'drawer__item is-current' : 'drawer__item', dataset: { slug: l.slug } },
        h('span.drawer__num', String(l.number).padStart(2, '0')),
        h('span', h('div.drawer__title', l.title), h('div.drawer__meta', `${l.kicker} · ${l.duration}`)),
        h('span.drawer__done', { 'aria-label': 'completed' }, '✓')));
    }
    const d = h('div.drawer', { role: 'dialog', 'aria-label': 'Curriculum' },
      h('div.drawer__scrim', { onClick: closeDrawer }),
      h('div.drawer__panel',
        h('div.drawer__head', h('span.kicker', 'Curriculum'), h('button.drawer__close', { type: 'button', 'aria-label': 'Close', onClick: closeDrawer }, '✕')),
        list,
        h('div.drawer__progress', h('div.drawer__progress-text'), h('div.drawer__bar', h('i')))));
    return d;
  }
  function refreshDrawer(d) {
    const p = progress.get();
    d.querySelectorAll('.drawer__item').forEach((a) => a.querySelector('.drawer__done').classList.toggle('is-done', !!p.done?.[a.dataset.slug]));
    const { done, total } = progress.count(CURRICULUM.length);
    d.querySelector('.drawer__progress-text').textContent = done ? `${done} of ${total} lessons complete` : 'No lessons completed yet. Start with the setup.';
    requestAnimationFrame(() => { d.querySelector('.drawer__bar i').style.width = `${(done / total) * 100}%`; });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Lesson card completion ticks (home)
  const syncCards = () => { const p = progress.get(); document.querySelectorAll('[data-lesson-card]').forEach((c) => c.classList.toggle('is-done', !!p.done?.[c.dataset.lessonCard])); };
  syncCards(); document.addEventListener('fi:progress', syncCards);
  return { openDrawer, closeDrawer };
}
