# Fairway Institute

An interactive golf academy built with Three.js. The website is the instructor: nine lessons, one for every
swing, each with a physics-driven 3D tool.

**Lessons:** Setup · The Full Swing · Driver · Irons · Wedges & Pitching · Chipping · Bunker Play · Putting · The Ball Flight Laws

**Interactive tools**

| Tool | What it does |
| --- | --- |
| Ball Flight Lab | Impact model (face, path, attack angle, speed, strike) → aerodynamic flight with drag and Magnus lift, calibrated to tour launch-monitor averages. Nine ball flights, crane camera, ghost tracers, top-down map. |
| Swing Plane Viewer | Hologram golfer driven by a double-pendulum swing on an inclined plane. Scrub P1–P10, orbit, camera presets, club-head trail and shaft ribbon. Presets for driver, iron, wedge, chip and putter. |
| Green Reader | Tilted green with a rolling ball under gravity and Stimp-derived friction. Set aim and pace, watch the break, ask for the line. |
| Setup Viewer | Address position per club with stance width, ball position, hip hinge and shaft lean measured live. |
| Wedge Clock | 7:30 / 9:00 / 10:30 distance control with an editable personal yardage matrix. |
| Chip Calculator | Landing spots and carry-to-roll ratios by club. |
| Bunker Splash | Entry point, face angle and speed decide whether the sand throws the ball out. |
| Flight Laws | Top-down face/path explorer with the nine ball flights. |

## Develop

```bash
npm install
npm run gen      # regenerate lesson pages from src/content/lessons/*.js
npm run dev      # http://127.0.0.1:5173
npm run build    # static site in dist/
```

Lesson text lives in `src/content/lessons/<slug>.js`. Run `npm run gen` after editing (the build does this automatically).
Interactive tools live in `src/modules/` and are mounted by `data-module` attributes; physics in `src/physics/`.

### Images

The atmospheric backdrops were generated with Higgsfield and are referenced from their CDN in `src/content/images.js`.
To serve optimised local copies instead, run this once on a machine with normal internet access, then commit `public/img`:

```bash
npm run images
```

### Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with the repository name as the base path and
publishes to GitHub Pages (enable Pages → Source: GitHub Actions in the repository settings). Add `public/CNAME`
to deploy at a custom domain root.

### Quality tiers

`src/core/quality.js` picks a tier from the device (software renderer, memory, pointer type). Append `?q=low|medium|high`
to any page to force one. Reduced-motion preferences disable auto-play animations.
