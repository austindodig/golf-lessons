// Tiny DOM builder: h('div.class#id', { attrs }, ...children)
export function h(sel, attrs = {}, ...children) {
  const [tag, ...rest] = sel.split(/(?=[.#])/);
  const el = document.createElement(tag || 'div');
  for (const r of rest) { if (r[0] === '.') el.classList.add(r.slice(1)); else if (r[0] === '#') el.id = r.slice(1); }
  if (attrs && typeof attrs === 'object' && !(attrs instanceof Node) && !Array.isArray(attrs)) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k in el && k !== 'list' && typeof v !== 'string') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
  } else children.unshift(attrs);
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}
export const svgIcon = {
  play: '<svg viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z"/></svg>',
  pause: '<svg viewBox="0 0 16 16"><path d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>',
  reset: '<svg viewBox="0 0 16 16"><path d="M8 3a5 5 0 1 1-4.6 3h1.7A3.4 3.4 0 1 0 8 4.6V7L4 3.8 8 .5z"/></svg>',
  clear: '<svg viewBox="0 0 16 16"><path d="M2 4h12v1.5H2zM4 6h8l-.8 8H4.8zM6 1.5h4V3H6z"/></svg>',
  spark: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 2v4M10 14v4M2 10h4M14 10h4M4.9 4.9l2.8 2.8M12.3 12.3l2.8 2.8M4.9 15.1l2.8-2.8M12.3 7.7l2.8-2.8"/></svg>',
};
export function fmt(n, d = 0) { return Number.isFinite(n) ? n.toFixed(d) : '–'; }
export function signed(n, d = 0, unit = '') { const s = n > 0 ? '+' : ''; return `${s}${n.toFixed(d)}${unit}`; }
export function inlineMarkup(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
