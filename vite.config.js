import { defineConfig } from 'vite';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, statSync } from 'node:fs';

const root = dirname(fileURLToPath(import.meta.url));

// Discover every index.html outside node_modules/dist so the multi-page build
// picks up new lesson pages automatically.
function findPages(dir, out = {}) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', 'dist', '.git', 'tools', 'public', 'dev'].includes(entry)) continue;
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) findPages(full, out);
    else if (entry === 'index.html') {
      const rel = relative(root, dirname(full)) || 'main';
      out[rel.replace(/[\\/]/g, '_')] = full;
    }
  }
  return out;
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    target: 'es2020',
    rollupOptions: { input: findPages(root) },
    chunkSizeWarningLimit: 1500,
  },
  server: { host: '127.0.0.1', port: 5173, strictPort: false },
});
