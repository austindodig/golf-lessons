// Device quality tiers so the site stays smooth on phones and software renderers.
function detect() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('q');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let webgl = false, gpu = '';
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    webgl = !!gl;
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    }
  } catch { webgl = false; }
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(innerWidth, innerHeight) < 700;
  const software = /swiftshader|llvmpipe|software/i.test(gpu);
  const mem = navigator.deviceMemory || 8;
  let tier = 'high';
  if (software || mem <= 2) tier = 'low';
  else if (coarse || small || mem <= 4 || (navigator.hardwareConcurrency || 8) <= 4) tier = 'medium';
  if (forced && ['low', 'medium', 'high'].includes(forced)) tier = forced;
  const dpr = tier === 'high' ? 1.75 : tier === 'medium' ? 1.35 : 1;
  return { tier, dpr, webgl, gpu, reducedMotion, bloom: tier !== 'low', shadows: tier === 'high', touch: coarse };
}
export const quality = detect();
if (!quality.webgl) document.documentElement.classList.add('no-webgl');
document.documentElement.dataset.tier = quality.tier;
