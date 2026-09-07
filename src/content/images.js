// Atmospheric backdrops generated with Higgsfield (Cinema Studio Image 2.5) for this site.
// Each entry resolves to a local optimised file in /img when present (run `npm run images`
// on a machine that can reach the CDN), otherwise the original remote render is used.
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3FQ6hJE1ducm6cZtplfchRi2NhJ/';
export const IMAGES = {
  home:       { remote: CDN + 'hf_20260907_183956_3844ffb4-27b7-4729-b9e8-a8d402bbd5cc.png', alt: 'A fairway at dusk with mowing stripes and mist', ratio: '21:9' },
  setup:      { remote: CDN + 'hf_20260907_183956_dcdb60d2-39f5-48db-8143-49825f8b14c7.png', alt: 'An empty practice range at dawn', ratio: '16:9' },
  swing:      { remote: CDN + 'hf_20260907_183956_db0920b9-6b64-4074-8484-9673d3ad609b.png', alt: 'Silhouette of a golfer holding a full finish at dusk', ratio: '16:9' },
  driver:     { remote: CDN + 'hf_20260907_184806_99495049-a427-4ce3-a48d-404a6e5e09cf.png', alt: 'A tee box at dusk looking down a long fairway', ratio: '16:9' },
  irons:      { remote: CDN + 'hf_20260907_183956_6cc3ebb2-9813-4b35-a071-3f75b0ae6efb.png', alt: 'A ball on the fairway with a distant green', ratio: '16:9' },
  wedges:     { remote: CDN + 'hf_20260907_183956_c67bb4cb-240f-42ab-859a-2c962371d571.png', alt: 'A green guarded by bunkers seen from sixty yards', ratio: '16:9' },
  chipping:   { remote: CDN + 'hf_20260907_183956_255dd4c9-adb3-48d3-8cbf-81dc2f502531.png', alt: 'A ball on the fringe beside a green', ratio: '16:9' },
  bunker:     { remote: CDN + 'hf_20260907_183956_71c490f6-6fb4-48d3-9b0e-8dbc8ec794ca.png', alt: 'A raked greenside bunker at dusk', ratio: '16:9' },
  putting:    { remote: CDN + 'hf_20260907_183956_d80fcb57-1cf6-47cc-8acb-b1fdf81370d1.png', alt: 'A green with a flagstick and a ball near the hole', ratio: '16:9' },
  'ball-flight': { remote: CDN + 'hf_20260907_184806_61dc1a13-ef8f-4851-9d65-3a5ddc4f0501.png', alt: 'A ball frozen mid-air on a floodlit range', ratio: '16:9' },
  course:     { remote: CDN + 'hf_20260907_183956_c745c6d4-308b-42bb-8d41-92ebe7b90e47.png', alt: 'Aerial view of a par four at dusk', ratio: '16:9' },
  ballmacro:  { remote: CDN + 'hf_20260907_183956_a5e8f1c1-4244-4925-ad5c-f66a616b32a4.png', alt: 'Macro of golf ball dimples', ratio: '16:9' },
};
// Local files are written by tools/localize-images.mjs as /img/<key>.webp (and <key>-sm.webp).
export function imageUrl(key, { size = 'lg' } = {}) {
  const img = IMAGES[key];
  if (!img) return '';
  if (img.local) return size === 'sm' ? img.local.replace('.webp', '-sm.webp') : img.local;
  return img.remote;
}
