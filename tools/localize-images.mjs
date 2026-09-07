// Downloads the generated backdrops and writes optimised WebP files into public/img.
// Run on a machine with normal internet access: `npm run images`. Then rebuild.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { IMAGES } from '../src/content/images.js';

const out = resolve('public/img');
mkdirSync(out, { recursive: true });
let manifest = readFileSync('src/content/images.js', 'utf8');
for (const [key, img] of Object.entries(IMAGES)) {
  try {
    const res = await fetch(img.remote);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const lg = img.ratio === '21:9' ? 2560 : 1920;
    await sharp(buf).resize({ width: lg, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${out}/${key}.webp`);
    await sharp(buf).resize({ width: 640 }).webp({ quality: 60 }).toFile(`${out}/${key}-sm.webp`);
    const re = new RegExp(`(\\n\\s*'?${key}'?:\\s*\\{)`);
    if (!manifest.includes(`local: '/img/${key}.webp'`)) manifest = manifest.replace(re, `$1 local: '/img/${key}.webp',`);
    console.log('ok', key);
  } catch (e) {
    console.log('skip', key, e.message);
  }
}
writeFileSync('src/content/images.js', manifest);
console.log('done — commit public/img and src/content/images.js');
