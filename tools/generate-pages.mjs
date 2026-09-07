// Generates static lesson pages (lessons/<slug>/index.html), the curriculum manifest
// and the home page curriculum grid from src/content/lessons/*.js.
import { readdirSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.VITE_BASE || '/').replace(/\/?$/, '/');
const SITE = 'Fairway Institute';
const lessonsDir = resolve(root, 'src/content/lessons');
const { IMAGES } = await import(pathToFileURL(resolve(root, 'src/content/images.js')).href);

const files = readdirSync(lessonsDir).filter((f) => f.endsWith('.js'));
const lessons = [];
for (const f of files) {
  const mod = await import(pathToFileURL(resolve(lessonsDir, f)).href);
  lessons.push(mod.default);
}
lessons.sort((a, b) => a.number - b.number);
const bySlug = Object.fromEntries(lessons.map((l) => [l.slug, l]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
const attrJson = (o) => esc(JSON.stringify(o));
const img = (key) => { const i = IMAGES[key]; if (!i) return { src: '', alt: '' }; return { src: i.local ? BASE + i.local.replace(/^\//, '') : i.remote, alt: i.alt || '' }; };
const pad = (n) => String(n).padStart(2, '0');
const url = (p) => BASE + p.replace(/^\//, '');

function head({ title, description, image, path }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
${image ? `<meta property="og:image" content="${esc(image)}" />` : ''}
<meta property="og:type" content="website" />
<meta name="theme-color" content="#060a0d" />
<link rel="icon" href="${url('/favicon.svg')}" type="image/svg+xml" />
<link rel="stylesheet" href="/src/styles/main.css" />
<script type="module" src="/src/pages/${path}.js"></script>
</head>`;
}

function navHtml(current) {
  return `<header class="nav" id="nav">
  <div class="container--wide nav__inner">
    <a class="nav__brand" href="${url('/')}" aria-label="${SITE} home"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14.5" fill="none" stroke="#6ee7a8" stroke-width="1.5"/><circle cx="16" cy="16" r="6" fill="#f3cf7a"/><path d="M16 2v6M16 24v6M2 16h6M24 16h6" stroke="#6ee7a8" stroke-width="1.5" stroke-linecap="round"/></svg><span>Fairway<span class="muted"> Institute</span></span></a>
    <nav class="nav__links" id="nav-links" aria-label="Primary">
      <button type="button" data-open-drawer>Curriculum</button>
      <a href="${url('/lessons/swing/')}" ${current === 'swing' ? 'class="is-active"' : ''}>The Swing</a>
      <a href="${url('/lessons/ball-flight/')}" ${current === 'ball-flight' ? 'class="is-active"' : ''}>Flight Lab</a>
      <a href="${url('/lessons/putting/')}" ${current === 'putting' ? 'class="is-active"' : ''}>Putting</a>
      <button type="button" class="nav__audio" data-audio-toggle aria-pressed="false" title="Sound"><span class="nav__audio-ic" aria-hidden="true"></span><span>Sound</span></button>
      <a class="btn btn--primary btn--sm nav__cta" href="${url('/lessons/setup/')}">Start learning</a>
    </nav>
    <button class="nav__toggle" type="button" aria-label="Menu" aria-controls="nav-links" data-nav-toggle><span></span></button>
    <div class="nav__progress" id="nav-progress"></div>
  </div>
</header>`;
}

function footerHtml() {
  const list = lessons.map((l) => `<a href="${url(`/lessons/${l.slug}/`)}">${pad(l.number)} ${esc(l.title)}</a>`).join('\n        ');
  return `<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <h4>${SITE}</h4>
        <p>An interactive golf academy built on the ball-flight laws. Every tool on this site runs real physics in your browser so the lessons show you the cause, not just the cure.</p>
      </div>
      <div><h4>Curriculum</h4>
        ${list}
      </div>
      <div><h4>Tools</h4>
        <a href="${url('/lessons/ball-flight/')}#nine-flights">Ball Flight Lab</a>
        <a href="${url('/lessons/swing/')}">Swing Plane Viewer</a>
        <a href="${url('/lessons/putting/')}">Green Reader</a>
        <a href="${url('/lessons/wedges/')}">Wedge Clock</a>
        <a href="${url('/lessons/chipping/')}">Chip Calculator</a>
      </div>
      <div><h4>About</h4>
        <p>Built with Three.js. Backdrops generated with Higgsfield. Progress is stored only in your browser.</p>
        <p class="footer__ai">Right-handed golfer shown throughout; left-handers mirror everything.</p>
      </div>
    </div>
    <div class="footer__bottom"><span>© ${new Date().getFullYear()} ${SITE}</span><span>Play well. Practise with purpose.</span></div>
  </div>
</footer>
<div class="grain" aria-hidden="true"></div>`;
}

function renderLesson(l) {
  const next = bySlug[l.next] || lessons[0];
  const prev = lessons.find((x) => x.number === l.number - 1);
  const hero = img(l.hero?.image || l.slug);
  const sectionsHtml = l.sections.map((s, i) => `
    <section class="lesson__section reveal" id="${esc(s.id)}" data-section>
      <div class="lesson__section-head"><span class="lesson__idx mono">${pad(i + 1)}</span><h2>${inline(s.heading)}</h2></div>
      <div class="lesson__body">
        ${s.body.map((p) => `<p>${inline(p)}</p>`).join('\n        ')}
        ${s.keyPoints?.length ? `<ul class="keypoints">${s.keyPoints.map((k) => `<li>${inline(k)}</li>`).join('')}</ul>` : ''}
        ${s.callout ? `<aside class="callout"><div class="callout__title">${inline(s.callout.title)}</div><p>${inline(s.callout.text)}</p></aside>` : ''}
      </div>
      ${s.module ? `<div class="module module--pending" data-module="${esc(s.module.type)}" data-preset="${attrJson(s.module.preset || {})}"${s.module.caption ? ` data-caption="${esc(s.module.caption)}"` : ''}><div class="module__placeholder"><span class="dot"></span>Loading ${esc(s.module.type.replace('-', ' '))}…</div></div>` : ''}
    </section>`).join('\n');

  const railHtml = l.sections.map((s, i) => `<a href="#${esc(s.id)}" data-rail="${esc(s.id)}"><span class="mono">${pad(i + 1)}</span>${esc(s.heading)}</a>`).join('');

  return `${head({ title: `${l.title} · ${SITE}`, description: l.summary, image: hero.src, path: 'lesson' })}
<body class="page-lesson" data-lesson="${esc(l.slug)}" data-next="${esc(next.slug)}">
${navHtml(l.slug)}
<main>
  <section class="lhero" id="top">
    <div class="lhero__bg" data-parallax>${hero.src ? `<img src="${esc(hero.src)}" alt="${esc(hero.alt)}" loading="eager" fetchpriority="high" />` : ''}</div>
    <div class="lhero__veil"></div>
    <div class="container lhero__inner">
      <div class="lhero__top">
        <span class="kicker">Lesson ${pad(l.number)} · ${esc(l.kicker)}</span>
        <span class="lhero__meta mono">${esc(l.duration)} · ${esc(l.level)}</span>
      </div>
      <h1 class="lhero__title">${esc(l.title)}</h1>
      <p class="tagline lhero__tagline">${inline(l.tagline)}</p>
      <p class="lede lhero__summary">${inline(l.summary)}</p>
      <div class="lhero__stats">
        ${(l.hero?.stats || []).map((s) => `<div class="lhero__stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}
      </div>
      <div class="lhero__actions">
        <a class="btn btn--primary" href="#${esc(l.sections[0].id)}">Begin the lesson <span class="arrow">→</span></a>
        ${l.sections.find((s) => s.module) ? `<a class="btn" href="#${esc(l.sections.find((s) => s.module).id)}">Jump to the 3D tool</a>` : ''}
      </div>
    </div>
    <div class="lhero__scroll" aria-hidden="true"><span></span></div>
  </section>

  <div class="container lesson">
    <aside class="lesson__rail" aria-label="In this lesson">
      <div class="lesson__rail-title mono">In this lesson</div>
      <nav>${railHtml}<a href="#faults" data-rail="faults"><span class="mono">··</span>Faults &amp; fixes</a><a href="#drills" data-rail="drills"><span class="mono">··</span>Drills</a><a href="#quiz" data-rail="quiz"><span class="mono">··</span>Checkpoint quiz</a></nav>
      <div class="lesson__rail-progress"><i></i></div>
    </aside>
    <article class="lesson__content">
      ${sectionsHtml}

      <section class="lesson__section reveal" id="faults" data-section>
        <div class="lesson__section-head"><span class="lesson__idx mono">··</span><h2>Faults &amp; fixes</h2></div>
        <div class="faults">
          ${l.faults.map((f) => `<div class="fault"><h3>${inline(f.name)}</h3><p class="fault__symptom"><span>You see</span>${inline(f.symptom)}</p><p class="fault__cause"><span>Because</span>${inline(f.cause)}</p><p class="fault__fix"><span>Fix</span>${inline(f.fix)}</p></div>`).join('\n          ')}
        </div>
      </section>

      <section class="lesson__section reveal" id="drills" data-section>
        <div class="lesson__section-head"><span class="lesson__idx mono">··</span><h2>Drills</h2></div>
        <div class="drills">
          ${l.drills.map((d, i) => `<div class="drill"><div class="drill__head"><span class="drill__num mono">${pad(i + 1)}</span><h3>${inline(d.name)}</h3><span class="drill__reps mono">${esc(d.reps)}</span></div><p class="drill__goal">${inline(d.goal)}</p><ol>${d.steps.map((s) => `<li>${inline(s)}</li>`).join('')}</ol></div>`).join('\n          ')}
        </div>
      </section>

      <section class="lesson__section reveal" id="checklist" data-section>
        <div class="lesson__section-head"><span class="lesson__idx mono">··</span><h2>Range checklist</h2></div>
        <p class="muted">Tick these off as they become automatic. Your ticks are saved in this browser.</p>
        <ul class="checklist" data-checklist>
          ${l.checklist.map((c, i) => `<li><label><input type="checkbox" data-check="${i}" /><span class="box"></span><span>${inline(c)}</span></label></li>`).join('\n          ')}
        </ul>
      </section>

      <section class="lesson__section reveal" id="quiz" data-section>
        <div class="lesson__section-head"><span class="lesson__idx mono">··</span><h2>Checkpoint quiz</h2></div>
        <p class="muted">Five questions. Score four or more to mark this lesson complete.</p>
        <div class="quiz" data-quiz></div>
        <script type="application/json" id="quiz-data">${JSON.stringify(l.quiz).replace(/</g, '\\u003c')}</script>
      </section>

      <nav class="lesson__next reveal" aria-label="Next lesson">
        ${prev ? `<a class="lesson__nav-card" href="${url(`/lessons/${prev.slug}/`)}"><span class="kicker">Previous</span><b>${pad(prev.number)} ${esc(prev.title)}</b></a>` : `<a class="lesson__nav-card" href="${url('/')}"><span class="kicker">Home</span><b>${SITE}</b></a>`}
        <a class="lesson__nav-card lesson__nav-card--next" href="${url(`/lessons/${next.slug}/`)}"><span class="kicker kicker--gold">Next lesson</span><b>${pad(next.number)} ${esc(next.title)}</b><span class="muted">${esc(next.tagline)}</span></a>
      </nav>
    </article>
  </div>
</main>
${footerHtml()}
</body>
</html>
`;
}

// Write lesson pages
for (const l of lessons) {
  const dir = resolve(root, 'lessons', l.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), renderLesson(l));
}

// Curriculum manifest for client-side chrome (no lesson bodies)
const manifest = lessons.map((l) => ({ slug: l.slug, number: l.number, title: l.title, kicker: l.kicker, tagline: l.tagline, summary: l.summary, duration: l.duration, level: l.level, next: l.next, image: l.hero?.image || l.slug }));
writeFileSync(resolve(root, 'src/content/curriculum.js'), `// Generated by tools/generate-pages.mjs — do not edit.\nexport const CURRICULUM = ${JSON.stringify(manifest, null, 2)};\n`);

// Home page: inject curriculum cards + nav/footer between markers
const homePath = resolve(root, 'index.html');
if (existsSync(homePath)) {
  let html = readFileSync(homePath, 'utf8');
  const cards = lessons.map((l) => {
    const im = img(l.hero?.image || l.slug);
    return `<a class="lcard reveal" href="${url(`/lessons/${l.slug}/`)}" data-lesson-card="${esc(l.slug)}" style="--i:${l.number}">
          <div class="lcard__img"><img src="${esc(im.src)}" alt="" loading="lazy" /></div>
          <div class="lcard__body">
            <div class="lcard__top"><span class="mono">${pad(l.number)}</span><span class="lcard__done" aria-hidden="true"></span></div>
            <h3>${esc(l.title)}</h3>
            <p>${inline(l.summary)}</p>
            <div class="lcard__meta mono"><span>${esc(l.kicker)}</span><span>${esc(l.duration)}</span></div>
          </div>
        </a>`;
  }).join('\n        ');
  html = html.replace(/<!-- curriculum:start -->[\s\S]*?<!-- curriculum:end -->/, `<!-- curriculum:start -->\n        ${cards}\n        <!-- curriculum:end -->`);
  html = html.replace(/<!-- nav:start -->[\s\S]*?<!-- nav:end -->/, `<!-- nav:start -->\n${navHtml('home')}\n<!-- nav:end -->`);
  html = html.replace(/<!-- footer:start -->[\s\S]*?<!-- footer:end -->/, `<!-- footer:start -->\n${footerHtml()}\n<!-- footer:end -->`);
  writeFileSync(homePath, html);
}
console.log(`Generated ${lessons.length} lesson pages (base ${BASE})`);
