import '../styles/main.css';
import { initChrome } from '../ui/chrome.js';
import { IMAGES, imageUrl } from '../content/images.js';
import { quality } from '../core/quality.js';

initChrome();

// Hero backdrop photograph
const bg = document.querySelector('[data-hero-bg]');
if (bg) { const im = new Image(); im.src = imageUrl('home'); im.alt = IMAGES.home.alt; im.decoding = 'async'; bg.append(im); }

// 3D hero + flyover (lazy, only with WebGL)
if (quality.webgl) {
  const heroStage = document.querySelector('[data-hero-stage]');
  const heroSection = document.getElementById('top');
  import('../modules/Hero.js').then((m) => m.mountHero(heroStage, heroSection)).catch(console.error);
  const pin = document.querySelector('[data-flyover]');
  const flyStage = document.querySelector('[data-flyover-stage]');
  const hud = document.querySelector('[data-flyover-hud]');
  if (pin && flyStage) {
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { io.disconnect(); import('../modules/HoleFlyover.js').then((m) => m.mountFlyover(pin, flyStage, hud)).catch(console.error); } }, { rootMargin: '900px 0px' });
    io.observe(pin);
  }
} else {
  document.querySelector('[data-flyover]')?.classList.add('flyover__pin--static');
}
