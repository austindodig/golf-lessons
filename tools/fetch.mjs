import { createServer } from 'vite';
const server = await createServer({ server: { port: 5198, strictPort: false, host: '127.0.0.1' }, logLevel: 'error' });
await server.listen();
const base = `http://127.0.0.1:${server.config.server.port}`;
for (const p of process.argv.slice(2)) {
  const r = await fetch(base + p);
  const t = await r.text();
  console.log(`\n=== ${p} -> ${r.status} (${t.length} bytes)`);
  console.log(t.slice(0, Number(process.env.FETCH_N || 600)));
}
await server.close();
