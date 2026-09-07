// Learner progress kept in localStorage: completed lessons, quiz scores, checklist ticks.
const KEY = 'fi-progress';
function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} document.dispatchEvent(new CustomEvent('fi:progress', { detail: p })); }
export const progress = {
  get() { return load(); },
  isDone(slug) { return !!load().done?.[slug]; },
  complete(slug, score) { const p = load(); p.done = p.done || {}; p.done[slug] = true; p.quiz = p.quiz || {}; if (score != null) p.quiz[slug] = Math.max(score, p.quiz[slug] || 0); save(p); },
  quizScore(slug) { return load().quiz?.[slug] ?? null; },
  checks(slug) { return load().checks?.[slug] || []; },
  setCheck(slug, i, on) { const p = load(); p.checks = p.checks || {}; const arr = new Set(p.checks[slug] || []); on ? arr.add(i) : arr.delete(i); p.checks[slug] = [...arr]; save(p); },
  visit(slug) { const p = load(); p.visited = p.visited || {}; p.visited[slug] = Date.now(); p.last = slug; save(p); },
  count(total) { const d = load().done || {}; return { done: Object.keys(d).length, total }; },
  reset() { save({}); },
};
