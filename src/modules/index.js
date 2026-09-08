// Module registry: lesson pages mount interactive tools by name via data-module attributes.
const loaders = {
  'ball-flight': () => import('./BallFlightLab.js').then((m) => m.mountBallFlightLab),
  'swing-viewer': () => import('./SwingViewer.js').then((m) => m.mountSwingViewer),
  'green-reader': () => import('./GreenReader.js').then((m) => m.mountGreenReader),
  'setup-viewer': () => import('./SetupViewer.js').then((m) => m.mountSetupViewer),
  'wedge-clock': () => import('./WedgeClock.js').then((m) => m.mountWedgeClock),
  'chip-calc': () => import('./ChipCalc.js').then((m) => m.mountChipCalc),
  'bunker-viz': () => import('./BunkerViz.js').then((m) => m.mountBunkerViz),
  'flight-laws': () => import('./FlightLaws.js').then((m) => m.mountFlightLaws),
  'swing-drill': () => import('./SwingDrill.js').then((m) => m.mountSwingDrill),
};

export async function mountModule(type, root, preset = {}) {
  const load = loaders[type];
  if (!load) { console.warn('Unknown module', type); return null; }
  const mount = await load();
  return mount(root, preset);
}

// Mount every [data-module] element on the page, lazily when it scrolls near the viewport.
export function mountAllModules(scope = document) {
  const els = [...scope.querySelectorAll('[data-module]')];
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target;
      let preset = {};
      try { preset = JSON.parse(el.dataset.preset || '{}'); } catch {}
      if (el.dataset.caption) preset.caption = el.dataset.caption;
      el.replaceChildren(); el.classList.remove('module--pending');
      mountModule(el.dataset.module, el, preset).catch((err) => { console.error(err); el.classList.add('module--failed'); });
    }
  }, { rootMargin: '600px 0px' });
  els.forEach((el) => io.observe(el));
}
