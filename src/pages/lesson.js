import '../styles/main.css';
import { initChrome } from '../ui/chrome.js';
import { mountAllModules } from '../modules/index.js';
import { mountQuiz } from '../ui/quiz.js';
import { progress } from '../ui/progress.js';
import { quality } from '../core/quality.js';

const slug = document.body.dataset.lesson;
initChrome();
progress.visit(slug);
mountAllModules();

// Quiz
const quizEl = document.querySelector('[data-quiz]');
const quizData = document.getElementById('quiz-data');
if (quizEl && quizData) { try { mountQuiz(quizEl, JSON.parse(quizData.textContent), slug); } catch (e) { console.error(e); } }

// Checklist persistence
const checks = new Set(progress.checks(slug));
document.querySelectorAll('[data-check]').forEach((input) => {
  const i = Number(input.dataset.check);
  input.checked = checks.has(i);
  input.addEventListener('change', () => progress.setCheck(slug, i, input.checked));
});

// Section rail + reading progress
const sections = [...document.querySelectorAll('[data-section]')];
const railLinks = [...document.querySelectorAll('[data-rail]')];
const railBar = document.querySelector('.lesson__rail-progress i');
const navBar = document.getElementById('nav-progress');
let activeId = null;
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { activeId = e.target.id; railLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.rail === activeId)); }
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((s) => io.observe(s));
const onScroll = () => {
  const doc = document.documentElement;
  const p = Math.min(1, scrollY / Math.max(1, doc.scrollHeight - innerHeight));
  if (railBar) railBar.style.width = `${p * 100}%`;
  if (navBar) navBar.style.width = `${p * 100}%`;
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Hero parallax (cheap transform on scroll)
const bg = document.querySelector('[data-parallax]');
if (bg && !quality.reducedMotion) {
  const tick = () => { const y = Math.min(scrollY, innerHeight); bg.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y / innerHeight * 0.05})`; };
  addEventListener('scroll', tick, { passive: true }); tick();
}
